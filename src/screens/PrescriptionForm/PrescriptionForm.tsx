import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareInput from '@src/components/Input/MediCareInput';
import PrescriptionHeader from './components/PrescriptionHeader';
import SectionHeader from './components/SectionHeader';
import EditableList from './components/EditableList';
import FormCard from './components/FormCard';
import SubCard from './components/SubCard';
import {
  filterNullValues,
  formatLabel,
  getSectionIcon,
  isArrayOfObjects,
  isArrayOfStrings,
  shouldSkipField,
} from './utils/formUtils';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/navigation/Screens';
import { useSaveMutation } from '@src/redux/features/files/uploadFile';
import { showError } from '@src/helper/alert';
import { UploadPrescriptionResponse } from '@src/utils/types';
import Checkbox from '@src/components/Input/Checkbox';
import MediCareText from '@src/components/Text/MediCareText';
import { useTheme } from '@react-navigation/native';

interface PrescriptionFormData extends UploadPrescriptionResponse {
  isCurrent?: boolean;
}

const PrescriptionForm: React.FC<
  NativeStackScreenProps<RootStackParamList, 'FormScreen'>
> = ({ route }) => {
  const { data: prescriptionData } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyles(insets);
  const theme = useTheme();

  const [save, { isLoading }] = useSaveMutation();
  const [warningDismissed, setWarningDismissed] = useState(false);

  // State to manage all form data
  const [formData, setFormData] =
    useState<PrescriptionFormData>(prescriptionData);

  // Always-visible doctor fields (even if Groq didn't extract)
  const [doctorName, setDoctorName] = useState(
    prescriptionData?.doctor?.name || ''
  );
  const [doctorSpecialization, setDoctorSpecialization] = useState(
    prescriptionData?.doctor?.specialization || ''
  );
  const [doctorHospital, setDoctorHospital] = useState(
    ((prescriptionData?.doctor as any)?.hospital as string) || ''
  );

  // Always-visible patient fields (even if Groq didn't extract)
  const [patientName, setPatientName] = useState(
    prescriptionData?.patient?.name || ''
  );
  const [patientAge, setPatientAge] = useState(
    prescriptionData?.patient?.age != null
      ? String(prescriptionData.patient.age)
      : ''
  );
  const [patientGender, setPatientGender] = useState(
    prescriptionData?.patient?.gender || ''
  );

const handleSave = async () => {
  try {
    const dataToSave = {
      ...formData,
      doctor: {
        ...formData.doctor,
        name: doctorName,
        specialization: doctorSpecialization,
        ...(doctorHospital ? { hospital: doctorHospital } : {}),
      },
      patient: {
        ...formData.patient,
        name: patientName,
        age: patientAge,
        gender: patientGender,
      },
      tests: formData.tests?.map((test: any, index: number) => ({
        ...test,
        testDefinition:
          (prescriptionData.tests?.[index] as any)?.testDefinition ||
          test.testDefinition || null,
        patientRelevance:
          (prescriptionData.tests?.[index] as any)?.patientRelevance ||
          test.patientRelevance || null,
        validityLevel:
          (prescriptionData.tests?.[index] as any)?.validityLevel ||
          test.validityLevel || null,
      })),
    };

    // If editing an existing prescription (_id exists), use update; otherwise save new
    const existingId = (prescriptionData as any)?._id;
    let res;
    if (existingId) {
      res = await save({ ...dataToSave, _prescriptionId: existingId });
    } else {
      res = await save(dataToSave);
    }

    if ('data' in res) {
      navigation.reset({ index: 0, routes: [{ name: 'DrawerNavigation' }] });
    } else {
      throw res.error;
    }
  } catch (error) {
    showError(error);
  }
};

  const handleToggleIsCurrent = (v: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      isCurrent: v,
    }));
  };

  const handleStringFieldChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayOfStringsChange = (key: string, updatedArray: string[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: updatedArray,
    }));
  };

  const handleArrayOfObjectsChange = (key: string, updatedArray: any[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: updatedArray,
    }));
  };

  const handleObjectFieldChange = (
    key: string,
    fieldKey: string,
    value: any,
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [fieldKey]: value,
      },
    }));
  };

  const renderArrayOfObjects = (key: string, items: any[]) => {
    let itemsToRender = items;
    let placeholders: Record<string, string> | undefined;

    const isMedicines =
      key.toLowerCase().includes('medicine') ||
      (items.length > 0 &&
        items[0] &&
        ('dosage' in items[0] || 'frequency' in items[0]));

    if (isMedicines) {
      placeholders = {
        frequency: 'Set your frequency manually',
      };
      itemsToRender = items.map(item => ({
        ...item,
        frequency: item.frequency ?? '',
      }));
    }

    const filteredArray = itemsToRender.filter(item => {
      const filtered = filterNullValues(item);
      return Object.keys(filtered).length > 0;
    });

    if (filteredArray.length === 0) return null;

    const isMedicineSection =
      key.toLowerCase().includes('medicine') ||
      (items.length > 0 && items[0] && ('dosage' in items[0] || 'frequency' in items[0]));
    const isTestSection = key.toLowerCase().includes('test');

    // Strip raw DB fields from test objects — only keep name and type for display/edit
    if (isTestSection) {
      itemsToRender = items.map((item: any) => ({
        name: item.name || '',
        type: item.type || '',
      }));
    }

    const label = isMedicineSection
      ? 'Medicine'
      : isTestSection
      ? 'Test'
      : formatLabel(key).replace(/s$/, '');

    return (
      <View key={key} style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <SectionHeader
            title={`${formatLabel(key)} (${filteredArray.length})`}
            icon={getSectionIcon(key)}
          />
          <TouchableOpacity
            style={styles.addIconBtn}
            onPress={() => {
              const emptyItem = isMedicineSection
                ? {
                    name: '',
                    dosage: '',
                    frequency: '',
                    duration: '',
                    instructions: '',
                  }
                : { name: '', type: '' };
              handleArrayOfObjectsChange(key, [
                ...(formData as any)[key],
                emptyItem,
              ]);
            }}
          >
            <MediCareText tag="body" color="#1EA34A" weight="SemiBold">
              + {label}
            </MediCareText>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <SubCard
            items={filteredArray}
            formatLabel={formatLabel}
            onUpdate={(updatedArray: any) =>
              handleArrayOfObjectsChange(key, updatedArray)
            }
            placeholders={placeholders}
            allowDelete={true}
            itemLabel={label}
          />
        </View>
      </View>
    );
  };

  const renderArrayOfStrings = (key: string, items: string[]) => {
    const filteredArray = filterNullValues(items);
    if (filteredArray.length === 0) return null;

    return (
      <View key={key} style={styles.card}>
        <SectionHeader title={formatLabel(key)} icon={getSectionIcon(key)} />
        <View style={styles.cardContent}>
          <EditableList
            items={filteredArray}
            onUpdate={updatedArray =>
              handleArrayOfStringsChange(key, updatedArray)
            }
          />
        </View>
      </View>
    );
  };

  const renderObjectCard = (key: string, obj: any) => {
    const filteredObj = filterNullValues(obj);
    const entries = Object.entries(filteredObj);

    if (entries.length === 0) return null;

    return (
      <View key={key} style={styles.card}>
        <SectionHeader title={formatLabel(key)} icon={getSectionIcon(key)} />
        <View style={styles.cardContent}>
          <FormCard
            data={filteredObj}
            formatLabel={formatLabel}
            onUpdate={(fieldKey: string, value: string) =>
              handleObjectFieldChange(key, fieldKey, value)
            }
          />
        </View>
      </View>
    );
  };

  const renderStringField = (key: string, value: string) => {
    return (
      <View key={key} style={styles.card}>
        <MediCareInput
          label={formatLabel(key)}
          value={value}
          onChangeText={text => handleStringFieldChange(key, text)}
          multiline
          numberOfLines={4}
          style={styles.multilineInput}
          containerStyle={styles.inputContainer}
        />
      </View>
    );
  };

  const renderField = (key: string, value: any) => {
    // Skip doctor and patient — we render them manually below
    if (key === 'doctor' || key === 'patient') return null;
    if (value === null || shouldSkipField(key)) return null;

    if (isArrayOfObjects(value)) return renderArrayOfObjects(key, value);
    if (isArrayOfStrings(value)) return renderArrayOfStrings(key, value);
    if (typeof value === 'object' && !Array.isArray(value))
      return renderObjectCard(key, value);
    if (typeof value === 'string') return renderStringField(key, value);

    return null;
  };

  return (
    <View style={styles.container}>
      <PrescriptionHeader
        title="Prescription Details"
        onClose={() => navigation.goBack()}
        onSave={handleSave}
        isLoading={isLoading}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ⚠️ AI Warning Banner */}
          {!warningDismissed && (
            <View style={styles.warningBanner}>
              <View style={styles.warningContent}>
                <MediCareText tag="body" style={styles.warningIcon}>⚠️</MediCareText>
                <MediCareText tag="body2" color="#92400E" style={styles.warningText}>
                  AI may make mistakes. Please verify all details match your
                  prescription before saving.
                </MediCareText>
              </View>
              <TouchableOpacity
                onPress={() => setWarningDismissed(true)}
                style={styles.warningClose}
              >
                <MediCareText tag="body2" color="#92400E">✕</MediCareText>
              </TouchableOpacity>
            </View>
          )}

          {/* 👨‍⚕️ Doctor Information — always visible */}
          <View style={styles.card}>
            <SectionHeader title="Doctor Information" icon="👨‍⚕️" />
            <View style={styles.cardContent}>
              <MediCareInput
                label="Doctor Name"
                value={doctorName}
                onChangeText={setDoctorName}
                placeholder="e.g. Dr. Ahmed"
                containerStyle={styles.inputContainer}
              />
              <MediCareInput
                label="Specialization"
                value={doctorSpecialization}
                onChangeText={setDoctorSpecialization}
                placeholder="e.g. General Physician"
                containerStyle={styles.inputContainer}
              />
              <MediCareInput
                label="Hospital / Clinic"
                value={doctorHospital}
                onChangeText={setDoctorHospital}
                placeholder="e.g. City Hospital"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>

          {/* 👤 Patient Information — always visible */}
          <View style={styles.card}>
            <SectionHeader title="Patient Information" icon="👤" />
            <View style={styles.cardContent}>
              <MediCareInput
                label="Patient Name"
                value={patientName}
                onChangeText={setPatientName}
                placeholder="e.g. John Doe"
                containerStyle={styles.inputContainer}
              />
              <MediCareInput
                label="Age"
                value={patientAge}
                onChangeText={setPatientAge}
                placeholder="e.g. 35"
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
              />
              <MediCareInput
                label="Gender"
                value={patientGender}
                onChangeText={setPatientGender}
                placeholder="e.g. Male / Female"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>

          {/* Remaining fields from Groq (medicines, symptoms, etc.) */}
          {Object.entries(formData).map(([key, value]) =>
            renderField(key, value),
          )}

          <Checkbox
            label="This is a current prescription"
            value={formData?.isCurrent}
            onChangeValue={handleToggleIsCurrent}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PrescriptionForm;

const useStyles = makeStyles((theme, props: EdgeInsets) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[70],
    paddingTop: props.top,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // AI Warning Banner
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 8,
  },
  warningIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  warningText: {
    flex: 1,
    lineHeight: 20,
  },
  warningClose: {
    padding: 4,
    marginLeft: 8,
  },

  // Cards
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addIconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1EA34A',
  },
  cardContent: {
    gap: 12,
  },
  inputContainer: {
    marginBottom: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1EA34A',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    flex: 1,
    color: theme.text[110],
  },
}));
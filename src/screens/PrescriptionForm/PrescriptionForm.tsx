import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
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

  const [save, { isLoading }] = useSaveMutation();

  // State to manage all form data
  const [formData, setFormData] =
    useState<PrescriptionFormData>(prescriptionData);

  // Handle save - print form data
  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        tests: formData.tests?.map((test: any, index: number) => ({
          ...test,
          testDefinition: (prescriptionData.tests?.[index] as any)?.testDefinition || test.testDefinition || null,
          patientRelevance: (prescriptionData.tests?.[index] as any)?.patientRelevance || test.patientRelevance || null,
          validityLevel: (prescriptionData.tests?.[index] as any)?.validityLevel || test.validityLevel || null,
        })),
      };
      
      const res = await save(dataToSave);
      if ('data' in res) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerNavigation' }],
        });
      } else {
        throw res.error;
      }
    } catch (error) {
      showError(error);
    }
  };

  // Handle checkbox toggle
  const handleToggleIsCurrent = (v: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      isCurrent: v,
    }));
  };

  // Update handler for string fields
  const handleStringFieldChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update handler for array of strings
  const handleArrayOfStringsChange = (key: string, updatedArray: string[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: updatedArray,
    }));
  };

  // Update handler for array of objects
  const handleArrayOfObjectsChange = (key: string, updatedArray: any[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: updatedArray,
    }));
  };

  // Update handler for object fields
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

  // Render array of objects
  const renderArrayOfObjects = (key: string, items: any[]) => {
    let itemsToRender = items;
    let placeholders: Record<string, string> | undefined;

    // Check if section is 'medicines' or looks like medicines (heuristic)
    const isMedicines =
      key.toLowerCase().includes('medicine') ||
      (items.length > 0 &&
        items[0] &&
        ('dosage' in items[0] || 'frequency' in items[0]));

    if (isMedicines) {
      // For medicines, ensure frequency is always visible and has a placeholder
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

    const isMedicineSection = key.toLowerCase().includes('medicine') ||
      (items.length > 0 && items[0] && ('dosage' in items[0] || 'frequency' in items[0]));
    const isTestSection = key.toLowerCase().includes('test');
    const label = isMedicineSection ? 'Medicine' : isTestSection ? 'Test' : formatLabel(key).replace(/s$/, '');

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
                ? { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
                : { name: '', type: '' };
              handleArrayOfObjectsChange(key, [...(formData as any)[key], emptyItem]);
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

  // Render array of strings
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

  // Render object as card
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

  // Render string as multiline input
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

  // Render field based on type
  const renderField = (key: string, value: any) => {
    if (value === null || shouldSkipField(key)) return null;

    // Array of objects
    if (isArrayOfObjects(value)) {
      return renderArrayOfObjects(key, value);
    }

    // Array of strings
    if (isArrayOfStrings(value)) {
      return renderArrayOfStrings(key, value);
    }

    // Object
    if (typeof value === 'object' && !Array.isArray(value)) {
      return renderObjectCard(key, value);
    }

    // String (multiline)
    if (typeof value === 'string') {
      return renderStringField(key, value);
    }

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
          {Object.entries(formData).map(([key, value]) =>
            renderField(key, value),
          )}

          {/* Checkbox for isCurrent */}
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

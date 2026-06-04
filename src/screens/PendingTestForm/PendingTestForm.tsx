import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/Screens';
import MediCareText from '../../components/Text/MediCareText';
import MediCareInput from '../../components/Input/MediCareInput';
import MediCareButton, {
  ButtonType,
} from '../../components/Button/MediCareButton';
import { makeStyles } from '../../hooks/makeStyle';
import CloseIcon from '../../assets/icons/close.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompleteTestReportMutation } from '../../redux/pescription/pescription';
import { showError } from '../../helper/alert';

type Props = NativeStackScreenProps<RootStackParamList, 'PendingTestForm'>;

const PendingTestForm: React.FC<Props> = ({ route, navigation }) => {
  const { file, prescriptionId, testId } = route.params;
  const styles = useStyle();
  const theme = useTheme();

  const [resultSummary, setResultSummary] = useState('');
  const [note, setNote] = useState('');

  const [completeTestReport, { isLoading }] = useCompleteTestReportMutation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('report', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
      formData.append('resultSummary', resultSummary);
      formData.append('notes', note);

      const response = await completeTestReport({
        prescriptionId,
        testId,
        data: formData,
      }).unwrap();

      if ('data' in response) {
        navigation.navigate('DrawerNavigation', {
          screen: 'PendingTests',
        });
      } else {
        throw response.error;
      }
    } catch (error) {
      showError(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
          <CloseIcon width={24} height={24} color={theme.black} />
        </TouchableOpacity>
        <MediCareText tag="h3" weight="Bold" style={styles.title}>
          Test Details
        </MediCareText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: file.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.form}>
          <MediCareInput
            label="Result Summary"
            placeholder="Enter result summary"
            value={resultSummary}
            onChangeText={setResultSummary}
            containerStyle={styles.input}
          />

          <MediCareInput
            label="Note"
            placeholder="Enter any additional notes"
            value={note}
            onChangeText={setNote}
            containerStyle={styles.input}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <MediCareButton
          title="Submit"
          onPress={handleSubmit}
          type={ButtonType.Primary}
          isLoading={isLoading}
          disabled={!resultSummary}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border[80],
  },
  closeButton: {
    padding: 4,
  },
  title: {
    color: theme.black,
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.background[50], // Fallback/Placeholder color
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border[90],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border[80],
  },
}));

export default PendingTestForm;

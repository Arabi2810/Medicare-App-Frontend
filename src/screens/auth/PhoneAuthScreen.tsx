import React, { useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { makeStyles } from '@src/hooks/makeStyle';
import { useTheme } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import MediCareButton, { ButtonType } from '@src/components/Button/MediCareButton';
import { RootStackParamList } from '@src/navigation/Screens';
import { useFirebaseAuth } from '@src/hooks/useFirebaseAuth';
import { PulseSvg } from '@src/utils/icons';

const PhoneAuthScreen = () => {
  const theme = useTheme();
  const styles = useStyle();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { sendPhoneOtp, isLoading } = useFirebaseAuth();
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSendOtp = async () => {
    const isValid = phoneInput.current?.isValidNumber(value);
    if (!isValid) {
      setError('Please enter a valid phone number');
      return;
    }
    setError(undefined);
    const confirmation = await sendPhoneOtp(formattedValue);
    if (confirmation) {
      navigation.navigate('OtpVerify', {
        confirmation,
        phoneNumber: formattedValue,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topSpacer} />
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <PulseSvg stroke={theme.background[130]} height={60} width={60} />
          </View>

          <MediCareText tag="h1" color={theme.text[110]} weight={FontWeight.Bold} style={styles.title}>
            Phone Sign In
          </MediCareText>

          <MediCareText tag="body" color={theme.text[90]} style={styles.subtitle}>
            We'll send a verification code to your number
          </MediCareText>

          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="BD"
            layout="first"
            onChangeText={setText => setValue(setText)}
            onChangeFormattedText={text => setFormattedValue(text)}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
            textInputStyle={styles.phoneTextInput}
            codeTextStyle={styles.phoneCodeText}
            flagButtonStyle={styles.phoneFlagButton}
            withDarkTheme={false}
            withShadow={false}
            autoFocus
          />

          {error && (
            <MediCareText tag="body2" style={styles.errorText}>
              {error}
            </MediCareText>
          )}

          <MediCareButton
            title="Send OTP"
            type={ButtonType.Primary}
            style={styles.button}
            onPress={handleSendOtp}
            isLoading={isLoading}
          />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MediCareText tag="body2" color={theme.text[90]}>
              ← Back to Sign In
            </MediCareText>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PhoneAuthScreen;

const useStyle = makeStyles(theme => ({
  container: { flex: 1, backgroundColor: theme.background[80] },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  topSpacer: { height: 80 },
  bottomSpacer: { height: 40 },
  card: {
    backgroundColor: theme.white,
    borderRadius: 30,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 30,
  },
  iconContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 32, textAlign: 'center', color: '#666' },
  phoneContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.border[80],
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: theme.background[70],
  },
  phoneTextContainer: {
    backgroundColor: theme.background[70],
    borderRadius: 12,
  },
  phoneTextInput: {
    color: theme.text[110],
    fontSize: 16,
  },
  phoneCodeText: {
    color: theme.text[110],
    fontSize: 16,
  },
  phoneFlagButton: {
    borderRightWidth: 1,
    borderRightColor: theme.border[80],
  },
  errorText: {
    color: '#FF3B30',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  button: { width: '100%', marginTop: 16 },
  backButton: { marginTop: 24 },
}));
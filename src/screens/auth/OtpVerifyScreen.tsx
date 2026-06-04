import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { makeStyles } from '@src/hooks/makeStyle';
import { useTheme } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import MediCareButton, { ButtonType } from '@src/components/Button/MediCareButton';
import { RootStackParamList } from '@src/navigation/Screens';
import { useFirebaseAuth } from '@src/hooks/useFirebaseAuth';
import { PulseSvg } from '@src/utils/icons';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerify'>;

const OtpVerifyScreen: React.FC<Props> = ({ route }) => {
  const { confirmation, phoneNumber } = route.params;
  const theme = useTheme();
  const styles = useStyle();
  const navigation = useNavigation();
  const { verifyPhoneOtp, isLoading } = useFirebaseAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;
    await verifyPhoneOtp(confirmation, otpCode, navigation);
  };

  const maskedPhone = phoneNumber.replace(
    /(\+\d{1,3})(\d+)(\d{4})/,
    (_, code, middle, last) => `${code}${'*'.repeat(middle.length)}${last}`
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <PulseSvg stroke={theme.background[130]} height={60} width={60} />
        </View>

        <MediCareText tag="h1" color={theme.text[110]} weight={FontWeight.Bold} style={styles.title}>
          Verify OTP
        </MediCareText>

        <MediCareText tag="body" color={theme.text[90]} style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[110]}>
            {maskedPhone}
          </MediCareText>
        </MediCareText>

        {/* OTP Input boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => { inputRefs.current[index] = ref; }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={text => handleOtpChange(text.slice(-1), index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <MediCareButton
          title="Verify"
          type={ButtonType.Primary}
          style={styles.button}
          onPress={handleVerify}
          isLoading={isLoading}
          disabled={otp.join('').length !== 6}
        />

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <MediCareText tag="body2" color={theme.text[80]}>
              Resend code in {timer}s
            </MediCareText>
          ) : (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MediCareText tag="body2" color={theme.primary} weight={FontWeight.SemiBold}>
                Resend OTP
              </MediCareText>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MediCareText tag="body2" color={theme.text[90]}>
            ← Change phone number
          </MediCareText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpVerifyScreen;

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[80],
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
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
  subtitle: { marginBottom: 32, textAlign: 'center' },
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderColor: theme.border[80],
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text[110],
    backgroundColor: theme.background[70],
  },
  otpBoxFilled: {
    borderColor: theme.primary,
    backgroundColor: theme.white,
  },
  button: { width: '100%' },
  resendContainer: { marginTop: 20 },
  backButton: { marginTop: 16 },
}));
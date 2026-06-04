import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { makeStyles } from '@src/hooks/makeStyle';
import { PulseSvg } from '@src/utils/icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import MediCareButton, { ButtonType } from '@src/components/Button/MediCareButton';
import MediCareInput from '@src/components/Input/MediCareInput';
import { RootStackParamList } from '@src/navigation/Screens';
import { NavigationProp } from '@react-navigation/native';
import { useFirebaseAuth } from '@src/hooks/useFirebaseAuth';

const PasswordRequirement = ({
  met,
  label,
  theme,
}: {
  met: boolean;
  label: string;
  theme: any;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
    <MediCareText
      tag="body2"
      color={met ? '#22c55e' : theme.text[60]}
      weight={FontWeight.Regular}
    >
      {met ? '✓ ' : '○ '}{label}
    </MediCareText>
  </View>
);

const SignUp = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyle();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [fullNameError, setFullNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const { signUpWithEmail, signInWithGoogle, isLoading } = useFirebaseAuth();

  const requirements = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const validateFullName = (v: string) => {
    if (!v) return 'Full name is required';
    if (v.length < 3) return 'Name must be at least 3 characters';
    return undefined;
  };

  const validateEmail = (v: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) return 'Email is required';
    if (!emailRegex.test(v)) return 'Enter a valid email address';
    return undefined;
  };

  const validatePassword = (v: string) => {
    if (!v) return 'Password is required';
    if (v.length < 8) return 'At least 8 characters required';
    if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter';
    if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter';
    if (!/[0-9]/.test(v)) return 'Add at least one number';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Add at least one special character';
    return undefined;
  };

  const onSubmit = async () => {
    const nameErr = validateFullName(fullName);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setFullNameError(nameErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (!nameErr && !eErr && !pErr) {
      await signUpWithEmail(email, password, fullName, navigation);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSpacer} />
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <PulseSvg stroke={theme.background[130]} height={60} width={60} />
          </View>

          <MediCareText tag="h1" color={theme.text[110]} weight={FontWeight.Bold} style={styles.title}>
            Create Account
          </MediCareText>

          <MediCareText tag="body" color={theme.text[90]} weight={FontWeight.Regular} style={styles.subtitle}>
            Join MediCare today
          </MediCareText>

          <View style={styles.formContainer}>
            <MediCareInput
              label="Full Name"
              placeholder="Mohammad Rahman"
              value={fullName}
              onChangeText={v => { setFullName(v); if (fullNameError) setFullNameError(undefined); }}
              containerStyle={styles.inputContainer}
              onBlur={() => setFullNameError(validateFullName(fullName))}
              error={fullNameError}
            />
            <MediCareInput
              label="Email"
              placeholder="rahman@example.com"
              value={email}
              onChangeText={v => { setEmail(v); if (emailError) setEmailError(undefined); }}
              autoCapitalize="none"
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
              onBlur={() => setEmailError(validateEmail(email))}
              error={emailError}
            />
            <MediCareInput
              label="Password"
              placeholder="Min 8 chars, A-Z, a-z, 0-9, @#$"
              value={password}
              onChangeText={v => {
                setPassword(v);
                if (passwordError) setPasswordError(undefined);
              }}
              secureTextEntry
              containerStyle={{ marginBottom: 8 }}
              onFocus={() => setShowRequirements(true)}
              onBlur={() => {
                setShowRequirements(false);
                setPasswordError(validatePassword(password));
              }}
              error={passwordError}
            />

            {showRequirements && (
              <View style={styles.requirementsBox}>
                <MediCareText tag="body2" color={theme.text[90]} weight={FontWeight.SemiBold} style={{ marginBottom: 6 }}>
                  Password must have:
                </MediCareText>
                <PasswordRequirement met={requirements.length} label="At least 8 characters" theme={theme} />
                <PasswordRequirement met={requirements.upper} label="One uppercase letter (A-Z)" theme={theme} />
                <PasswordRequirement met={requirements.lower} label="One lowercase letter (a-z)" theme={theme} />
                <PasswordRequirement met={requirements.number} label="One number (0-9)" theme={theme} />
                <PasswordRequirement met={requirements.special} label="One special character (@#$!...)" theme={theme} />
              </View>
            )}

            <View style={{ marginBottom: 16 }} />

            <MediCareButton
              title="Create Account"
              type={ButtonType.Primary}
              style={styles.signUpButton}
              onPress={onSubmit}
              isLoading={isLoading}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <MediCareText tag="body2" color={theme.text[80]} style={styles.dividerText}>
                or sign up with
              </MediCareText>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => signInWithGoogle(navigation)}
              disabled={isLoading}
            >
              <Image
                source={require('@src/assets/images/google.png')}
                style={styles.socialIcon}
              />
              <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[110]}>
                Continue with Google
              </MediCareText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { marginTop: 12 }]}
              onPress={() => navigation.navigate('PhoneAuth')}
              disabled={isLoading}
            >
              <MediCareText tag="body" style={styles.phoneIcon}>📱</MediCareText>
              <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[110]}>
                Continue with Phone
              </MediCareText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInContainer}
              onPress={() => navigation.goBack()}
            >
              <MediCareText tag="body2" color={theme.text[90]} weight={FontWeight.Regular}>
                Already have an account?{' '}
                <MediCareText tag="body2" color={theme.primary} weight={FontWeight.SemiBold}>
                  Sign In
                </MediCareText>
              </MediCareText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const useStyle = makeStyles(theme => ({
  container: { flex: 1, backgroundColor: theme.background[80] },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40, paddingHorizontal: 32 },
  topSpacer: { flex: 3, minHeight: 60 },
  bottomSpacer: { flex: 1, minHeight: 40 },
  card: {
    backgroundColor: theme.white,
    borderRadius: 30,
    paddingTop: 36,
    paddingHorizontal: 22,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 24,
  },
  iconContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { marginBottom: 6 },
  subtitle: { marginBottom: 32 },
  formContainer: { width: '100%' },
  inputContainer: { marginBottom: 20 },
  signUpButton: { marginTop: 6 },
  requirementsBox: {
    backgroundColor: theme.background[80],
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.border[80] },
  dividerText: { marginHorizontal: 12 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border[80],
    borderRadius: 12,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: theme.white,
  },
  socialIcon: { width: 20, height: 20 },
  phoneIcon: { fontSize: 20 },
  signInContainer: { alignItems: 'center', marginTop: 20 },
}));
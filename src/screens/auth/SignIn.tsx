import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { makeStyles } from '@src/hooks/makeStyle';
import { PulseSvg } from '@src/utils/icons';
import { useTheme, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@src/navigation/Screens';
import { NavigationProp } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import MediCareButton, { ButtonType } from '@src/components/Button/MediCareButton';
import MediCareInput from '@src/components/Input/MediCareInput';
import { useFirebaseAuth } from '@src/hooks/useFirebaseAuth';
import auth from '@react-native-firebase/auth';
import { useToast } from '@src/components/Toast/ToastProvider';

const SignIn = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const styles = useStyle();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const { signInWithEmail, signInWithGoogle, isLoading } = useFirebaseAuth();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { showToast } = useToast();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Enter a valid email address';
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    return undefined;
  };

  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail || !emailRegex.test(forgotEmail)) {
      showToast('Enter a valid email address.', 'warning');
      return;
    }
    try {
      setForgotLoading(true);
      await auth().sendPasswordResetEmail(forgotEmail);
      showToast(`Password reset link sent to ${forgotEmail}.`, 'success');
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (e: any) {
       showToast(e.message || 'Failed to send reset email', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const onSubmit = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (!eErr && !pErr) {
      await signInWithEmail(email, password, navigation);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <View style={styles.topSpacer} />
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <PulseSvg stroke={theme.background[130]} height={60} width={60} />
        </View>

        <MediCareText tag="h1" color={theme.text[110]} weight={FontWeight.Bold} style={styles.title}>
          Welcome Back
        </MediCareText>

        <MediCareText tag="body" color={theme.text[90]} weight={FontWeight.Regular} style={styles.subtitle}>
          Sign in to continue
        </MediCareText>

        <View style={styles.formContainer}>
          <MediCareInput
            label="Email"
            placeholder="Enter your email"
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
            placeholder="Enter password"
            value={password}
            onChangeText={v => { setPassword(v); if (passwordError) setPasswordError(undefined); }}
            secureTextEntry
            containerStyle={styles.inputContainer}
            onBlur={() => setPasswordError(validatePassword(password))}
            error={passwordError}
          />

          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => setShowForgotModal(true)}
          >
            <MediCareText tag="body2" color={theme.primary} weight={FontWeight.Medium}>
              Forgot password?
            </MediCareText>
          </TouchableOpacity>

          <MediCareButton
            title="Sign In"
            type={ButtonType.Primary}
            style={styles.signInButton}
            onPress={onSubmit}
            isLoading={isLoading && !googleLoading}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <MediCareText tag="body2" color={theme.text[80]} style={styles.dividerText}>
              or continue with
            </MediCareText>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={async () => {
              setGoogleLoading(true);
              try {
                await signInWithGoogle(navigation);
              } finally {
                setGoogleLoading(false);
              }
            }}
            disabled={isLoading || googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <>
                <Image
                  source={require('@src/assets/images/google.png')}
                  style={styles.socialIcon}
                />
                <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[110]}>
                  Continue with Google
                </MediCareText>
              </>
            )}
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles.socialButton, { marginTop: 12 }]}
            onPress={() => navigation.navigate('PhoneAuth')}
            disabled={isLoading || googleLoading}
          >
            <MediCareText tag="body" style={styles.phoneIcon}>📱</MediCareText>
            <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[110]}>
              Continue with Phone
            </MediCareText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerContainer}
            onPress={() => navigation.navigate('SignUp')}
          >
            <MediCareText tag="body2" color={theme.text[90]} weight={FontWeight.Regular}>
              Don't have an account?{' '}
              <MediCareText tag="body2" color={theme.primary} weight={FontWeight.SemiBold}>
                Register
              </MediCareText>
            </MediCareText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomSpacer} />

      <Modal
        visible={showForgotModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MediCareText tag="h2" color={theme.text[110]} weight={FontWeight.Bold} style={styles.modalTitle}>
              Reset Password
            </MediCareText>
            <MediCareText tag="body2" color={theme.text[80]} weight={FontWeight.Regular} style={styles.modalSubtitle}>
              Enter your email and we'll send you a reset link.
            </MediCareText>
            <MediCareInput
              label="Email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              containerStyle={{ marginBottom: 20 }}
            />
            <MediCareButton
              title="Send Reset Link"
              type={ButtonType.Primary}
              onPress={handleForgotPassword}
              isLoading={forgotLoading}
            />
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => { setShowForgotModal(false); setForgotEmail(''); }}
            >
              <MediCareText tag="body2" color={theme.text[80]} weight={FontWeight.Medium}>
                Cancel
              </MediCareText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const useStyle = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[80],
    justifyContent: 'flex-start',
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  topSpacer: { flex: 3 },
  bottomSpacer: { flex: 1 },
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
  signInButton: { marginTop: 6 },
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
  registerContainer: { alignItems: 'center', marginTop: 20 },
  forgotContainer: { alignSelf: 'flex-end', marginTop: -10, marginBottom: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: theme.white,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    shadowColor: theme.shadow[100],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
  },
  modalTitle: { marginBottom: 8, textAlign: 'center' },
  modalSubtitle: { marginBottom: 20, textAlign: 'center' },
  modalCancel: { alignItems: 'center', marginTop: 14 },
}));
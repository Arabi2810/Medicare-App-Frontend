import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import MediCareInput from '@src/components/Input/MediCareInput';
import MediCareButton, { ButtonType } from '@src/components/Button/MediCareButton';
import { useGetProfileQuery, useUpdateProfileMutation } from '@src/redux/features/user/userApi';
import { nameInitials } from '@src/helper/nameInitials';
import { CloseSvg } from '@src/utils/icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { useAppDispatch } from '@src/redux/store';
import { setAccessToken } from '@src/redux/features/user/authSlice';
import { useAppSelector } from '@src/redux/store';
import { useDeleteAccountMutation } from '@src/redux/features/user/userApi';
import { logout } from '@src/redux/features/user/authSlice';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Password strength checker
const checkPasswordStrength = (password: string) => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
});

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const theme = useTheme();
  const checks = checkPasswordStrength(password);
  const passed = Object.values(checks).filter(Boolean).length;

  const strengthColor = passed <= 2 ? '#ef4444' : passed <= 3 ? '#f97316' : passed <= 4 ? '#eab308' : '#22c55e';
  const strengthLabel = passed <= 2 ? 'Weak' : passed <= 3 ? 'Fair' : passed <= 4 ? 'Good' : 'Strong';

  if (!password) return null;

  return (
    <View style={{ marginTop: 8, marginBottom: 4 }}>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i <= passed ? strengthColor : '#e5e7eb',
            }}
          />
        ))}
      </View>
      <MediCareText tag="body2" color={strengthColor} weight={FontWeight.Medium}>
        {strengthLabel}
      </MediCareText>
      <View style={{ marginTop: 8, gap: 4 }}>
        {[
          { key: 'minLength', label: 'At least 8 characters' },
          { key: 'hasUppercase', label: 'One uppercase letter (A–Z)' },
          { key: 'hasLowercase', label: 'One lowercase letter (a–z)' },
          { key: 'hasNumber', label: 'One number (0–9)' },
          { key: 'hasSpecial', label: 'One special character (!@#$...)' },
        ].map(({ key, label }) => (
          <MediCareText
            key={key}
            tag="body2"
            color={checks[key as keyof typeof checks] ? '#22c55e' : '#6b7280'}
          >
            {checks[key as keyof typeof checks] ? '✓' : '○'} {label}
          </MediCareText>
        ))}
      </View>
    </View>
  );
};

const Profile = () => {
  const theme = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();
  const { data, isLoading, refetch } = useGetProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  const user = data?.data || data;

  // Profile fields
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email change fields
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const [verificationSent, setVerificationSent] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const firebaseUser = auth().currentUser;
  const isEmailVerified = firebaseUser?.emailVerified ?? true;
  const isEmailUser = firebaseUser?.providerData.some(p => p.providerId === 'password');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBloodGroup(user.profile?.bloodGroup || null);
      setGender(user.profile?.gender || null);
      setDateOfBirth(user.profile?.dateOfBirth || '');
      setHeight(user.profile?.height || '');
      setWeight(user.profile?.weight || '');
      setAllergies(user.profile?.allergies?.join(', ') || '');
      setChronicConditions(user.profile?.chronicConditions?.join(', ') || '');
      setEmergencyContact(user.profile?.emergencyContact || '');
      setAddress(user.profile?.address || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const result = await updateProfile({
        fullName,
        bloodGroup,
        gender,
        dateOfBirth,
        height,
        weight,
        allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
        chronicConditions: chronicConditions.split(',').map(c => c.trim()).filter(Boolean),
        emergencyContact,
        address,
      }).unwrap();

    
      dispatch(setAccessToken({
        token: authState.token,
        user: {
          ...authState.user!,
          fullName: fullName,
        },
        hydrated: true,
      }));

    Alert.alert('Success', 'Profile updated successfully');
  } catch {
    Alert.alert('Error', 'Failed to update profile');
  }
};

  const handleDeleteAccount = () => {
    console.log('TOKEN:', authState.token);
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your prescriptions, reminders, and data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount({}).unwrap();
              // Sign out from Firebase
              await auth().signOut();
              try { await GoogleSignin.signOut(); } catch {}
              dispatch(logout());
            } catch {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSendVerification = async () => {
    try {
      setVerifyLoading(true);
      await firebaseUser?.sendEmailVerification();
      setVerificationSent(true);
      Alert.alert('Sent', 'Verification email sent. Check your inbox.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send verification email');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const checks = checkPasswordStrength(newPassword);
    const allPassed = Object.values(checks).every(Boolean);
    if (!allPassed) {
      Alert.alert('Weak Password', 'Password must meet all requirements shown below.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    try {
      setPasswordLoading(true);
      // Re-authenticate first
      const credential = auth.EmailAuthProvider.credential(
        firebaseUser?.email || '',
        currentPassword
      );
      await firebaseUser?.reauthenticateWithCredential(credential);
      await firebaseUser?.updatePassword(newPassword);
      Alert.alert('Success', 'Password changed successfully.');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Current password is incorrect.');
      } else {
        Alert.alert('Error', e.message || 'Failed to change password');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail.includes('@')) {
      Alert.alert('Invalid', 'Please enter a valid email address.');
      return;
    }
    try {
      setEmailLoading(true);
      const credential = auth.EmailAuthProvider.credential(
        firebaseUser?.email || '',
        emailPassword
      );
      await firebaseUser?.reauthenticateWithCredential(credential);
      await firebaseUser?.verifyBeforeUpdateEmail(newEmail);
      Alert.alert(
        'Verification Sent',
        `A verification link was sent to ${newEmail}. Click it to confirm the email change.`
      );
      setShowEmailModal(false);
      setNewEmail('');
      setEmailPassword('');
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Current password is incorrect.');
      } else {
        Alert.alert('Error', e.message || 'Failed to change email');
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.includes('@')) {
      Alert.alert('Invalid', 'Enter a valid email address.');
      return;
    }
    try {
      setForgotLoading(true);
      await auth().sendPasswordResetEmail(forgotEmail);
      Alert.alert('Sent', `Password reset link sent to ${forgotEmail}. Check your inbox.`);
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CloseSvg width={24} height={24} stroke={theme.white} />
        </TouchableOpacity>
        <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.white}>
          My Profile
        </MediCareText>
        <TouchableOpacity onPress={handleSave} disabled={isUpdating}>
          <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.white}>
            {isUpdating ? 'Saving...' : 'Save'}
          </MediCareText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            {user?.profile?.profilePhoto ? (
              <Image source={{ uri: user.profile.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <MediCareText tag="h1" weight={FontWeight.Bold} color={theme.white}>
                {nameInitials(fullName || user?.fullName || '')}
              </MediCareText>
            )}
          </View>
          <MediCareText tag="h3" weight={FontWeight.SemiBold} color={theme.white} style={{ marginTop: 12 }}>
            {fullName || user?.fullName}
          </MediCareText>
          <MediCareText tag="body" color={theme.whiteTransparent}>
            {user?.email || firebaseUser?.email}
          </MediCareText>
          {bloodGroup && (
            <View style={styles.bloodGroupBadge}>
              <MediCareText tag="body" weight={FontWeight.Bold} color={theme.white}>
                🩸 {bloodGroup}
              </MediCareText>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Email Verification Banner */}
          {isEmailUser && !isEmailVerified && (
            <View style={styles.verifyBanner}>
              <MediCareText tag="body" weight={FontWeight.SemiBold} color="#92400e">
                ⚠️ Email not verified
              </MediCareText>
              <MediCareText tag="body2" color="#92400e" style={{ marginTop: 4 }}>
                Verify your email to secure your account.
              </MediCareText>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleSendVerification}
                disabled={verifyLoading || verificationSent}
              >
                <MediCareText tag="body2" weight={FontWeight.SemiBold} color="#ffffff">
                  {verifyLoading ? 'Sending...' : verificationSent ? 'Sent ✓' : 'Send Verification Email'}
                </MediCareText>
              </TouchableOpacity>
            </View>
          )}

          {/* Basic Info */}
          <View style={styles.section}>
            <MediCareText tag="h4" weight={FontWeight.SemiBold} color={theme.text[110]} style={styles.sectionTitle}>
              Basic Information
            </MediCareText>
            <MediCareInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              containerStyle={styles.input}
            />
            <MediCareInput
              label="Date of Birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="DD/MM/YYYY"
              containerStyle={styles.input}
            />
            <MediCareText tag="body" weight={FontWeight.Medium} color={theme.text[110]} style={styles.label}>
              Gender
            </MediCareText>
            <View style={styles.chipRow}>
              {['M', 'F', 'Other'].map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.chip, gender === g && styles.chipActive]}
                  onPress={() => setGender(g)}
                >
                  <MediCareText tag="body" weight={FontWeight.Medium} color={gender === g ? theme.white : theme.text[110]}>
                    {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}
                  </MediCareText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <MediCareInput
                label="Height (cm)"
                value={height}
                onChangeText={setHeight}
                placeholder="170"
                keyboardType="numeric"
                containerStyle={[styles.input, { flex: 1, marginRight: 8 }]}
              />
              <MediCareInput
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                placeholder="65"
                keyboardType="numeric"
                containerStyle={[styles.input, { flex: 1 }]}
              />
            </View>
          </View>

          {/* Medical Info */}
          <View style={styles.section}>
            <MediCareText tag="h4" weight={FontWeight.SemiBold} color={theme.text[110]} style={styles.sectionTitle}>
              Medical Information
            </MediCareText>
            <MediCareText tag="body" weight={FontWeight.Medium} color={theme.text[110]} style={styles.label}>
              Blood Group
            </MediCareText>
            <View style={styles.chipRow}>
              {BLOOD_GROUPS.map(bg => (
                <TouchableOpacity
                  key={bg}
                  style={[styles.chip, bloodGroup === bg && styles.chipActive]}
                  onPress={() => setBloodGroup(bg)}
                >
                  <MediCareText tag="body" weight={FontWeight.Medium} color={bloodGroup === bg ? theme.white : theme.text[110]}>
                    {bg}
                  </MediCareText>
                </TouchableOpacity>
              ))}
            </View>
            <MediCareInput
              label="Allergies"
              value={allergies}
              onChangeText={setAllergies}
              placeholder="Penicillin, Aspirin, Dust (comma separated)"
              multiline
              numberOfLines={2}
              containerStyle={styles.input}
            />
            <MediCareInput
              label="Chronic Conditions"
              value={chronicConditions}
              onChangeText={setChronicConditions}
              placeholder="Diabetes, Hypertension (comma separated)"
              multiline
              numberOfLines={2}
              containerStyle={styles.input}
            />
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <MediCareText tag="h4" weight={FontWeight.SemiBold} color={theme.text[110]} style={styles.sectionTitle}>
              Contact Information
            </MediCareText>
            <MediCareInput
              label="Emergency Contact"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="+880 1XXX XXXXXX"
              keyboardType="phone-pad"
              containerStyle={styles.input}
            />
            <MediCareInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Your address"
              multiline
              numberOfLines={2}
              containerStyle={styles.input}
            />
          </View>

          {/* Account Settings — only for email/password users */}
          {isEmailUser && (
            <View style={styles.section}>
              <MediCareText tag="h4" weight={FontWeight.SemiBold} color={theme.text[110]} style={styles.sectionTitle}>
                Account Settings
              </MediCareText>

              <TouchableOpacity style={styles.settingRow} onPress={() => setShowPasswordModal(true)}>
                <MediCareText tag="body" color={theme.text[110]}>🔒 Change Password</MediCareText>
                <MediCareText tag="body" color={theme.text[80]}>›</MediCareText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingRow} onPress={() => setShowEmailModal(true)}>
                <MediCareText tag="body" color={theme.text[110]}>📧 Change Email Address</MediCareText>
                <MediCareText tag="body" color={theme.text[80]}>›</MediCareText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingRow} onPress={() => {
                setForgotEmail(user?.email || firebaseUser?.email || '');
                setShowForgotModal(true);
              }}>
                <MediCareText tag="body" color={theme.text[110]}>🔑 Reset Password via Email</MediCareText>
                <MediCareText tag="body" color={theme.text[80]}>›</MediCareText>
              </TouchableOpacity>
            </View>
          )}

          {/* AI Notice */}
          <View style={styles.aiNotice}>
            <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.colors.primary}>
              🤖 How this helps AI analysis
            </MediCareText>
            <MediCareText tag="body" color={theme.text[80]} style={{ marginTop: 6, lineHeight: 20 }}>
              Your blood group, allergies and chronic conditions help the AI give more accurate test validity analysis, side effect warnings, and prescription audits specifically for you.
            </MediCareText>
          </View>
          <TouchableOpacity
            style={styles.deleteAccountBtn}
            onPress={handleDeleteAccount}
            >
            <MediCareText tag="body" weight={FontWeight.SemiBold} color="#EF4444">
                🗑 Delete Account
            </MediCareText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.text[110]} style={{ marginBottom: 20 }}>
              Change Password
            </MediCareText>
            <MediCareInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              containerStyle={styles.input}
            />
            <MediCareInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              containerStyle={{ marginBottom: 4 }}
            />
            <PasswordStrengthIndicator password={newPassword} />
            <MediCareInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              containerStyle={[styles.input, { marginTop: 12 }]}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: theme.border[80], borderWidth: 1 }]}
                onPress={() => { setShowPasswordModal(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
              >
                <MediCareText tag="body" color={theme.text[90]}>Cancel</MediCareText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handlePasswordChange}
                disabled={passwordLoading}
              >
                <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.white}>
                  {passwordLoading ? 'Saving...' : 'Change'}
                </MediCareText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Email Modal */}
      <Modal visible={showEmailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.text[110]} style={{ marginBottom: 20 }}>
              Change Email
            </MediCareText>
            <MediCareText tag="body2" color={theme.text[80]} style={{ marginBottom: 16 }}>
              A verification link will be sent to your new email. Current email stays active until you verify the new one.
            </MediCareText>
            <MediCareInput
              label="New Email Address"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.input}
            />
            <MediCareInput
              label="Current Password (to confirm)"
              value={emailPassword}
              onChangeText={setEmailPassword}
              secureTextEntry
              containerStyle={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: theme.border[80], borderWidth: 1 }]}
                onPress={() => { setShowEmailModal(false); setNewEmail(''); setEmailPassword(''); }}
              >
                <MediCareText tag="body" color={theme.text[90]}>Cancel</MediCareText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleEmailChange}
                disabled={emailLoading}
              >
                <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.white}>
                  {emailLoading ? 'Sending...' : 'Send Link'}
                </MediCareText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal visible={showForgotModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.text[110]} style={{ marginBottom: 12 }}>
              Reset Password
            </MediCareText>
            <MediCareText tag="body2" color={theme.text[80]} style={{ marginBottom: 16 }}>
              We'll send a password reset link to your email.
            </MediCareText>
            <MediCareInput
              label="Email Address"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: theme.border[80], borderWidth: 1 }]}
                onPress={() => { setShowForgotModal(false); setForgotEmail(''); }}
              >
                <MediCareText tag="body" color={theme.text[90]}>Cancel</MediCareText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.colors.primary }]}
                onPress={handleForgotPassword}
                disabled={forgotLoading}
              >
                <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.white}>
                  {forgotLoading ? 'Sending...' : 'Send Link'}
                </MediCareText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  container: { flex: 1, backgroundColor: theme.background[70] },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
  },
  avatarSection: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    paddingBottom: 32,
    paddingTop: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.background[110],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.white,
  },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  bloodGroupBadge: {
    marginTop: 10,
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  content: { padding: 20 },
  verifyBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  verifyButton: {
    marginTop: 10,
    backgroundColor: '#d97706',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  section: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { marginBottom: 16 },
  input: { marginBottom: 12 },
  label: { marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border[80],
    backgroundColor: theme.background[70],
  },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  row: { flexDirection: 'row' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.border[80],
  },
  aiNotice: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteAccountBtn: {
  alignItems: 'center',
  paddingVertical: 16,
  marginBottom: 40,
  borderWidth: 1,
  borderColor: '#EF4444',
  borderRadius: 12,
  backgroundColor: '#FEF2F2',
  },
}));

export default Profile;
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAppDispatch } from '@src/redux/store';
import { setAccessToken } from '@src/redux/features/user/authSlice';
import { showError } from '@src/helper/alert';
import useFcmRegistration from './useFcmRegistration';
import Config from 'react-native-config';
import { Alert } from 'react-native';

const WEB_CLIENT_ID = '538435359374-g8e3l1khd2h9npthronqgu4old91phem.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

const API_BASE_URL = `${Config.API_BASE_URL}/api` || 'http://localhost:3000/api';

const sendTokenToBackend = async (idToken: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/firebase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Authentication failed');
  return data;
};

export const useFirebaseAuth = () => {
  const dispatch = useAppDispatch();
  const { registerToken } = useFcmRegistration();
  const [isLoading, setIsLoading] = useState(false);

  const navigateToHome = (navigation: any) => {
    navigation.reset({ index: 0, routes: [{ name: 'DrawerNavigation' }] });
  };

  // Google Sign-In
  const signInWithGoogle = async (navigation: any) => {
    try {
      // Remove setIsLoading(true) here — caller manages loading state
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data?.idToken ?? null
      );
      const userCredential = await auth().signInWithCredential(googleCredential);
      const idToken = await userCredential.user.getIdToken();
      const res = await sendTokenToBackend(idToken);
      dispatch(setAccessToken(res));
      await registerToken();
      navigateToHome(navigation);
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
        showError(error);
      }
    }
    // Remove finally setIsLoading(false) here too
  };

  // Email Sign-In via Firebase
  const signInWithEmail = async (
    email: string,
    password: string,
    navigation: any
  ) => {
    try {
      setIsLoading(true);
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const idToken = await userCredential.user.getIdToken();
      const res = await sendTokenToBackend(idToken);
      dispatch(setAccessToken(res));
      await registerToken();
      navigateToHome(navigation);
    } catch (error: any) {
      // Map Firebase error codes to friendly messages
      if (error.code === 'auth/user-not-found') {
        showError({ message: 'No account found with this email' });
      } else if (error.code === 'auth/wrong-password') {
        showError({ message: 'Incorrect password' });
      } else if (error.code === 'auth/invalid-credential') {
        showError({ message: 'Invalid email or password' });
      } else {
        showError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Email Sign-Up via Firebase
const signUpWithEmail = async (
  email: string,
  password: string,
  fullName: string,
  navigation: any
) => {
  try {
    setIsLoading(true);
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: fullName });
    
    // Send verification email immediately
    await userCredential.user.sendEmailVerification();
    
    const idToken = await userCredential.user.getIdToken();
    const res = await sendTokenToBackend(idToken);
    dispatch(setAccessToken(res));
    await registerToken();
    
    // Show alert then navigate
    Alert.alert(
      'Verify your email',
      `A verification link was sent to ${email}. Please verify before signing in.`,
      [{ text: 'OK', onPress: () => navigateToHome(navigation) }]
    );
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      showError({ message: 'An account with this email already exists' });
    } else if (error.code === 'auth/weak-password') {
      showError({ message: 'Password must be at least 8 characters' });
    } else {
      showError(error);
    }
  } finally {
    setIsLoading(false);
  }
};

  // Phone — Step 1: Send OTP
  const sendPhoneOtp = async (phoneNumber: string): Promise<any> => {
    try {
      setIsLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmation;
    } catch (error: any) {
      if (error.code === 'auth/invalid-phone-number') {
        showError({ message: 'Invalid phone number. Include country code e.g. +8801712345678' });
      } else {
        showError(error);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Phone — Step 2: Verify OTP
  const verifyPhoneOtp = async (
    confirmation: any,
    otp: string,
    navigation: any
  ) => {
    try {
      setIsLoading(true);
      const userCredential = await confirmation.confirm(otp);
      const idToken = await userCredential.user.getIdToken();
      const res = await sendTokenToBackend(idToken);
      dispatch(setAccessToken(res));
      await registerToken();
      navigateToHome(navigation);
    } catch (error: any) {
      if (error.code === 'auth/invalid-verification-code') {
        showError({ message: 'Invalid OTP code. Please try again.' });
      } else {
        showError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPhoneOtp,
    verifyPhoneOtp,
    isLoading,
  };
};
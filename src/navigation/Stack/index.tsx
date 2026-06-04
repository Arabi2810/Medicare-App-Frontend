import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Screens';
import Onboarding from '@src/screens/Onboarding/Onboarding';
import SignIn from '@src/screens/auth/SignIn';
import SignUp from '@src/screens/auth/SignUp';
import DrawerNavigation from '../Drawer/DrawerNavigation';
import { useAppSelector } from '@src/redux/store';
import UploadPrescription from '@src/screens/UploadPrescription/UploadPrescription';
import CameraScreen from '@src/screens/Camera/CameraScreen';
import PrescriptionForm from '@src/screens/PrescriptionForm/PrescriptionForm';
import HistoryDetails from '@src/screens/History/HistoryDetails/HistoryDetails';
import PendingTestForm from '@src/screens/PendingTestForm/PendingTestForm';
import CompleteHistory from '@src/screens/History/CompleteHistory/CompleteHistory';
import Profile from '@src/screens/Profile/Profile';
import PhoneAuthScreen from '@src/screens/auth/PhoneAuthScreen';
import OtpVerifyScreen from '@src/screens/auth/OtpVerifyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  const token = useAppSelector(state => state.auth).token;
  return (
    <Stack.Navigator
      initialRouteName={token ? 'DrawerNavigation' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="UploadPrescription" component={UploadPrescription} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="FormScreen" component={PrescriptionForm} />
      <Stack.Screen name="HistoryDetails" component={HistoryDetails} />
      <Stack.Screen name="PendingTestForm" component={PendingTestForm} />
      <Stack.Screen name="CompleteHistory" component={CompleteHistory} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;

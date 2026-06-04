import { NavigatorScreenParams } from '@react-navigation/native';
import { UploadFileType } from '@src/screens/UploadPrescription/UploadPrescription';
import { UploadPrescriptionResponse } from '@src/utils/types';

export type RootStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  DrawerNavigation: NavigatorScreenParams<DrawerParamList>;
  UploadPrescription: {
    prescriptionId?: string;
    testId?: string;
    type: UploadFileType;
  };
  CameraScreen: undefined;
  FormScreen: { data: UploadPrescriptionResponse };
  HistoryDetails: { id: string };
  PendingTestForm: {
    prescriptionId: string;
    testId: string;
    file: {
      uri: string;
      type: string | null;
      name: string | null;
    };
  };
  CompleteHistory: { prescriptionId: string, userId: string };
  Profile: undefined;
  PhoneAuth: undefined;
  OtpVerify: {
    confirmation: any;
    phoneNumber: string;
  };
};

export type DrawerParamList = {
  Dashboard: NavigatorScreenParams<BottomTabParamList>;
  PendingTests: undefined;
  ClinicalSummary: undefined;
  Profile: undefined;
};


export type BottomTabParamList = {
  Home: undefined;
  Reminders: undefined;
  History: undefined;
  Insights: undefined;
};

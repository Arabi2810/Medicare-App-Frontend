export interface DoctorInfo {
  name: string;
  specialization: string | null;
  licenseNumber: string | null;
  contact: string | null;
  hospitalName?: string | null;
}

export interface PatientInfo {
  name: string;
  age: string | number; // You sent "45" as string
  gender: 'M' | 'F' | string;
  contact: string | null;
  registrationNumber: string | null;
  uploadedAt?: string; // ISO timestamp
}

export interface TestInfo {
  _id?: string;
  name: string;
  type: string | null;
  status?: string;
  completedDate?: string | null;
  reportUrl?: string | null;
  resultSummary?: string | null;
  notes?: string | null;
  testDefinition?: string | null;
  patientRelevance?: string | null;
  validityLevel?: 'essential' | 'moderate' | 'unnecessary' | null;
}

export interface MedicineInfo {
  name: string;
  dosage: string | null;
  frequency: string | null; // like "3 + 0 + 0"
  duration: string | null; // like "TF"
  instructions: string | null;
}

export interface MedicineItem {
  _id: string;
  userId: string;
  prescriptionId: {
    _id: string;
  };
  doctor: DoctorInfo;
  patient: PatientInfo;
  medicineName: string;
  dosage: string;
  schedules: {
    morning: boolean;
    noon: boolean;
    night: boolean;
  };
  timings: {
    morning: string | null; // "08:00"
    noon: string | null; // "13:00"
    night: string | null; // "20:00"
  };
  isActive: boolean;
  startDate: string; // ISO date string
  endDate: string | null; // nullable
  lastNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface UploadPrescriptionResponse {
    doctor: DoctorInfo;
    patient: PatientInfo;
    symptoms: string[];
    diagnosis: string[];
    tests: TestInfo[];
    medicines: MedicineInfo[];
    notes: string | null;
    ocrText: string | null;
    imageUrl?: string | null;
  }
export interface Prescription extends UploadPrescriptionResponse {
  _id: string;
  userId: string;
  imageUrl?: string | null;
  isCurrent: boolean;
  isComplete: boolean; // Added based on user request
  completedAt: string | null;
  status: string;
  processingStatus: string;
  errorMessage: string | null;
  uploadedAt: string; // ISO Date string
  parsedAt: string; // ISO Date string
  processingTime: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
}

export interface AnalyticsResponse {
  mostUsedMedicines: MostUsedMedicine[];
  commonSymptoms: CommonSymptom[];
  treatmentStats: TreatmentStats;
  medicationTrends: MedicationTrends;
  topDoctors: TopDoctor[];
  recentDiagnoses: string[];
}

export interface MostUsedMedicine {
  name: string;
  count: number;
  percentage: number; // 0–100
}

export interface CommonSymptom {
  symptom: string;
  count: number;
  percentage: number;
}

export interface TreatmentStats {
  totalPrescriptions: number;
  activeMedications: number;
  doctorsConsulted: number;
  archivedPrescriptions: number;
}

export interface MedicationTrends {
  currentMonthPrescriptions: number;
  lastMonthPrescriptions: number;
  changePercentage: number;
}

export interface TopDoctor {
  name: string;
  specialization: string;
  consultationCount: number;
}

export interface PendingTest {
  prescriptionId: string;
  testId: string;
  testName: string;
  testType: string | null;
  status: string;
  doctorName: string;
  prescribedDate: string;
  diagnosis: string[];
  testDefinition: string | null;
  patientRelevance: string | null;
  validityLevel: 'essential' | 'moderate' | 'unnecessary' | null;
}

export interface Patient {
    patientId?: number;
    patientName: string;
    email: string;
    phone: string;
    age: number;
    dob: string;
    gender: string;
    preferredStartTime: string | null;
    preferredEndTime: string | null;
    createdDate: string;
    createdBy: number;
    lastModifiedDate: string;
    lastModifiedBy: number;
    preferredClinicId: number | null;
    image?: File |string | null;
    patientAddressId: number;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    preferredDoctorId: number | null;
    patientGuardianId: number | null;
    patientGuardianName: string | null;
    patientGuardianPhoneNumber: string | null;
    patientGuardianRelationship: string | null;
}

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
    preferredClinicId: number ;
    //image?: File |string | null;
    image?:string | null;
    patientAddressId: number;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    preferredDoctorId: number;
    preferredDoctorName?: string;
    patientGuardianId: number | null;
    patientGuardianName: string | null;
    patientGuardianPhoneNumber: string | null;
    patientGuardianRelationship: string | null;
    clinicId: number;
  clinicName?: string;
}

export interface PatientResponse {
    items: Patient[];
    totalCountOfPatients: number;
    pageNumber: number;
    pageSize: number;
}
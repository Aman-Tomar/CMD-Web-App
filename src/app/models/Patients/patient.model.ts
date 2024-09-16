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
    preferredClinicName : string | null;
    image?: File | string | null;
    hexImage?: string | null;
    patientAddressId?: number;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    preferredDoctorId?: number;
    preferredDoctorName?:string;
    patientGuardianId?: number;
    patientGuardianName: string | null;
    patientGuardianPhoneNumber: string | null;
    patientGuardianRelationship: string | null;
    clinicId: number;
    clinicName?: string;

    [key:string]:any;
}

export interface PatientResponse {
    items: Patient[];
    totalCountOfPatients: number;
    pageNumber: number;
    pageSize: number;
}
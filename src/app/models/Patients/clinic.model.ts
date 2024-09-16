export interface ClinicAddress {
    clinicAddressId: number;
    clinicId: number;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    location: string;
  }

  export interface Clinic {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    status: string;
    clinicAddress: ClinicAddress;
  }
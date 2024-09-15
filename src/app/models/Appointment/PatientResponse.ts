import { Patient } from "./Patient";

export interface PatientResponse {
    items: Patient[];
    totalCountOfPatients: number;
    pageNumber: number;
    pageSize: number;
}
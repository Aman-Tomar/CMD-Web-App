import { IDoctor } from "./Doctor";

export interface DoctorResponse{
    page: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    data: IDoctor[]
}
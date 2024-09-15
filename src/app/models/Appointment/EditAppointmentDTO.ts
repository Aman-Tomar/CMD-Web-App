import { AppointmentStatus } from "./AppointmentStatus"

export interface IAppointmentDTO
{
    PatientId:number,
    DoctorId:number,
    Status:AppointmentStatus,
    PurposeOfvisit:string,
    Date:string,
    Time:string,
    Email:string,
    Phone:string,
    Message:string,
    LastModifiedBy:string
}
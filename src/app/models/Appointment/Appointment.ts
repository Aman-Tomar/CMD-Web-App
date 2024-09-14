import { AppointmentStatus } from "./AppointmentStatus";

export interface IAppointment
{
    id:number,
    purposeOfVisit:string,
    date:string,
    time:string,
    email:string,
    phone:string,
    status:AppointmentStatus,
    message:string,
    createdBy:string,
    createdDate?:string,
    lastModifiedBy:string,
    lastModifiedDate?:string,
    patientId:number,
    doctorId:number
}
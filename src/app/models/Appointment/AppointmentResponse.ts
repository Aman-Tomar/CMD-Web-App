import { IAppointment } from "./Appointment";

export interface AppointmentResponse{
    items:IAppointment[],
    totalAppointments:number,
    pageNumber:number,
    pageLimit:number
}
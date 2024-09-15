import { IAppointment } from "./Appointment";

export interface AppointmentResponse{
    items:IAppointment[],
    totalAppointments:Number,
    pageNumber:Number,
    pageLimit:Number
}
import { IAppointment } from "./Appointment";

export interface AppointmentResponse{
    Items:IAppointment[],
    TotalAppointments:Number,
    PageNumber:Number,
    PageLimit:Number
}
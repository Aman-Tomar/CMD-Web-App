import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppointment } from '../../models/Appointment/Appointment';
import { IAppointmentDTO } from '../../models/Appointment/AppointmentDTO';
import { catchError, Observable, throwError } from 'rxjs';
import { PatientResponse } from '../../models/Appointment/PatientResponse';
import { DoctorResponse } from '../../models/Appointment/DoctorResponse';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http:HttpClient) { }

  private apiUrl="https://appointmentapiservice-fyc7d5afcrhabceb.southeastasia-01.azurewebsites.net/api";
  private patientApiUrl="https://cmdpatientnewwebapp-ckbwb7h0cjhrfehx.southeastasia-01.azurewebsites.net/api";
  private doctorApiUrl="https://cmd-doctor-api.azurewebsites.net/api/";


//Appointments  Api Call
  getAppointments(pageNo: number = 1, pageLimit: number = 20): Observable<IAppointment[]> {
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.http.get<IAppointment[]>(`${this.apiUrl}/Appointment`, { params })
  }

   // Fetch active appointments
   getActiveAppointments(pageNumber: number = 1, pageSize: number = 20): Observable<IAppointment[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IAppointment[]>(`${this.apiUrl}/Appointment/Active`, { params });
  }

// Fetch inactive appointments
   getInactiveAppointments(pageNumber: number = 1, pageSize: number = 20): Observable<IAppointment[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IAppointment[]>(`${this.apiUrl}/Appointment/Inactive`, { params });
  }
// Fetch an appointment by its ID
    getAppointmentById(appointmentId: number): Observable<IAppointment> {
      return this.http.get<IAppointment>(`${this.apiUrl}/Appointment/${appointmentId}`)
        .pipe(
          catchError(this.handleError)
        );
    }

    //cancel an appointment by its Id
    cancelAppointmentById(appointmentId: number): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/Appointment/Cancel/${appointmentId}`, {},{
        headers: { 'Content-Type': 'application/json' }
      })
        .pipe(
          catchError(this.handleError)
        );
    }
    

//GetAllPatients  Api Call
  getPatients(pageNo: number = 1, pageLimit: number = 20):Observable<PatientResponse>{
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.http.get<PatientResponse>(`${this.patientApiUrl}/Patients`, { params })
  }

//GetALlDoctors  Api Call
  getDoctors(pageNo: number = 1, pageLimit: number = 20):Observable<DoctorResponse>{
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.http.get<DoctorResponse>(`${this.doctorApiUrl}/Doctor`, { params })
  }

//create appointment
  createAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(`${this.apiUrl}/appointment`, appointment);
  }


 // Update Appointment Method
 updateAppointment(updatedAppointment: IAppointmentDTO, appointmentId: number): Observable<IAppointment> {
  // Logging the parameters for debugging
  console.log('Updating Appointment with ID:', appointmentId);
  console.log('Updated Appointment Data:', updatedAppointment);

  // HTTP PUT request to update the appointment
  return this.http.put<IAppointment>(`${this.apiUrl}/appointment/${appointmentId}`, updatedAppointment);
}


// Handle errors
private handleError(error: HttpErrorResponse) {
 let errorMessage = 'Unknown error!';
 if (error.error instanceof ErrorEvent) {
   errorMessage = `Error: ${error.error.message}`;
 } else {
   errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
 }
 return throwError(()=>{const error:any=new Error(errorMessage)});
}
  
}

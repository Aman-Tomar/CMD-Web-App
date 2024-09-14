import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppointment } from '../../models/Appointment/Appointment';
import { IAppointmentDTO } from '../../models/Appointment/AppointmentDTO';
import { Observable, throwError } from 'rxjs';
import { PatientResponse } from '../../models/Appointment/PatientResponse';
import { DoctorResponse } from '../../models/Appointment/DoctorResponse';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http:HttpClient) { }

  apiUrl="https://appointmentapiservice-fyc7d5afcrhabceb.southeastasia-01.azurewebsites.net/api";
  patientApiUrl="https://cmdpatientnewwebapp-ckbwb7h0cjhrfehx.southeastasia-01.azurewebsites.net/api";
  doctorApiUrl="https://cmd-doctor-api.azurewebsites.net/api/";


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

//Patients  Api Call
  getPatients(pageNo: number = 1, pageLimit: number = 20):Observable<PatientResponse>{
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.http.get<PatientResponse>(`${this.patientApiUrl}/Patients`, { params })
  }

//Doctors  Api Call
  getDoctors(pageNo: number = 1, pageLimit: number = 20):Observable<DoctorResponse>{
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.http.get<DoctorResponse>(`${this.doctorApiUrl}/Doctor`, { params })
  }

  //create appointment

  createAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(`${this.apiUrl}/appointment`, appointment);
  }

   // Handle errors
   private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(()=>{const error:any=new Error(errorMessage)});
  }


  
}

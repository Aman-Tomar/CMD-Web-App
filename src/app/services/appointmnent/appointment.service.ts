import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppointment } from '../../models/Appointment/Appointment';
import { IAppointmentDTO } from '../../models/Appointment/AppointmentDTO';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http:HttpClient) { }

  apiUrl="https://appointmentapiservice-fyc7d5afcrhabceb.southeastasia-01.azurewebsites.net/api";

  getAppointments(pageNo: number = 1, pageLimit: number = 20): Observable<IAppointment[]> {
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.http.get<IAppointment[]>(`${this.apiUrl}/Appointment`, { params })
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

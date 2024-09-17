import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppointment } from '../../models/Appointment/Appointment';
import { IAppointmentDTO } from '../../models/Appointment/EditAppointmentDTO';
import { catchError, Observable, throwError } from 'rxjs';
import { PatientResponse } from '../../models/Appointment/PatientResponse';
import { DoctorResponse } from '../../models/Appointment/DoctorResponse';
import { AppointmentResponse } from '../../models/Appointment/AppointmentResponse';
import { environment } from '../../../environments/environment';
import { RequestService } from '../request/request.service';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private requestService:RequestService) { }

  private apiUrl = environment.appointmentBaseUrl;
  private patientApiUrl = environment.patientBaseUrl;
  private doctorApiUrl = environment.doctorBaseUrl;

  private departmentApiUrl=environment.clinicBaseUrl;

//Appointments  Api Call
  getAppointments(pageNo: number = 1, pageLimit: number = 20): Observable<AppointmentResponse> {
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.requestService.get<AppointmentResponse>(`${this.apiUrl}/Appointment`, params)
  }

   // Fetch active appointments
   getActiveAppointments(pageNumber: number = 1, pageSize: number = 20): Observable<AppointmentResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.requestService.get<AppointmentResponse>(`${this.apiUrl}/Appointment/Active`, params);
  }

// Fetch inactive appointments
   getInactiveAppointments(pageNumber: number = 1, pageSize: number = 20): Observable<AppointmentResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.requestService.get<AppointmentResponse>(`${this.apiUrl}/Appointment/Inactive`, params);
  }
// Fetch an appointment by its ID
    getAppointmentById(appointmentId: number): Observable<IAppointment> {
      return this.requestService.get<IAppointment>(`${this.apiUrl}/Appointment/${appointmentId}`)
        .pipe(
          catchError(this.handleError)
        );
    }

    //cancel an appointment by its Id
    cancelAppointmentById(appointmentId: number): Observable<any> {
      return this.requestService.put<any>(`${this.apiUrl}/Appointment/Cancel/${appointmentId}`, {})
        .pipe(
          catchError(this.handleError)
        );
    }
    

//GetAllPatients  Api Call
  getPatients(pageNo: number = 1, pageLimit: number = 20):Observable<PatientResponse>{
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());
    return this.requestService.get<PatientResponse>(`${this.patientApiUrl}/Patients`, params)
  }

   // Fetch a single patient by their ID
   getPatientById(patientId: number): Observable<any> {
    return this.requestService.get<any>(`${this.patientApiUrl}/Patients/${patientId}`)
      .pipe(catchError(this.handleError));
  }

//GetALlDoctors  Api Call
  getDoctors(pageNo: number = 1, pageLimit: number = 20):Observable<DoctorResponse>{
    let params = new HttpParams().set('pageNo', pageNo.toString()).set('pageLimit', pageLimit.toString());

    return this.requestService.get<DoctorResponse>(`${this.doctorApiUrl}/Doctor`, params)
  }
  // Fetch a single doctor by their ID
  getDoctorById(doctorId: number): Observable<any> {
    return this.requestService.get<any>(`${this.doctorApiUrl}/Doctor/${doctorId}`)
      .pipe(catchError(this.handleError));
  }

  //getting departments 

  getDepartments():Observable<any>{
    return this.requestService.get<any>(`${this.departmentApiUrl}/Department`)
    .pipe(catchError(this.handleError));
  }

  //getting Purpose Of visit
  getPurposeOfVisit(): Observable<any> {
    return this.requestService.get<any[]>('assets/purposeOfVisit.json').pipe(catchError(this.handleError));
  }


//create appointment
  createAppointment(appointment: IAppointment): Observable<IAppointment> {
    return this.requestService.post<IAppointment>(`${this.apiUrl}/appointment`, appointment);
  }

 // Update Appointment Method
 updateAppointment(updatedAppointment: IAppointmentDTO, appointmentId: number): Observable<IAppointment> {
  // Logging the parameters for debugging
  console.log('Updating Appointment with ID:', appointmentId);
  console.log('Updated Appointment Data:', updatedAppointment);

  // HTTP PUT request to update the appointment
  return this.requestService.put<IAppointment>(`${this.apiUrl}/appointment/${appointmentId}`, updatedAppointment);
}

getDoctorAvailabilty(doctorId: number, date: string, startTime: string, endTime: string): Observable<any> {
  console.log("get doctor available method");
  let params = new HttpParams()
    .set('doctorId', doctorId.toString())
    .set('date', date)
    .set('startTime', startTime)
    .set('endTime', endTime);

  // Pass the params as an object inside the second argument
  return this.requestService.get<any>(`${this.doctorApiUrl}/DoctorSchedule/available`, params).pipe(
    catchError(this.handleError)
  );
}

//getting doctors of a particular department
getDoctorByDepartment(id:number){
  let params=new HttpParams().set('departmentId',id);
  return this.requestService.get<any[]>(`${this.doctorApiUrl}/Doctor/Department`,params).pipe(
    catchError(this.handleError));
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

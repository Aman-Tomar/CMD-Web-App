import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';
import { IDepartment } from '../../models/Doctors/department.models';
import { IClinic } from '../../models/Doctors/clinic.model';
import { environment } from '../../../environments/environment';
import { RequestService } from '../request/request.service';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
 // private apiUrl = environment.doctorBaseUrl; 
  private apiUrl = "https://localhost:44310/api"; 
  private clinicUrl = environment.clinicBaseUrl;
  requestService:RequestService = inject(RequestService);

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    return throwError(()=>{const error:any=new Error(errorMessage)});
   } 
   
  getAllDoctors(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())  // Adjust the key if necessary to match your API (e.g., 'pageNumber' or 'page')
      .set('pageSize', pageSize.toString());

    return this.requestService.get<IDoctor>(`${this.apiUrl}/Doctor`, params);
  }
  
  getDoctorById(doctorId:number):Observable<IDoctor>{
      return this.requestService.get<IDoctor>(`${this.apiUrl}/Doctor/${doctorId}`).pipe(
        map(this.mapDoctorResponse)
      );
  }

  addDoctor(formData:FormData): Observable<any> {
    return this.requestService.post<any>(`${this.apiUrl}/Doctor`, formData);
  }

  editDoctor(doctorId: number, formData: FormData): Observable<any> {
    return this.requestService.put<any>(`${this.apiUrl}/Doctor?doctorId=${doctorId}`, formData);
  }
  
  getDepartments(): Observable<any[]> {
    return this.requestService.get<any[]>(`${this.clinicUrl}/Department`);
  }

  getDepartmentById(departmentId: number): Observable<IDepartment> {
    return this.requestService.get<IDepartment>(`${this.clinicUrl}/Department/${departmentId}`);
  }

  getClinics(): Observable<any[]> {
    return this.requestService.get<any[]>(`${this.clinicUrl}/Clinic`);
  }

  getClinicById(clinicId: number): Observable<any> {
    return this.requestService.get<any>(`${this.clinicUrl}/Clinic/${clinicId}`);
  }

  getCountryStates(){
      return this.client.get<any[]>('assets/db.json').pipe(catchError(this.handleError));
  }

  getPostalCodeDetails(postalCode: string) {
    const apiUrl = `https://api.postalpincode.in/pincode/${postalCode}`;
    return this.client.get(apiUrl);
  }

  private mapDoctorResponse(response: any): IDoctor {
    return {
      doctorId: response.doctorId,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      phoneNo: response.phoneNo,
      specialization: response.specialization,
      qualification: response.qualification,
      experienceInYears: response.experienceInYears,
      dateOfBirth: response.dateOfBirth,
      gender: response.gender,
      profilePicture: response.profilePicture,
      briefDescription: response.briefDescription,
      status: response.status,
      city: response.doctorAddress?.city,
      address: response.doctorAddress?.street,
      state: response.doctorAddress?.state,
      country: response.doctorAddress?.country,
      zipCode: response.doctorAddress?.zipCode,
      clinicId: response.clinicId,
      departmentId: response.departmentId
    };
  }
}

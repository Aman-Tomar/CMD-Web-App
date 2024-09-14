import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { map, Observable } from 'rxjs';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://localhost:44310'; 
  client:HttpClient = inject(HttpClient);

  getAllDoctors(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())  // Adjust the key if necessary to match your API (e.g., 'pageNumber' or 'page')
      .set('pageSize', pageSize.toString());

    return this.client.get<IDoctor>(`${this.apiUrl}/api/Doctor`, { params });
  }
  
  getDoctorById(doctorId:number):Observable<any>{
      return this.client.get<IDoctor>(`${this.apiUrl}/api/Doctor/${doctorId}`).pipe(
        map(this.mapDoctorResponse)
      );
  }

  addDoctor(formData:FormData): Observable<any> {
    return this.client.post<any>(`${this.apiUrl}/api/Doctor`, formData);
  }

  editDoctor(doctorId: number, formData: FormData): Observable<any> {
    return this.client.put<any>(`${this.apiUrl}/api/Doctor?doctorId=${doctorId}`, formData);
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

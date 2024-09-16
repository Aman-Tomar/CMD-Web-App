import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { map, Observable } from 'rxjs';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';
import { IDepartment } from '../../models/Doctors/department.models';
import { IClinic } from '../../models/Doctors/clinic.model';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = environment.doctorBaseUrl; 
  private clinicUrl = environment.clinicBaseUrl;
  client:HttpClient = inject(HttpClient);

  getAllDoctors(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())  // Adjust the key if necessary to match your API (e.g., 'pageNumber' or 'page')
      .set('pageSize', pageSize.toString());

    return this.client.get<IDoctor>(`${this.apiUrl}/Doctor`, { params });
  }
  
  getDoctorById(doctorId:number):Observable<IDoctor>{
      return this.client.get<IDoctor>(`${this.apiUrl}/Doctor/${doctorId}`).pipe(
        map(this.mapDoctorResponse)
      );
  }

  addDoctor(formData:FormData): Observable<any> {
    return this.client.post<any>(`${this.apiUrl}/Doctor`, formData);
  }

  editDoctor(doctorId: number, formData: FormData): Observable<any> {
    return this.client.put<any>(`${this.apiUrl}/Doctor?doctorId=${doctorId}`, formData);
  }
  
  getSpecializations(): Observable<string[]> {
    return this.client.get<string[]>(`http://localhost:3000/specializations`);
  }

  getDepartments(): Observable<any[]> {
    return this.client.get<any[]>(`${this.clinicUrl}/api/Department`);
  }

  getDepartmentById(departmentId: number): Observable<IDepartment> {
    return this.client.get<IDepartment>(`${this.clinicUrl}/api/Department/${departmentId}`);
  }

  getClinics(): Observable<any[]> {
    return this.client.get<any[]>(`${this.clinicUrl}/api/Clinic`);
  }

  getClinicById(clinicId: number): Observable<any> {
    return this.client.get<any>(`${this.clinicUrl}/api/Clinic/${clinicId}`);
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

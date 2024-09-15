import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';
import { IDepartment } from '../../models/Doctors/department.models';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleService {

  private apiUrl = 'https://localhost:44310'; 
  private departmentApiUrl = 'https://cmd-clinic-api.azurewebsites.net/api/Department';
  client:HttpClient = inject(HttpClient);

  getDoctorSchedule(doctorId: number, page: number, pageSize: number):Observable<any>{
    const params = new HttpParams()
    .set('doctorId', doctorId)
    .set('page', page.toString())  
    .set('pageSize', pageSize.toString());
  return this.client.get<IDoctorSchedule>(`${this.apiUrl}/api/DoctorSchedule`, { params });
  } 

  getDepartments(): Observable<IDepartment[]> {
    return this.client.get<IDepartment[]>(this.departmentApiUrl);
  }

  getDepartmentNameById(departmentId: number): Observable<string | undefined> {
    return this.client.get<string>(`${this.departmentApiUrl}/${departmentId}`);
  }

  createSchedule(doctorId: number, schedule: IDoctorSchedule): Observable<any> {
    return this.client.post<any>(`${this.apiUrl}/api/DoctorSchedule?doctorId=${doctorId}`, schedule);
  }

  getAllDoctorSchedules(doctorId: number): Observable<IDoctorSchedule[]> {
    return this.client.get<IDoctorSchedule[]>(`${this.apiUrl}/api/DoctorSchedule?doctorId=${doctorId}`);
  }

  getAllSchedules(page: number, pageSize: number):Observable<any>{
    const params = new HttpParams()
    .set('page', page.toString())  
    .set('pageSize', pageSize.toString());
  return this.client.get<IDoctorSchedule>(`${this.apiUrl}/api/DoctorSchedule/all`, { params });
  } 

  getSchedule(doctorScheduleId: number): Observable<IDoctorSchedule> {
    return this.client.get<IDoctorSchedule>(`${this.apiUrl}/api/DoctorSchedule/${doctorScheduleId}`);
  }

  editSchedule(doctorId: number, schedule: IDoctorSchedule): Observable<IDoctorSchedule> {
    return this.client.put<IDoctorSchedule>(`${this.apiUrl}/api/DoctorSchedule?doctorScheduleId=${doctorId}`, schedule);
  }
}

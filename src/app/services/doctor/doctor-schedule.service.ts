import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';
import { IDepartment } from '../../models/Doctors/department.models';
import { environment } from '../../../environments/environment';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleService {

  private apiUrl = environment.doctorBaseUrl; 
  private departmentApiUrl = environment.clinicBaseUrl;
  requestService:RequestService = inject(RequestService);

  getDoctorSchedule(doctorId: number, page: number, pageSize: number):Observable<any>{
    const params = new HttpParams()
    .set('doctorId', doctorId)
    .set('page', page.toString())  
    .set('pageSize', pageSize.toString());
  return this.requestService.get<IDoctorSchedule>(`${this.apiUrl}/DoctorSchedule`, params);
  } 

  getDepartments(): Observable<IDepartment[]> {
    return this.requestService.get<IDepartment[]>(this.departmentApiUrl);
  }

  getDepartmentNameById(departmentId: number): Observable<string | undefined> {
    return this.requestService.get<string>(`${this.departmentApiUrl}/Department/${departmentId}`);
  }

  createSchedule(doctorId: number, schedule: IDoctorSchedule): Observable<any> {
    return this.requestService.post<any>(`${this.apiUrl}/DoctorSchedule?doctorId=${doctorId}`, schedule);
  }

  getAllDoctorSchedules(doctorId: number): Observable<IDoctorSchedule[]> {
    return this.requestService.get<IDoctorSchedule[]>(`${this.apiUrl}/DoctorSchedule?doctorId=${doctorId}`);
  }

  getAllSchedules(page: number, pageSize: number):Observable<any>{
    const params = new HttpParams()
    .set('page', page.toString())  
    .set('pageSize', pageSize.toString());
    return this.requestService.get<IDoctorSchedule>(`${this.apiUrl}/DoctorSchedule/all`, params);
  } 

  getSchedule(doctorScheduleId: number): Observable<IDoctorSchedule> {
    return this.requestService.get<IDoctorSchedule>(`${this.apiUrl}/DoctorSchedule/${doctorScheduleId}`);
  }

  editSchedule(doctorId: number, schedule: IDoctorSchedule): Observable<IDoctorSchedule> {
    return this.requestService.put<IDoctorSchedule>(`${this.apiUrl}/DoctorSchedule?doctorScheduleId=${doctorId}`, schedule);
  }
}

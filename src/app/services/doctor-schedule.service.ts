import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDoctorSchedule } from '../models/Doctors/doctorSchedule.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleService {
  private apiUrl = 'https://localhost:44310'; 
  client:HttpClient = inject(HttpClient);

  createSchedule(doctorId: number, schedule: IDoctorSchedule): Observable<any> {
    return this.client.post<any>(`${this.apiUrl}/api/DoctorSchedule?doctorId=${doctorId}`, schedule);
  }

  getAllSchedules(doctorId: number): Observable<any[]> {
    return this.client.get<any[]>(`${this.apiUrl}/api/DoctorSchedule?doctorId=${doctorId}`);
  }

  getSchedules(doctorScheduleId: number): Observable<IDoctorSchedule> {
    return this.client.get<IDoctorSchedule>(`${this.apiUrl}/api/DoctorSchedule/${doctorScheduleId}`);
  }

  editSchedule(doctorId: number, schedule: IDoctorSchedule): Observable<IDoctorSchedule> {
    return this.client.put<IDoctorSchedule>(`${this.apiUrl}/api/DoctorSchedule?doctorScheduleId=${doctorId}`, schedule);
  }
}

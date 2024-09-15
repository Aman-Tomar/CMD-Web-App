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

  getDoctorSchedule(page: number, pageSize: number):Observable<any>{
    const params = new HttpParams()
    .set('page', page.toString())  
    .set('pageSize', pageSize.toString());
  return this.client.get<IDoctorSchedule>(`${this.apiUrl}/api/DoctorSchedule?doctorId=2&page=1&pageSize=10`, { params });
  } 

  getDepartments(): Observable<IDepartment[]> {
    return this.client.get<IDepartment[]>(this.departmentApiUrl);
  }

  getDepartmentNameById(departmentId: number): Observable<string | undefined> {
    return this.getDepartments().pipe(
      map(departments => {
        const department = departments.find(dep => dep.departmentId === departmentId);
        return department ? department.departmentName : undefined;
      })
    );
  }
}

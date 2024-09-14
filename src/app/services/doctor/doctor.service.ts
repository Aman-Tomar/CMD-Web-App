import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { map, Observable } from 'rxjs';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://cmd-doctor-api.azurewebsites.net/api/Doctor'; // Replace with your API URL
 
  constructor(private http: HttpClient) {}

  getAllDoctors(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())  // Adjust the key if necessary to match your API (e.g., 'pageNumber' or 'page')
      .set('pageSize', pageSize.toString());
  
    // Make the HTTP GET request with the params object
    return this.http.get<any>(this.apiUrl, { params });
  }
  createSchedule(schedule: IDoctorSchedule): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, JSON.stringify(schedule), { headers });
  }
      client:HttpClient = inject(HttpClient);
      private apiUrl = "https://cmd-doctor-api.azurewebsites.net";
  
  // getDoctors():Observable<IDoctor[]> {
  //    var doctors = this.client.get<any>(`${this.apiUrl}/api/Doctor`).pipe(
  //     map(response => response.data)
  //    );
  //    console.log(doctors);
  //    return doctors;
  //}

    addDoctors(){
      
    }
}

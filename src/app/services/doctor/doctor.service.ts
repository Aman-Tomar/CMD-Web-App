import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://cmd-doctor-api.azurewebsites.net/api/Doctor'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getAllDoctors(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IDoctor>(this.apiUrl, { params });
  }
}

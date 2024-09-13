import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  // client:HttpClient = inject(HttpClient);
  //   private apiUrl = "https://cmd-doctor-api.azurewebsites.net";
  
  // getDoctors():Observable<IDoctor[]> {
  //    var doctors = this.client.get<any>(`${this.apiUrl}/api/Doctor`).pipe(
  //     map(response => response.data)
  //    );
  //    console.log(doctors);
  //    return doctors;
  //}
}

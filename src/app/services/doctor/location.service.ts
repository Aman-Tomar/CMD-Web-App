import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  
  private apiUrl = 'http://localhost:3000'; 
  client:HttpClient = inject(HttpClient);

     // Fetch all countries and return just their names
     getCountries(): Observable<any[]> {
      return this.client.get<any[]>(`${this.apiUrl}/countries`);
    }
  
    getStatesByCountry(countryId: number): Observable<any[]> {
      return this.client.get<any[]>(`${this.apiUrl}/countries`).pipe(
        map(country => country)
      );
    }

}

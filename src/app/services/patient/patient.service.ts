import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientResponse, Patient } from '../../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private PATIENT_BASE_URL = "https://cmdpatientnewwebapp-ckbwb7h0cjhrfehx.southeastasia-01.azurewebsites.net/api";
  
  constructor(private http: HttpClient) { }

  getPatients(pageNumber: number, pageSize: number): Observable<PatientResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PatientResponse>(`${this.PATIENT_BASE_URL}/patients`, { params });
  }

  getPatientById(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.PATIENT_BASE_URL}/patients/${patientId}`);
  }

  createPatient(patient: Patient): Observable<Patient> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Patient>(`${this.PATIENT_BASE_URL}/patients`, patient, { headers });
  }

  updatePatient(patientId: number, patient: Patient): Observable<Patient> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Patient>(`${this.PATIENT_BASE_URL}/patients/${patientId}`, patient, { headers });
  }
  
}

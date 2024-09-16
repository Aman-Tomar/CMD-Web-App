import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable, switchMap } from 'rxjs';
import { PatientResponse, Patient } from '../../models/Patients/patient.model';
import { environment } from '../../../environments/environment';

import { Doctor } from '../../models/Patients/doctor.model';
import { Clinic } from '../../models/Patients/clinic.model';

@Injectable({
  providedIn: 'root' // Makes the service available throughout the app (singleton scope).
})
export class PatientService {

  private PATIENT_BASE_URL = environment.patientBaseUrl;
  private DOCTOR_VIEW_URL = environment.doctorBaseUrl;
  private CLINIC_VIEW_URL = environment.clinicBaseUrl;

  // Injects HttpClient for making HTTP requests.
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


  createPatient(patientData: FormData): Observable<Patient> {
    return this.http.post<Patient>(`${this.PATIENT_BASE_URL}/patients`, patientData);
  }

  updatePatient(patientId: number, patientData: FormData): Observable<Patient> {
    return this.http.put<Patient>(`${this.PATIENT_BASE_URL}/patients/${patientId}`, patientData);
  }


  getDoctors(): Observable<Doctor[]> {
    return this.http.get<any>(this.DOCTOR_VIEW_URL).pipe(
      map(response => {
        if (response && response.data) {
          return response.data.map((doctor: any) => ({
            doctorId: doctor.doctorId,
            firstName: doctor.firstName
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return [];
      })
    );
  }

  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${this.CLINIC_VIEW_URL}/clinic`).pipe(
      catchError(error => {
        console.error('Error fetching clinics:', error);
        return [];
      })
    );
  }

  // getClinics(): Observable<Clinic[]> {
  //   return this.http.get<any>(this.CLINIC_VIEW_URL).pipe(
  //     map(response => {
  //       if (response && response.data) {
  //         return response.data.map((clinic: any) => ({
  //           id: clinic.id,
  //           name: clinic.name
  //         }));
  //       }
  //       return [];
  //     }),
  //     catchError(error => {
  //       console.error('Error fetching clinics:', error);
  //       return [];
  //     })
  //   );
  // }

  private createFormData(patient: Patient): FormData {
    const formData = new FormData();
    Object.keys(patient).forEach(key => {
      const value = patient[key as keyof Patient]
      if (key === 'image') {
        if (value instanceof File) {
          formData.append('Image', patient[key] as File);
        } else if (typeof value === 'string' && value.startsWith('data:image')) {
          // Convert base64 to blob and append
          fetch(value as string)
            .then(res => res.blob())
            .then(blob => formData.append('Image', blob, 'image.jpg'));
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }

}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { PatientResponse, Patient } from '../../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
 
  private PATIENT_BASE_URL = "https://cmdpatientnewwebapp-ckbwb7h0cjhrfehx.southeastasia-01.azurewebsites.net/api";
  private DOCTOR_VIEW_URL= "https://cmd-doctor-api.azurewebsites.net/api/Doctor";
  private CLINIC_VIEW_URL="https://cmd-clinic-api.azurewebsites.net/api/Clinic";
  //private Sates_URL="http://localhost:3000/states";
  
  constructor(private http: HttpClient) { }
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(this.DOCTOR_VIEW_URL);
  }
  getDoctorById(doctorId: number): Observable<string> {
    return this.http.get<any>(`${this.DOCTOR_VIEW_URL}/${doctorId}`).pipe(
      map(doctor => doctor.firstName)
    );
  }
  // getStates(): Observable<any[]> {
  //   return this.http.get<any[]>(this.Sates_URL);
  // }

  getClinics(): Observable<any[]> {
    return this.http.get<any[]>(this.CLINIC_VIEW_URL);
  }
  
  getClinicById(id: number): Observable<string> {
    return this.http.get<any>(`${this.CLINIC_VIEW_URL}/${id}`).pipe(
      map(clinic => clinic.name)
    );
  }

  getPatients(pageNumber: number, pageSize: number): Observable<PatientResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PatientResponse>(`${this.PATIENT_BASE_URL}/patients`, { params });
  }

  getPatientById(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.PATIENT_BASE_URL}/patients/${patientId}`);
  }

  // createPatient(patient: Patient): Observable<Patient> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.post<Patient>(`${this.DOCTOR_VIEW_URL}/patients`, patient, { headers });
  // }

  // updatePatient(patientId: number, patient: Patient): Observable<Patient> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.put<Patient>(`${this.DOCTOR_VIEW_URL}/patients/${patientId}`, patient, { headers });
  // }

  createPatient(patient: Patient): Observable<Patient> {
    return this.getDoctorById(patient.preferredDoctorId).pipe(
      switchMap(doctorName =>
        this.getClinicById(patient.clinicId).pipe(
          switchMap(clinicName => { 
        const updatedPatient = { ...patient, preferredDoctorName: doctorName ,clinicName:clinicName};
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<Patient>(`${this.PATIENT_BASE_URL}/patients`, updatedPatient, { headers });
      })
    )
      )
    );
  }

  updatePatient(patientId: number, patient: Patient): Observable<Patient> {
    return this.getDoctorById(patient.preferredDoctorId).pipe(
      switchMap(doctorName => 
        this.getClinicById(patient.clinicId).pipe(
          switchMap(clinicName => {
        const updatedPatient = { ...patient, preferredDoctorName: doctorName ,clinicName: clinicName};
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put<Patient>(`${this.PATIENT_BASE_URL}/patients/${patientId}`, updatedPatient, { headers });
      })
    )
  )
);
  }

  
}

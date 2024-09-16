import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { PatientResponse, Patient } from '../../models/Patients/patient.model';
import { environment } from '../../../environments/environment';
import { Doctor } from '../../models/Patients/doctor.model';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root' // Makes the service available throughout the app (singleton scope).
})
export class PatientService {

  private PATIENT_BASE_URL = environment.patientBaseUrl;
  private DOCTOR_VIEW_URL = environment.doctorBaseUrl;
  private CLINIC_VIEW_URL = environment.clinicBaseUrl;

  // Injects HttpClient for making HTTP requests.
  constructor(private requestService: RequestService) { }

  // Fetches a list of patients with pagination (pageNumber, pageSize)
  getPatients(pageNumber: number, pageSize: number): Observable<PatientResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString()) // Sets the pageNumber query parameter.
      .set('pageSize', pageSize.toString()); // Sets the pageSize query parameter.
    return this.requestService.get<PatientResponse>(`${this.PATIENT_BASE_URL}/patients`, params); // Performs GET request.
  }

  // Fetches a specific patient by their ID.
  getPatientById(patientId: number): Observable<Patient> {
    return this.requestService.get<Patient>(`${this.PATIENT_BASE_URL}/patients/${patientId}`);
  }

  // createPatient(patient: Patient): Observable<Patient> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.post<Patient>(`${this.DOCTOR_VIEW_URL}/patients`, patient, { headers });
  // }

  // updatePatient(patientId: number, patient: Patient): Observable<Patient> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.put<Patient>(`${this.DOCTOR_VIEW_URL}/patients/${patientId}`, patient, { headers });
  // }


  // Creates a new patient and sends the data as JSON in the request body.
  // createPatient(patient: Patient): Observable<Patient> {
  //   return this.getDoctorById(patient.preferredDoctorId?).pipe(
  //     switchMap(doctorName =>
  //       this.getClinicById(patient.clinicId).pipe(
  //         switchMap(clinicName => { 
  //       const updatedPatient = { ...patient, preferredDoctorName: doctorName ,clinicName:clinicName};
  //       const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //       return this.http.post<Patient>(`${this.PATIENT_BASE_URL}/patients`, updatedPatient, { headers });
  //     })
  //   )
  //     )
  //   );
  // }

  // Updates an existing patient's data, identified by their ID.
  // updatePatient(patientId: number, patient: Patient): Observable<Patient> {
  //     return this.getDoctorById(patient.preferredDoctorId).pipe(
  //       switchMap(doctorName => 
  //         this.getClinicById(patient.clinicId).pipe(
  //           switchMap(clinicName => {
  //         const updatedPatient = { ...patient, preferredDoctorName: doctorName ,clinicName: clinicName};
  //         const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //         return this.http.put<Patient>(`${this.PATIENT_BASE_URL}/patients/${patientId}`, updatedPatient, { headers });
  //       })
  //     )
  //   )
  //   );
  // }


  // Fetches a list of all doctors.
  
  
  getDoctors(): Observable<{ data: Doctor[] }> {
    return this.requestService.get<{ data: Doctor[] }>(`${this.DOCTOR_VIEW_URL}/doctor`);
  }

  // Fetches a specific doctor by their ID and maps the response to return the doctor's first name.
  getDoctorById(doctorId: number): Observable<string> {
    return this.requestService.get<any>(`${this.DOCTOR_VIEW_URL}/doctor/${doctorId}`).pipe(
      map(response => response.data?.firstName) // Adjust according to the actual response structure.
    );
  }

  // getDoctorName(doctorId: number): void {
  //   this.getDoctorById(doctorId).subscribe(
  //     name => {
  //       this.doctorName = name;
  //     },
  //     error => {
  //       console.error('Error fetching doctor name:', error);
  //     }
  //   );
  // }

  // Fetches a list of all clinics.
  getClinics(): Observable<any[]> {
    return this.requestService.get<any[]>(`${this.CLINIC_VIEW_URL}/clinic`);
  }

  // Fetches a specific clinic by its ID and maps the response to return the clinic's name.
  getClinicById(id: number): Observable<string> {
    return this.requestService.get<any>(`${this.CLINIC_VIEW_URL}/clinic/${id}`).pipe(
      map(response => response.data?.name) // Adjust according to the actual response structure.
    );
  }
  
  // getStates(): Observable<any[]> {
  //   return this.http.get<any[]>(this.Sates_URL);
  // }

}

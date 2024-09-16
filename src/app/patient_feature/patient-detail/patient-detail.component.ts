import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Patient } from '../../models/Patients/patient.model';
import { PatientService } from '../../services/patient/patient.service';
import { CommonService } from '../../services/common.service';
import { Doctor } from '../../models/Patients/doctor.model';
import { Clinic } from '../../models/Patients/clinic.model'
import { catchError, map, of, tap } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
  providers: [DatePipe]
})
export class PatientDetailComponent 
{
  // Property to store the current patient's details
  patient: Patient | null = null;

  // Arrays to store lists of doctors and clinics
  doctors: Doctor[] = [];
  clinics: Clinic[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {}


  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      forkJoin({
        doctors: this.patientService.getDoctors(),
        clinics: this.patientService.getClinics()
      }).subscribe({
        next: (result) => {
          this.doctors = result.doctors;
          this.clinics = result.clinics;
          this.loadPatient(+patientId);
        },
        error: (error) => {
          console.error('Error loading doctors and clinics:', error);
        }
      });
    }
  }


  // ngOnInit(): void {
  //   // Get the patient ID from the route parameters
  //   const patientId = this.route.snapshot.paramMap.get('id');
  //   if (patientId) {
  //     // Load doctors and clinics data before loading patient details
  //     forkJoin({
  //       doctors: this.patientService.getDoctors(),
  //       clinics: this.patientService.getClinics()
  //     }).subscribe({
  //       next: (result) => {
  //         // Map doctor data to a simplified format
  //         this.doctors = result.doctors.data.map((doctor: any) => ({
  //           doctorId: doctor.doctorId,
  //           firstName: doctor.firstName
  //         }));
  //         // Map clinic data to a simplified format
  //         this.clinics = result.clinics.data.map((clinic: any) => ({
  //           id: clinic.id,
  //           name: clinic.name
  //         }));
  //         // Load patient details after doctors and clinics are loaded
  //         this.loadPatient(+patientId);
  //       },
  //       error: (error) => {
  //         console.error('Error loading doctors and clinics:', error);
  //       }
  //     });
  //   }

  //   // These methods are redundant as they're already called in forkJoin above
  //   // Consider removing these lines
  //   this.loadDoctors();
  //   this.loadClinics();
  // }

  // Method to load patient details by ID
  loadPatient(id: number): void {
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        console.log('Fetched patient:', patient); // Log the patient data

        // Process patient image if it exists
        if (patient?.hexImage) {
          patient.hexImage = this.commonService.detectMimeTypeAndPrepend(patient.hexImage);
        }

        // Format preferred start and end times
        if (patient?.preferredStartTime) {
          patient.preferredStartTime = this.datePipe.transform(patient.preferredStartTime, 'HH:mm') || patient.preferredStartTime;
        }
        if (patient?.preferredEndTime) {
          patient.preferredEndTime = this.datePipe.transform(patient.preferredEndTime, 'HH:mm') || patient.preferredEndTime;
        }

        // Map preferred clinic name
        if (patient?.preferredClinicId) {
          const preferredClinic = this.clinics.find(clinic => clinic.id === patient.preferredClinicId);
          patient.preferredClinicName = preferredClinic ? preferredClinic.name : 'Unknown Clinic';
        }

        // Map preferred doctor name
        if (patient?.preferredDoctorId) {
          const preferredDoctor = this.doctors.find(doctor => doctor.doctorId === patient.preferredDoctorId);
          patient.preferredDoctorName = preferredDoctor ? preferredDoctor.firstName : 'Unknown Doctor';
        }

        this.patient = patient; // Assign the processed patient data to the component property
      },
      error: (error) => {
        console.error('Error loading patient:', error);
      }
    });
  }

  // Method to load doctors data
  loadDoctors(): void {
    this.patientService.getDoctors().subscribe(
      (response: any) => {
        console.log(response);

        // Map only doctorId and firstName from the response's data array
        this.doctors = response.data.map((doctor: any) => {
          return {
            doctorId: doctor.doctorId,
            firstName: doctor.firstName
          };
        });

        console.log(this.doctors); // Log the resulting array of doctors
      },
      (error) => {
        console.error('Error fetching doctors', error);
      }
    );
  }

  // Method to load clinics data
  loadClinics(): void {
    this.patientService.getClinics().pipe(
      tap(clinics => console.log('Raw response:', clinics)),
      catchError(error => {
        console.error('Error fetching clinics', error);
        return of([]);
      })
    ).subscribe({
      next: (clinics) => {
        this.clinics = clinics;
        console.log('Mapped clinics:', this.clinics);
      },
      error: (error) => console.error('Error in subscription', error)
    });
  }
  // loadClinics(): void {
  //   this.patientService.getClinics().pipe(
  //     tap(response => console.log('Raw response:', response)), // Log the raw response
  //     map((response: any) => {
  //       // Check if response is an array of clinics
  //       if (Array.isArray(response)) {
  //         return response.map((clinic: any) => ({
  //           id: clinic.id,
  //           name: clinic.name
  //         }));
  //       } else {
  //         // Handle unexpected format
  //         console.error('Unexpected data format:', response);
  //         return []; // Return an empty array if data format is unexpected
  //       }
  //     }),
  //     tap(clinics => {
  //       if (clinics.length === 0) {
  //         console.warn('No clinics found');
  //       } else {
  //         console.log('Mapped clinics:', clinics); // Log the mapped clinics
  //       }
  //     }),
  //     catchError(error => {
  //       console.error('Error fetching clinics', error);
  //       return of([]); // Return an empty array in case of an error
  //     })
  //   ).subscribe(
  //     clinics => this.clinics = clinics,
  //     error => console.error('Error in subscription', error) // This should only be needed for unexpected errors
  //   );
  // }

  // Commented out old loadPatient method
  // loadPatient(id: number): void {
  //   this.patientService.getPatientById(id).subscribe(
  //     {
  //       next: (patient) => 
  //         {
  //            // Check if heximage is defined and not null/undefined before processing
  //           if (patient?.heximage) {
  //             // Use the CommonService to add the correct MIME type to the image
  //             patient.heximage = this.commonService.detectMimeTypeAndPrepend(patient.heximage);
  //           }        
  //       },
  //       error: (error) => {
  //         console.error('Error loading patient:', error);
  //       }
  //     } 
  //   )
  // }
}

 
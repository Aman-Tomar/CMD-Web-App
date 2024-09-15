import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient/patient.service';
import { CommonService } from '../../services/patient/commonservice';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css'
})
export class PatientDetailComponent 
{
  patient: Patient | null = null;

  constructor(private route : ActivatedRoute, private patientService : PatientService,private commonService:CommonService){}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(+patientId);
    }
  }

  loadPatient(id: number): void {
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        console.log('Fetched patient:', patient); // Log the patient data

        if (patient?.image) {
          patient.image = this.commonService.detectMimeTypeAndPrepend(patient.image);
        }

        this.patient = patient; // Assign the patient data to the component property
      },
      error: (error) => {
        console.error('Error loading patient:', error);
      }
    });
  }
  // loadPatient(id: number): void {
  //   this.patientService.getPatientById(id).subscribe(
  //     {
  //       next: (patient) => {
  //         this.patient = patient;
  //       },
  //       error: (error) => {
  //         console.error('Error loading patient:', error);
  //       }
  //     } 
  //   )
  // }
}

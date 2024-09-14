import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient/patient.service';

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

  constructor(private route : ActivatedRoute, private patientService : PatientService){}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(+patientId);
    }
  }

  loadPatient(id: number): void {
    this.patientService.getPatientById(id).subscribe(
      {
        next: (patient) => {
          this.patient = patient;
        },
        error: (error) => {
          console.error('Error loading patient:', error);
        }
      } 
    )
  }
}

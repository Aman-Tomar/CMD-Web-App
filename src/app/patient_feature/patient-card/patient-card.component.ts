import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Patient } from '../../models/Patients/patient.model';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.css'
})
export class PatientCardComponent {
  @Input() patient! : Patient;

  get avatarUrl(): string {
    return typeof this.patient.image === 'string' ? this.patient.image : 'assets/img/default-avatar.png';
  }
}

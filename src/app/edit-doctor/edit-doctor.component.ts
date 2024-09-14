import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IDoctor } from '../models/Doctors/doctor.models';
import { DoctorService } from '../services/doctor/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-doctor',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-doctor.component.html',
  styleUrl: './edit-doctor.component.css'
})
export class EditDoctorComponent {
  doctorId: number = 0;
  doctor: IDoctor = {
    doctorId: 0,
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    email: '',
    gender: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    briefDescription: '',
    phoneNo: '',
    status: true,
    specialization: '',
    experienceInYears: 0,
    qualification: '',
    departmentId: 0,
    clinicId: 0,
    profilePicture: ''
  };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.doctorId = Number(params.get('id'));
      this.getDoctorById(this.doctorId);
    });
  }

  getDoctorById(doctorId: number): void {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
      },
      error: (error) => {
        console.error('Error fetching doctor', error);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  formatDate(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString();
  }

  onSubmit() {
    const formattedDate = this.formatDate(this.doctor.dateOfBirth);
    const formData = new FormData();

    formData.append('doctorId', this.doctor.doctorId.toString());
    formData.append('firstName', this.doctor.firstName);
    formData.append('lastName', this.doctor.lastName);
    formData.append('DOB', formattedDate);
    formData.append('email', this.doctor.email);
    formData.append('gender', this.doctor.gender);
    formData.append('address', this.doctor.address);
    formData.append('country', this.doctor.country);
    formData.append('state', this.doctor.state);
    formData.append('city', this.doctor.city);
    formData.append('zipCode', this.doctor.zipCode);
    formData.append('Biography', this.doctor.briefDescription);
    formData.append('phone', this.doctor.phoneNo);
    formData.append('status', this.doctor.status.toString());
    formData.append('specialization', this.doctor.specialization);
    formData.append('ExperienceInYears', this.doctor.experienceInYears.toString());
    formData.append('qualification', this.doctor.qualification);
    formData.append('departmentId', this.doctor.departmentId.toString());
    formData.append('clinicId', this.doctor.clinicId.toString());

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    this.doctorService.editDoctor(this.doctorId, formData).subscribe({
      next: (response) => {
        console.log('Doctor updated successfully', response);
        this.router.navigate(['/doctor']);
      },
      error: (err) => {
        console.error('Error updating doctor', err);
      }
    });
  }
}

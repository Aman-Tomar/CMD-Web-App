import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../services/doctor/doctor.service';
import { IDoctor } from '../models/Doctors/doctor.models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css'
})
export class AddDoctorComponent {
  doctorService = inject(DoctorService);
  router:Router = inject(Router);
  selectedFile: File | null = null; // Variable to store the selected file

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
    profilePicture: ''  // Optional for now, will not store base64 here
  };

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Store the file
  }

  formatDate(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString(); // Returns a format like "2023-09-14T12:34:56.789Z"
  }

  onSubmit() {
    const formattedDate = this.formatDate(this.doctor.dateOfBirth);
    // Create a FormData object to handle the file and other fields
    const formData = new FormData();

    // Append doctor details (except image, because image is a separate file)
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

    // If the image is selected, append it to the FormData
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    // Now send the FormData to the API
    this.doctorService.addDoctor(formData).subscribe({
      next: (response) => {
        console.log('Doctor added successfully', response);
        this.router.navigate(['/doctor']);
      },
      error: (err) => {
        console.log('Error adding doctor');
      }
    });
  } 
}

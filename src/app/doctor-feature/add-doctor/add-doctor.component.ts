import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor/doctor.service';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IDepartment } from '../../models/Doctors/department.models';
import { IClinic } from '../../models/Doctors/clinic.model';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css'] // Note: Corrected 'styleUrl' to 'styleUrls'
})
export class AddDoctorComponent implements OnInit {
  ngOnInit(): void {
    this.loadSpecializations();
    this.loadDepartments();
    this.loadClinics();
  }
  // Service for handling doctor-related operations
  doctorService = inject(DoctorService);

  // Router for navigating to other routes
  router: Router = inject(Router);

  // Holds the selected file for profile picture upload
  selectedFile: File | null = null;

  // List of countries for the country dropdown
  countries: string[] = ['USA', 'Canada', 'UK', 'India'];

  // List of states for the state dropdown based on the selected country
  states: string[] = [];

  specializations: string[] = [];
  qualifications: string[] = [];
  departments: IDepartment[] = [];
  clinics: IClinic[] = [];
  // Model representing the doctor entity
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

  /**
   * Updates the list of states based on the selected country.
   * This method is called when the country dropdown value changes.
   */
  onCountryChange() {
    switch (this.doctor.country) {
      case 'India':
        this.states = [
          'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
          'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
          'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 
          'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 
          'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 
          'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
          'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 
          'Puducherry', 'Ladakh', 'Jammu and Kashmir'
        ];
        break;
      case 'USA':
        this.states = ['California', 'New York', 'Texas'];
        break;
      case 'Canada':
        this.states = ['Ontario', 'Quebec', 'British Columbia'];
        break;
      case 'UK':
        this.states = ['England', 'Scotland', 'Wales', 'Northern Ireland'];
        break;
      default:
        this.states = [];
        break;
    }
  }

  loadSpecializations() {
    // Load specializations from the service
    this.doctorService.getSpecializations().subscribe(data => {
      this.specializations = data.map((item:any)=>item.name);
      console.log( this.specializations );
    });
  }

  loadDepartments() {
    this.doctorService.getDepartments().subscribe((data: IDepartment[]) => {
      this.departments = data; // Storing the whole department object
      console.log(this.departments);
    });
  }

  loadClinics() {
    this.doctorService.getClinics().subscribe((data: any[]) => {
      this.clinics = data.map(clinic => ({
        clinicId: clinic.id, // Mapping 'id' to 'clinicId'
        clinicName: clinic.name // Mapping 'name' to 'clinicName'
      }) as IClinic);
      console.log(this.clinics);
    });
  }
  /**
   * Handles file selection for profile picture upload.
   * @param event - The file input change event.
   */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  /**
   * Formats the date to ISO string format.
   * @param date - The date to format.
   * @returns The formatted date string.
   */
  formatDate(date: any): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString();
  }

  /**
   * Handles form submission for adding a new doctor.
   * Constructs FormData, appends doctor details and file, and submits it to the server.
   */
  onSubmit() {
    // Format the date of birth to ISO string format
    const formattedDate = this.formatDate(this.doctor.dateOfBirth);

    // Create a FormData object to handle file and form data submission
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
    formData.append('Biography', this.doctor.briefDescription); // Note: Ensure server-side accepts 'Biography'
    formData.append('PhoneNo', this.doctor.phoneNo);
    formData.append('status', this.doctor.status.toString());
    formData.append('specialization', this.doctor.specialization);
    formData.append('ExperienceInYears', this.doctor.experienceInYears.toString());
    formData.append('qualification', this.doctor.qualification);
    formData.append('departmentId', this.doctor.departmentId.toString());
    formData.append('clinicId', this.doctor.clinicId.toString());

    // Append profile picture if selected
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    // Call the service to add a doctor and handle the response
    this.doctorService.addDoctor(formData).subscribe({
      next: (response) => {
        console.log('Doctor added successfully', response);
        // Navigate to doctor list or relevant page on successful addition
        this.router.navigate(['/doctor']);
      },
      error: (err) => {
        console.error('Error adding doctor', err);
      }
    });
  } 
}

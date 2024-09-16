import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { DoctorService } from '../../services/doctor/doctor.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IClinic } from '../../models/Doctors/clinic.model';
import { IDepartment } from '../../models/Doctors/department.models';

@Component({
  selector: 'app-edit-doctor',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.css'] // Note: Corrected 'styleUrl' to 'styleUrls'
})
export class EditDoctorComponent implements OnInit{
  // List of countries and states for the dropdowns in the form
  countries: string[] = ['USA', 'Canada', 'UK', 'India']; 
  states: string[] = [];
  specializations: string[] = [];
  qualifications: string[] = [];
  departments: IDepartment[] = [];
  clinics: IClinic[] = [];
  // Model representing the do
  // Stores the ID of the doctor to be edited
  doctorId: number = 0;

  // Doctor model that holds the form data for the doctor being edited
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

  // Holds the selected file for profile picture upload
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,  // Inject ActivatedRoute to access route parameters
    private doctorService: DoctorService,  // Inject DoctorService for API calls
    private router: Router  // Inject Router for navigation after form submission
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    // Subscribe to the route parameters and retrieve the doctorId from the URL
    this.route.paramMap.subscribe(params => {
      this.doctorId = Number(params.get('id'));
      // Fetch the doctor details for the provided ID
      this.getDoctorById(this.doctorId);
      this.loadDepartments();
      this.loadClinics();
    });
  }

  // Method to fetch the doctor details by ID
  getDoctorById(doctorId: number): void {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (doctor) => {
        // Convert the received date of birth to Date object
       // doctor.dateOfBirth = this.convertDateForInput(doctor.dateOfBirth);// Convert to Date object
        //  doctor.dateOfBirth = doctor.dateOfBirth .toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
        
        // Copy other properties
        this.doctor = doctor;
        // Trigger country change to load the correct list of states
        this.onCountryChange();
      },
      error: (error) => {
        console.error('Error fetching doctor', error);
      }
    });
  }

  //Converts the date format to 'YYYY-MM-DD' for proper input display
  convertDateForInput(date: string): string {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];  // Format to 'YYYY-MM-DD'
  }
  

  // Handles file selection for profile picture upload
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
  // Method triggered on form submission
  onSubmit() {
    const formData = new FormData();

    // Append all the fields to the FormData for multipart form submission
    formData.append('doctorId', this.doctor.doctorId.toString());
    formData.append('firstName', this.doctor.firstName);
    formData.append('lastName', this.doctor.lastName);
    
    // Format date of birth as 'YYYY-MM-DD' before appending
    const formattedDateOfBirth = this.doctor.dateOfBirth instanceof Date
    ? this.doctor.dateOfBirth.toISOString().split('T')[0]
    : this.doctor.dateOfBirth; // In case it's already a string

    formData.append('DOB', formattedDateOfBirth);
    formData.append('email', this.doctor.email);
    formData.append('gender', this.doctor.gender);
    formData.append('address', this.doctor.address);
    formData.append('country', this.doctor.country);
    formData.append('state', this.doctor.state);
    formData.append('city', this.doctor.city);
    formData.append('zipCode', this.doctor.zipCode);
    formData.append('Biography', this.doctor.briefDescription);  // Field expected by the server as 'Biography'
    formData.append('PhoneNo', this.doctor.phoneNo);
    formData.append('status', this.doctor.status.toString());
    formData.append('specialization', this.doctor.specialization);
    formData.append('ExperienceInYears', this.doctor.experienceInYears.toString());
    formData.append('qualification', this.doctor.qualification);
    formData.append('departmentId', this.doctor.departmentId.toString());
    formData.append('clinicId', this.doctor.clinicId.toString());
   
    // If a new profile picture is selected, append it to the form data
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    } else {
      formData.append('profilePicture', this.doctor.profilePicture || '');
    }

    // Make the PUT request to update the doctor details
    this.doctorService.editDoctor(this.doctorId, formData).subscribe({
      next: (response) => {
        console.log('Doctor updated successfully', response);
        // Navigate back to the doctor list after a successful update
        this.router.navigate(['/doctor']);
      },
      error: (err) => {
        console.error('Error updating doctor', err);
      }
    });
  }

  // Updates the list of states based on the selected country
  onCountryChange() {
    if (this.doctor.country === 'India') {
      this.states = [
        'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
        'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
        'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
      ];
    } else if (this.doctor.country === 'USA') {
      this.states = ['California', 'New York', 'Texas']; 
    } else if (this.doctor.country === 'Canada') {
      this.states = ['Ontario', 'Quebec', 'British Columbia'];
    } else if (this.doctor.country === 'UK') {
      this.states = ['England', 'Scotland', 'Wales', 'Northern Ireland'];
    } else {
      // Clear the states if the country is not recognized or not selected
      this.states = [];
    }
  }
}

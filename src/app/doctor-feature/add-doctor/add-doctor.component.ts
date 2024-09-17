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
  // Service for handling doctor-related operations
  doctorService = inject(DoctorService);
  
  // Router for navigating to other routes
  router: Router = inject(Router);
  
  // Holds the selected file for profile picture upload
  selectedFile: File | null = null;
  
  // List of countries for the country dropdown
  //  countries: string[] = ['USA', 'Canada', 'UK', 'India'];

//  // List of states for the state dropdown based on the selected country
//  states: string[] = [];
 departmentName:string='';
 specializations: string[] = [];
 qualifications: string[] = [];
 departments: IDepartment[] = [];
 clinics: IClinic[] = [];
 countryStates:any[] = []

  // To hold the country and state data
  countries: any[] = [];     // List of countries
  states: any[] = [];        // List of states based on selected country
  selectedCountry: string = ''; // To store selected country
  selectedState: string = '';   // To store selected state
  selectedCountryName :string='';
  selectedStateName:string = '';
  errorMessage:string='';
  maxDate: string = '';

onDepartmentChange(event: any) {
  const departmentId  = Number(event?.target.value);
  const selectedDepartment = this.departments.find(dept => dept.departmentId === departmentId);
  if (selectedDepartment) {
    this.doctor.specialization = selectedDepartment.departmentName;
  }
}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadClinics();
    this.loadCountryStates();

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    
  }
 
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

 

  onCountryChange(event: any) {
    const selectedCountryCode = event.target.value;
    // console.log("Selected country code: ", selectedCountryCode);
    console.log("Available country states data: ", this.countryStates);
    const selectedCountry = this.countryStates.find(country => country.code2 === selectedCountryCode);
    console.log("Selected country: ", selectedCountry);
    this.selectedCountryName = selectedCountry.name;
    if (selectedCountry) {
      this.states = selectedCountry.states;
      console.log("States for selected country: ", this.states);
    }
  }
  
  onStateChange(event: any) {
    const selectedStateCode = event.target.value;
    console.log("Selected state code: ", selectedStateCode);
  
    const selectedState = this.states.find(state => state.code === selectedStateCode);
    console.log("Selected state: ", selectedState);
  
    if (selectedState) {
      this.selectedStateName = selectedState.name; // Update the selected state name
    }
  }

  loadDepartments() {
    this.doctorService.getDepartments().subscribe((data: IDepartment[]) => {
      this.departments = data; // Storing the whole department object
      //console.log(this.departments);
    });
  }
  
  loadCountryStates(): void {
    this.doctorService.getCountryStates().subscribe({
      next: (data: any) => {
        this.countryStates = data;
        this.countries = data.map((country: any) => ({
          code: country.code2,
          name: country.name
        }));
        console.log("Countries loaded: ", this.countries); // Debugging line
      },
      error: (err: string) => {
        console.log("Error occurred", err);
      }
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

  updateSpecialization() {
    const selectedDepartment = this.departments.find(dept => dept.departmentId === this.doctor.departmentId);
    if (selectedDepartment) {
      this.doctor.specialization = selectedDepartment.departmentName;
    }
  }
  
  /**
   * Handles form submission for adding a new doctor.
   * Constructs FormData, appends doctor details and file, and submits it to the server.
   */
  onSubmit() {
    const experienceInYears = this.doctor.experienceInYears.toString();
    if (experienceInYears.startsWith('0') && experienceInYears.length > 1) {
      this.errorMessage = 'Experience in years cannot have leading zeros.';
      return;
    }
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
    formData.append('Specialization', this.doctor.specialization);
    formData.append('ExperienceInYears', this.doctor.experienceInYears.toString());
    formData.append('qualification', this.doctor.qualification);
    formData.append('departmentId', this.doctor.departmentId.toString());
    formData.append('clinicId', this.doctor.clinicId.toString());

    // Append profile picture if selected
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }
    
    // if (this.selectedFile) {
    //   formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    // }
    console.log("formData:", formData);
    debugger
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

  onCountrychange() {
    if (this.doctor.country === 'India') {
      this.states = [
        'Arunachal Pradesh', 'Assam', 
        'Bihar', 
        'Chhattisgarh', 
        'Goa', 
        'Gujarat', 
        'Haryana', 
        'Himachal Pradesh', 
        'Jharkhand', 
        'Karnataka', 
        'Kerala', 
        'Madhya Pradesh', 
        'Maharashtra', 
        'Manipur', 
        'Meghalaya', 
        'Mizoram', 
        'Nagaland', 
        'Odisha', 
        'Punjab', 
        'Rajasthan', 
        'Sikkim', 
        'Tamil Nadu', 
        'Telangana', 
        'Tripura', 
        'Uttar Pradesh', 
        'Uttarakhand', 
        'West Bengal',
        'Andaman and Nicobar Islands',
        'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Lakshadweep',
        'Delhi',
        'Puducherry',
        'Ladakh',
        'Jammu and Kashmir'
      ];
    } else if (this.doctor.country === 'United States') {
      this.states = this.states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
        'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 
        'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 
        'Wyoming'
      ];;
    } else {
      this.states = [];
    }
  }
  

  hasValidName(value: string): boolean {
    const namePattern = /^[^\s][a-zA-Z\s]*$/;
    return !namePattern.test(value);
  } 

  hasInvalidPhoneNumber(value: string): boolean {
    const phonePattern = /^(\+91|91)?[6-9][0-9]{9}$/;
    return !phonePattern.test(value);
  }
}

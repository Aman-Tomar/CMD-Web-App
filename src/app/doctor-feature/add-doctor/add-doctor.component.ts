
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

  onPostalCodeChange(postalCode: string): void {
    if (postalCode) {
      // Call the API to get the details for the given postal code
      this.doctorService.getPostalCodeDetails(postalCode).subscribe({
        next: (response:any) => {
          if (response && response[0].PostOffice.length > 0) {
            const postOffice = response[0].PostOffice[0];  // Take the first matching Post Office 
            // Update the form fields with the retrieved data
            this.doctor.city = postOffice.Block;
            this.doctor.state = postOffice.State;
            this.doctor.country = postOffice.Country;

            this.selectStateFromPostalCode(postOffice.State);
            this.selectCountryFromPostalCode(postOffice.Country);
          }else {
            // No Post Offices found for the given postal code
            this.errorMessage = 'Enter a valid pincode';
          }
        },
        error: (err:any) => {
          console.error('Error fetching postal code details', err);
          this.errorMessage = 'Enter a valid pincode';
        }
      });
    }
  }
  
  selectCountryFromPostalCode(country: string): void {
    // Automatically select the country in the dropdown based on the API response
    const matchedCountry = this.countries.find(c => c === country);
    if (matchedCountry) {
      this.doctor.country = matchedCountry;
      this.onCountryChange(matchedCountry); // Trigger state population when country changes
    }
  }

  selectStateFromPostalCode(state: string): void {
    // Automatically select the state in the dropdown based on the API response
    const matchedState = this.states.find(s => s === state);
    if (matchedState) {
      this.doctor.state = matchedState;
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
    formData.append('Phone', this.doctor.phoneNo);
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

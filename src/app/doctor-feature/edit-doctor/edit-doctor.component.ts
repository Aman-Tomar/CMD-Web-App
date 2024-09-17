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
   doctorId:number = 0;
   formattedDateOfBirth: string = '';

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
  maxDate: string = '';

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
      this.loadStates();
      this.loadCountries();
      //this.loadCountryStates();

      const today = new Date();
      this.maxDate = today.toISOString().split('T')[0];
    
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

  loadStates(){
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
    ];
  }

  loadCountries(){
     this.countries = ['India','United States']
  }
  // Method to fetch the doctor details by ID
  getDoctorById(doctorId: number): void {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (data) => {
        // Convert the received date of birth to Date object
       // doctor.dateOfBirth = this.convertDateForInput(doctor.dateOfBirth);// Convert to Date object
        //  doctor.dateOfBirth = doctor.dateOfBirth .toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
        // Copy other properties
        if (data.dateOfBirth) {
          this.doctor.dateOfBirth = new Date(data.dateOfBirth); // Store as Date object
          this.formattedDateOfBirth = this.doctor.dateOfBirth.toISOString().split('T')[0]; // Store formatted 'yyyy-MM-dd' string for form
        }

        this.doctor = data;
        this.doctor.status = ( data.status === true) ? true : false; 
        // this.doctor.dateOfBirth = data.dateOfBirth;
      },
      error: (error) => {
        console.error('Error fetching doctor', error);
      }
    });
  }

  
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
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

  onDepartmentChange(event: any) {
    const departmentId  = Number(event?.target.value);
    const selectedDepartment = this.departments.find(dept => dept.departmentId === departmentId);
    if (selectedDepartment) {
      this.doctor.specialization = selectedDepartment.departmentName;
    }
  }

  onDateChange(event: any): void {
    const dateString = event.target.value;
    this.doctor.dateOfBirth = dateString;
  }

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
      ];
    } else {
      this.states = [];
    }
  }
 
}

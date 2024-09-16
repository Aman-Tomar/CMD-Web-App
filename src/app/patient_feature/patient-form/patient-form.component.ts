import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';


import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient/patient.service';
import { Patient } from '../../models/Patients/patient.model';
import { Doctor } from '../../models/Patients/doctor.model';
import { Clinic } from '../../models/Patients/clinic.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  
  patientForm: FormGroup;
  isEditMode: boolean = false;
  doctors:Doctor[]=[];
  clinics:Clinic[]=[];
  maxDate: string='';
  //states: any[] = [];
  patientId: number | null = null;
  countries: { code: string, name: string }[] = [
    { code: 'IN', name: 'India' }
    // Add other countries as needed
  ];
   states: { code: string, name: string }[] = [];
  showStates: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  showGuardianFields: boolean = false;
 

  currentUserId: number = 1; // Assuming user with ID 1 is logged in

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patientForm = this.initForm();
    this.setMaxDate();
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;
    if (this.patientId) {
      this.isEditMode = true;
      this.loadPatientData(this.patientId);
    }

    this.patientForm.get('dob')?.valueChanges.subscribe(dob => {
      this.calculateAge(dob);
    });
    //this.patientForm=this.fb.group({preferredDoctorId:['']});

    this.loadDoctors();
    this.loadClinics();
   // this.loadStates();
  }

  // loadStates(): void {

  //   this.patientService.getStates().subscribe(
    
  //     (data) => {
  //       console.log(data);
  //       this.states = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching states', error);
  //     }
  //   );
  // }


  setMaxDate() {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2); // Add leading zero if needed
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const year = today.getFullYear();
    
    this.maxDate = `${year}-${month}-${day}`;
  }

  loadIndianStates(): void {
    this.states = [
      { code: 'AN', name: 'Andaman and Nicobar Islands' },
      { code: 'AP', name: 'Andhra Pradesh' },
      { code: 'AR', name: 'Arunachal Pradesh' },
      { code: 'AS', name: 'Assam' },
      { code: 'BR', name: 'Bihar' },
      { code: 'CH', name: 'Chandigarh' },
      { code: 'CT', name: 'Chhattisgarh' },
      { code: 'DN', name: 'Dadra and Nagar Haveli' },
      { code: 'DD', name: 'Daman and Diu' },
      { code: 'DL', name: 'Delhi' },
      { code: 'GA', name: 'Goa' },
      { code: 'GJ', name: 'Gujarat' },
      { code: 'HR', name: 'Haryana' },
      { code: 'HP', name: 'Himachal Pradesh' },
      { code: 'JK', name: 'Jammu and Kashmir' },
      { code: 'JH', name: 'Jharkhand' },
      { code: 'KA', name: 'Karnataka' },
      { code: 'KL', name: 'Kerala' },
      { code: 'LA', name: 'Ladakh' },
      { code: 'LD', name: 'Lakshadweep' },
      { code: 'MP', name: 'Madhya Pradesh' },
      { code: 'MH', name: 'Maharashtra' },
      { code: 'MN', name: 'Manipur' },
      { code: 'ML', name: 'Meghalaya' },
      { code: 'MZ', name: 'Mizoram' },
      { code: 'NL', name: 'Nagaland' },
      { code: 'OR', name: 'Odisha' },
      { code: 'PY', name: 'Puducherry' },
      { code: 'PB', name: 'Punjab' },
      { code: 'RJ', name: 'Rajasthan' },
      { code: 'SK', name: 'Sikkim' },
      { code: 'TN', name: 'Tamil Nadu' },
      { code: 'TG', name: 'Telangana' },
      { code: 'TR', name: 'Tripura' },
      { code: 'UP', name: 'Uttar Pradesh' },
      { code: 'UT', name: 'Uttarakhand' },
      { code: 'WB', name: 'West Bengal' }
    ];
  }

  loadDoctors(): void {
    this.patientService.getDoctors().subscribe(
      (response: any) => {
        console.log(response);
        
        // Map only doctorId and firstName from the response's data array
        this.doctors = response.data.map((doctor: any) => {
          return {
            doctorId: doctor.doctorId,
            firstName: doctor.firstName
          };
        });
  
        console.log(this.doctors); // Check the resulting array
      },
      (error) => {
        console.error('Error fetching doctors', error);
      }
    );
  }
  loadClinics(): void {
    this.patientService.getClinics().subscribe(
      (response: any) => {
        console.log(response);
        
        // Map only doctorId and firstName from the response's data array
        this.clinics= response.data.map((clinic: any) => {
          return {
            id: clinic.id,
            name: clinic.name
          };
        });
  
        console.log(this.clinics); // Check the resulting array
      },
      (error) => {
        console.error('Error fetching clinics', error);
      }
    );
  }
  


  initForm(): FormGroup {
    return this.fb.group({
      patientName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      age: [{ value: '', disabled: true }, [Validators.required, Validators.min(0), Validators.max(150)]],
      dob: ['', [Validators.required]],
      gender: ['', Validators.required],
      preferredStartTime: ['',Validators.required],
      
      preferredEndTime: ['',Validators.required],
      streetAddress: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      state: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      country: ['', Validators.required],
      zipCode: ['', [Validators.required, this.zipCodeValidator.bind(this)]],
      image: [''],

      preferredClinicId: [''],
      preferredDoctorId: [''],
      patientGuardianName: [''],
      patientGuardianPhoneNumber: [''],
      patientGuardianRelationship: ['']
    });
  }

  loadPatientData(id: number): void {
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patientForm.patchValue(patient);
        this.patientForm.patchValue({ patientAddressId: patient.patientAddressId });
        this.onCountryChange();
        if (patient.image && typeof patient.image === 'string') {
          this.imagePreview = patient.image;
        }
      },
      error: (error) => console.error('Error loading patient data', error)
    });
  }
  
  onSubmit(): void {
    if (this.patientForm.valid )
    //if (this.patientForm.valid && !this.patientForm.invalid)
       {
        
      const patientData: Patient = this.patientForm.value;
      
      if (this.patientForm.get('preferredDoctorId')) {
        patientData.preferredDoctorId = +this.patientForm.get('preferredDoctorId')?.value;
      }
      this.convertImageToBase64(patientData.image || null)
        .then(base64Image => {
          patientData.image = base64Image as string | undefined;
          this.submitPatientData(patientData);
        })
        .catch(error => {
          console.error('Error converting image to base64:', error);
          // Handle the error (e.g., show an error message to the user)
        });
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.patientForm.controls).forEach(key => {
        const control = this.patientForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  onReset() {
    this.patientForm.reset();
  }

  convertImageToBase64(image: File | string | null): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve(null);
      } else if (typeof image === 'string') {
        resolve(image);
      } else if (image instanceof File) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String = e.target.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(image);
      } else {
        reject(new Error('Invalid image type'));
      }
    });
  }

  submitPatientData(patientData: Patient): void {
    const formattedData: any = {
      patientId: this.isEditMode ? this.patientId : 0,
      patientName: patientData.patientName,
      email: patientData.email,
      phone: patientData.phone,
      age: this.calculateAge(patientData.dob),
      dob: new Date(patientData.dob).toISOString(),
      gender: patientData.gender,
      createdDate: new Date().toISOString(),
      createdBy: this.currentUserId,
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: this.currentUserId,
      patientAddressId: this.isEditMode ?(patientData.patientAddressId ) : 0,
      streetAddress: patientData.streetAddress,
      city: patientData.city,
      state: patientData.state,
      country: patientData.country,
      zipCode: patientData.zipCode,
    };
    if (patientData.preferredStartTime) formattedData.preferredStartTime = this.formatTime(patientData.preferredStartTime);
    if (patientData.preferredEndTime) formattedData.preferredEndTime = this.formatTime(patientData.preferredEndTime);
    if (patientData.preferredClinicId) formattedData.preferredClinicId = +patientData.preferredClinicId;
    if (patientData.image) formattedData.image = patientData.image;
    if (patientData.preferredDoctorId) formattedData.preferredDoctorId = +patientData.preferredDoctorId;
   

    if (patientData.patientGuardianName) formattedData.patientGuardianName = patientData.patientGuardianName;
    if (patientData.patientGuardianPhoneNumber) formattedData.patientGuardianPhoneNumber = patientData.patientGuardianPhoneNumber;
    if (patientData.patientGuardianRelationship) formattedData.patientGuardianRelationship = patientData.patientGuardianRelationship;
  
    // Remove undefined properties
    Object.keys(formattedData).forEach(key => formattedData[key] === undefined && delete formattedData[key]);
    console.log('Formatted data:', formattedData);
  
    // if (this.isEditMode && this.patientId) {
    //   this.patientService.updatePatient(this.patientId, formattedData).subscribe({
    //     next: () => this.router.navigate(['/patients']),
    //     error: (error) => this.handleError(error)
    //   });
    // } else {
    //   this.patientService.createPatient(formattedData).subscribe({
    //     next: () => this.router.navigate(['/patients']),
    //     error: (error) => this.handleError(error)
    //   });
    // }
  }

  calculateAge(dob: string): number {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Ensure the calculated age is not negative
      age = Math.max(0, age);
      
      this.patientForm.get('age')?.setValue(age);
      this.toggleGuardianFields(age);
      return age;
    }
    return 0;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }

  formatTime(timeString: string | null): string | null {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date.toISOString();
  }
  // formatTime(time: string): string {
  //   const [hour, minute] = time.split(':');
  //   const period = +hour < 12 ? 'AM' : 'PM';
  //   const formattedHour = (+hour % 12 || 12).toString().padStart(2, '0');
  //   return `${formattedHour}:${minute} ${period}`;
  // }

  handleError(error: any): void {
    console.error('Error:', error);
    if (error.error && error.error.errors) {
      console.error('Validation errors:', error.error.errors);
      // Display error messages to the user
      // You can use a toast notification or update the UI to show these errors
    }
    // You can add more specific error handling here if needed
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.patientForm.patchValue({ image: file });
    }
  }

  removeAvatar(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.patientForm.patchValue({ image: null });
  }

  toggleGuardianFields(age: number): void {
    this.showGuardianFields = age < 18;
  }

  zipCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const zipCode = control.value;
      const country = this.patientForm.get('country')?.value;
      const state = this.patientForm.get('state')?.value;

      if (country === 'IN' && state) {
        // Basic Indian zip code validation (6 digits)
        const isValid = /^[1-9][0-9]{5}$/.test(zipCode);

        // State-specific zip code validations
        switch (state) {
          case 'AN': if (!/^744/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'AP': if (!/^5[0-3]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'AR': if (!/^79[0-6]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'AS': if (!/^78/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'BR': if (!/^8[0-5]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'CH': if (!/^16[0-4]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'CT': if (!/^49/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'DN': if (!/^396/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'DD': if (!/^396/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'DL': if (!/^11/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'GA': if (!/^403/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'GJ': if (!/^3[6-9]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'HR': if (!/^1[2-3]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'HP': if (!/^1[7-9]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'JK': if (!/^1[8-9]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'JH': if (!/^8[1-3]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'KA': if (!/^5[6-9]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'KL': if (!/^6[7-9]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'LA': if (!/^194/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'LD': if (!/^682/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'MP': if (!/^4[5-8]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'MH': if (!/^4[0-4]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'MN': if (!/^795/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'ML': if (!/^79[3-4]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'MZ': if (!/^796/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'NL': if (!/^797/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'OR': if (!/^7[5-7]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'PY': if (!/^605/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'PB': if (!/^1[4-6]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'RJ': if (!/^3[0-4]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'SK': if (!/^737/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'TN': if (!/^6[0-6]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'TG': if (!/^5[0-3]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'TR': if (!/^799/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'UP': if (!/^2[0-8]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'UT': if (!/^24[46-9]/.test(zipCode)) return { invalidZipCode: true }; break;
          case 'WB': if (!/^7[0-4]/.test(zipCode)) return { invalidZipCode: true }; break;
        }

        return isValid ? null : { invalidZipCode: true };
      }

      return null;
    }
  }

 

  // onCountryChange(): void {
  //   const country = this.patientForm.get('country')?.value;
  //   this.showStates = country === 'IN';
  //   this.patientForm.get('state')?.reset();
  //   this.patientForm.get('zipCode')?.reset();

  //   if (this.showStates) {
  //     this.patientService.getStates().subscribe(
  //       states => {
  //         this.states = states.filter(state => state.countryCode === 'IN'); // Filter as needed
  //         this.patientForm.get('state')?.setValidators([Validators.required]);
  //         this.patientForm.get('state')?.updateValueAndValidity();
  //       },
  //       error => {
  //         console.error('Error fetching states:', error);
  //         this.states = [];
  //       }
  //     );
  //   } else {
  //     this.states = [];
  //     this.patientForm.get('state')?.clearValidators();
  //     this.patientForm.get('state')?.updateValueAndValidity();
  //   }
  // }
  onCountryChange() {
    const country = this.patientForm.get('country')?.value;
    this.showStates = country === 'IN';
    this.patientForm.get('state')?.reset();
    this.patientForm.get('zipCode')?.reset();

    if (this.showStates) {
      this.loadIndianStates();
      this.patientForm.get('state')?.setValidators([Validators.required]);
    } else {
      this.states = [];
      this.patientForm.get('state')?.clearValidators();
    }
    this.patientForm.get('state')?.updateValueAndValidity();
    this.patientForm.get('zipCode')?.updateValueAndValidity();
  }
}
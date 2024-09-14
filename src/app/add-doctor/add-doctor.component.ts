import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../services/doctor/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css'
})
export class AddDoctorComponent {
  patientForm: FormGroup;
  isEditMode: boolean = false;
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
  clinics: { id: number, name: string }[] = [
    { id: 1, name: 'Main Clinic' },
    { id: 2, name: 'Branch Clinic 1' },
    { id: 3, name: 'Branch Clinic 2' }
  ];
  doctors: { id: number, name: string }[] = [
    { id: 1, name: 'Dr. John Doe' },
    { id: 2, name: 'Dr. Jane Smith' },
    { id: 3, name: 'Dr. Mike Johnson' }
  ];
  currentUserId: number = 1; // Assuming user with ID 1 is logged in

  constructor(
    private fb: FormBuilder,
    private patientService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patientForm = this.initForm();
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
  }

  initForm(): FormGroup {
    return this.fb.group({
      patientName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      age: [{ value: '', disabled: true }, [Validators.required, Validators.min(0), Validators.max(150)]],
      dob: ['', [Validators.required, Validators.pattern(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/)]],
      gender: ['', Validators.required],
      preferredStartTime: [''],
      preferredEndTime: [''],
      streetAddress: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      state: [''],
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

  calculateAge(dob: string): void {
    if (dob) {
      const [day, month, year] = dob.split('-');
      const birthDate = new Date(+year, +month - 1, +day);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      this.patientForm.get('age')?.setValue(age);
      this.toggleGuardianFields(age);
    }
  }

  toggleGuardianFields(age: number): void {
    this.showGuardianFields = age < 18;
    const guardianFields = ['patientGuardianName', 'patientGuardianPhoneNumber', 'patientGuardianRelationship'];
    
    if (this.showGuardianFields) {
      this.patientForm.get('patientGuardianName')?.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]);
      this.patientForm.get('patientGuardianPhoneNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]);
      this.patientForm.get('patientGuardianRelationship')?.setValidators([
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]);
    } else {
      guardianFields.forEach(field => {
        this.patientForm.get(field)?.clearValidators();
        this.patientForm.get(field)?.setValue('');
      });
    }
    guardianFields.forEach(field => this.patientForm.get(field)?.updateValueAndValidity());
  }

  loadPatientData(id: number): void {
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patientForm.patchValue(patient);
        this.onCountryChange();
        if (patient.image && typeof patient.image === 'string') {
          this.imagePreview = patient.image;
        }
      },
      error: (error) => console.error('Error loading patient data', error)
    });
  }

  onCountryChange(): void {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.patientForm.patchValue({ image: this.selectedFile });
    }
  }

  validateFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  }

  removeAvatar(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.patientForm.get('image')?.setValue(null);
  }

  onSubmit(): void {
    console.log('Form validity:', this.patientForm.valid);
    console.log('Form errors:', this.patientForm.errors);
    console.log('Form value:', this.patientForm.value);
    
    if (this.patientForm.valid) {
      const patientData: Patient = this.patientForm.value;
      
      if (patientData.preferredDoctorId) {
        patientData.preferredDoctorId = +patientData.preferredDoctorId;
      }

      this.convertImageToBase64(patientData.image as (File | string | null))
        .then(base64Image => {
          patientData.image = base64Image;
          this.submitPatientData(patientData);
        })
        .catch(error => {
          console.error('Error converting image to base64:', error);
          // Handle the error (e.g., show an error message to the user)
        });
    } else {
      console.log('Form is invalid. Checking individual controls:');
      Object.keys(this.patientForm.controls).forEach(key => {
        const control = this.patientForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
    }
  }

  convertImageToBase64(image: File | string | null): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve(null);
        return;
      }

      if (typeof image === 'string') {
        resolve(image);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
    });
  }

  submitPatientData(patientData: Patient): void {
    const formattedData: any = {
      patientId: this.isEditMode ? this.patientId : 0,
      patientName: patientData.patientName,
      email: patientData.email,
      phone: patientData.phone,
      age: patientData.age,
      dob: this.formatDate(patientData.dob),
      gender: patientData.gender,
      createdDate: new Date().toISOString(),
      createdBy: this.currentUserId, // Use the current user's ID
      lastModifiedDate: new Date().toISOString(),
      lastModifiedBy: this.currentUserId, // Use the current user's ID
      patientAddressId: 0,
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
  
    console.log('Formatted data:', formattedData);
  
    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatient(this.patientId, formattedData as Patient).subscribe({
        next: () => this.router.navigate(['/patients']),
        error: (error) => this.handleError(error)
      });
    } else {
      this.patientService.createPatient(formattedData as Patient).subscribe({
        next: () => this.router.navigate(['/patients']),
        error: (error) => this.handleError(error)
      });
    }
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`;
  }
  
  formatTime(timeString: string | null): string | null {
    if (!timeString) return null;
    return `2024-01-01T${timeString}:00Z`;
  }

  handleError(error: any): void {
    console.error('Error:', error);
    if (error.error && error.error.errors) {
      console.error('Validation errors:', error.error.errors);
      // Display error messages to the user
      // You can use a toast notification or update the UI to show these errors
    }
    // You can add more specific error handling here if needed
  }
}

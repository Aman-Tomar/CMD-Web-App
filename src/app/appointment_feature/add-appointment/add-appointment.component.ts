import { CommonModule } from '@angular/common';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { Patient } from '../../models/Appointment/Patient';
import { PatientResponse } from '../../models/Appointment/PatientResponse';
import { IDoctor } from '../../models/Appointment/Doctor';
import { IAppointment } from '../../models/Appointment/Appointment';
import { AppointmentStatus } from '../../models/Appointment/AppointmentStatus';
import { dateRangeValidator, doctorAvailabilityValidator, timeNotInPastValidator } from '../../Validators/AppointmentCustomValidator';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule,FormsModule,RouterLink],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent implements OnInit {
  appointmentService:AppointmentService=inject(AppointmentService);
  router:Router=inject(Router);
  patients: Patient[]=[];
  doctors: IDoctor[]=[];
  errorMessage: string = '';
  successMessage: string = '';
  minDate: string = '';
  maxDate: string = '';
  departments:{departmentId:number,departmentName:string}[]=[];
  purposeOfVisit: any[] = [];
  appointment: IAppointment={
    id: 0,
    purposeOfVisit: '',
    date: '',
    time: '',
    email: '',
    phone: '',
    status: AppointmentStatus.Scheduled,
    message: '',
    createdBy: 'admin',
    lastModifiedBy: 'admin',
    patientId: 0,
    doctorId: 0
  };


  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadDepartments();
    this.loadPurposeOfVisit();
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

     // Set maximum date to 30 days from today
     const maxDate = new Date();
     maxDate.setDate(maxDate.getDate() + 30);
     this.maxDate = maxDate.toISOString().split('T')[0];
  }
  

  reactiveForm=new FormGroup({
    patient:new FormControl('',[Validators.required]),
    doctor:new FormControl('',[Validators.required]),
    purposeOfVisit: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^(\+91|91)?[6-9][0-9]{9}$/)]),
    date: new FormControl('', [Validators.required, dateRangeValidator()]),
    time: new FormControl('', [Validators.required,timeNotInPastValidator('date'),doctorAvailabilityValidator('doctor','date',this.appointmentService)]),
    message: new FormControl('', [Validators.required]),
  });

  get Patient() { return this.reactiveForm.get("patient"); }
  get Doctor() { return this.reactiveForm.get("doctor"); }
  get PurposeOfVisit() { return this.reactiveForm.get("purposeOfVisit"); }
  get Email() { return this.reactiveForm.get("email"); }
  get PhoneNumber() { return this.reactiveForm.get("phone"); }
  get Date() { return this.reactiveForm.get("date"); }
  get Time() { return this.reactiveForm.get("time"); }
  get Message() { return this.reactiveForm.get("message"); }


  loadPatients(): void {
    this.appointmentService.getPatients().subscribe({
      next: (data: PatientResponse) => {
        this.patients = data.items;
        console.log(data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }

  loadDoctors(): void {
    console.log("Doctors loading");
    this.appointmentService.getDoctors().subscribe({
      next: (data: any) => {
        this.doctors = data.data;
        console.log("doctors:"+data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }
  
  loadDepartments():void{
    console.log("Departments loading");
    this.appointmentService.getDepartments().subscribe({
      next: (data: any) => {
        this.departments = data;
        console.log("departments:"+data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }

  loadPurposeOfVisit():void{
    this.appointmentService.getPurposeOfVisit().subscribe({
      next: (data: any) => {
        this.purposeOfVisit = data;
        console.log("purposeOfvisit:"+data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }

  onPatientSelect(event: any) {
    const selectedPatientId = event.target.value;

    // Call the API to get patient details by ID
    if (selectedPatientId) {
      this.appointmentService.getPatientById(selectedPatientId).subscribe({
        next: (patientData) => {
          // Populate the email and phone fields
          this.reactiveForm.patchValue({
            email: patientData.email,
            phone: patientData.phone
          });
        },
        error: (error) => {
          console.error('Error fetching patient details:', error);
        }
      });
    }
  }

  onDepartmentSelect(event: any) {
    const selectedDepartmentId = event.target.value;
    console.log(selectedDepartmentId);
    // Call the API to get doctor details by departemntID
    if (selectedDepartmentId) {
      this.appointmentService.getDoctorByDepartment(selectedDepartmentId).subscribe({
        next: (DoctorData:any) => {
          this.doctors=DoctorData;
        },
        error: (error) => {
          console.error('Error fetching patient details:', error);
        }
      });
    }
  }

  goback()
  {
    this.router.navigate(['/appointments'])
  }

  onSubmit() {
    console.log(this.reactiveForm);
    this.mapFormToAppointment();
    console.log(this.appointment);

    if (this.reactiveForm.valid) {
      this.appointmentService.createAppointment(this.appointment).subscribe({
        next:(data) => {
          console.log('Appointment created successfully', data);
          this.successMessage=`Success! Appointment Made Successfully`;
          this.reactiveForm.reset();
          this.goback()  // Optionally reset the form after successful submission
        },
        error:(error)=> {
          this.errorMessage="Error! Appointment Could not be Scheduled ";
          console.error('Error creating appointment', error);
        }
    });
    } 
    else {
      console.log('Form is invalid');
    }
    }

    private mapFormToAppointment() {
      const formValues = this.reactiveForm.value;
    
      // Map form values to the appointment object with default handling
      this.appointment.patientId =Number(formValues.patient); // Provide a default value if needed
      this.appointment.doctorId = Number(formValues.doctor) ; // Provide a default value if needed
      this.appointment.purposeOfVisit = String(formValues.purposeOfVisit );
      this.appointment.date = String(formValues.date )
      this.appointment.time = String(formValues.time )+":00";
      this.appointment.email = String(formValues.email)
      this.appointment.phone =String(formValues.phone )
      this.appointment.message=String(formValues.message)
    }
}

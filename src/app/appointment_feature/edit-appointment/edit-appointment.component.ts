import { CommonModule } from '@angular/common';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { Patient } from '../../models/Appointment/Patient';
import { PatientResponse } from '../../models/Appointment/PatientResponse';
import { IDoctor } from '../../models/Appointment/Doctor';
import { DoctorResponse } from '../../models/Appointment/DoctorResponse';
import { IAppointment } from '../../models/Appointment/Appointment';
import { AppointmentStatus } from '../../models/Appointment/AppointmentStatus';
// import { CustomValidator } from './Validators/AppointmentCustomValidator';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.css'
})
export class EditAppointmentComponent implements OnInit {
  appointmentService:AppointmentService=inject(AppointmentService);
  patients: Patient[]=[];
  doctors: IDoctor[]=[];
  errorMessage: string = '';
  successMessage: string = '';
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
  }
  

  reactiveForm=new FormGroup({
    patient:new FormControl('',[Validators.required]),
    doctor:new FormControl('',[Validators.required]),
    purposeOfVisit:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required,Validators.email]),
    phone:new FormControl('',[Validators.required]),
    date:new FormControl('',[Validators.required]),
    time:new FormControl('',[Validators.required]),
    message:new FormControl('',[Validators.required]),
  });


  get Patient() //read/get property 
  {
    return this.reactiveForm.get("patient");
  }
  get Doctor()
  {
    return this.reactiveForm.get("email");
  }
  get PurposeOfVisit()
  {
    return this.reactiveForm.get("purposeOfVisit");
  }
  get Email()
  {
    return this.reactiveForm.get("email");
  }
  get PhoneNumber()
  {
    return this.reactiveForm.get("PhoneNumber");
  }
  get Date()
  {
    return this.reactiveForm.get("date");
  }
  get Time()
  {
    return this.reactiveForm.get("time");
  }
  get message()
  {
    return this.reactiveForm.get("message");
  }

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
      next: (data: DoctorResponse) => {
        this.doctors = data.data;
        console.log("doctors:"+data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }
  
  onSubmit() {
    console.log(this.reactiveForm);
    this.mapFormToAppointment();
    console.log(this.appointment);
    if (this.reactiveForm.valid) {
      this.appointmentService.createAppointment(this.appointment).subscribe(
        response => {
          console.log('Appointment created successfully', response);
          this.successMessage=`Success! Appointment Made Successfully`;
          this.reactiveForm.reset();  // Optionally reset the form after successful submission
        },
        error => {
          this.errorMessage="Error! Appointment Could not be Scheduled ";
          console.error('Error creating appointment', error);
        }
      );
    } else {
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

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { Patient } from '../../models/Appointment/Patient';
import { PatientResponse } from '../../models/Appointment/PatientResponse';
import { IDoctor } from '../../models/Appointment/Doctor';
import { DoctorResponse } from '../../models/Appointment/DoctorResponse';
import { IAppointment } from '../../models/Appointment/Appointment';
// import { CustomValidator } from './Validators/AppointmentCustomValidator';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent implements OnInit {
  appointmentService:AppointmentService=inject(AppointmentService);
  patients: Patient[]=[];
  doctors: IDoctor[]=[];
  errorMessage: string = '';
  appointment!: IAppointment;


  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
  }
  

  reactiveForm=new FormGroup({
    patient:new FormControl('',[Validators.required]),
    doctor:new FormControl('',[Validators.required]),
    purposeOfVisit:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required,Validators.email]),
    phoneNumber:new FormControl('',[Validators.required]),
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
    }
}

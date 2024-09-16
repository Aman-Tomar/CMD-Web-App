import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientService } from '../services/patient/patient.service';
import { AppointmentService } from '../services/appointmnent/appointment.service';
import { DoctorService } from '../services/doctor/doctor.service';
import { Patient } from '../models/Patients/patient.model';
import { IDoctor } from '../models/Doctors/doctor.models';
import { IAppointment } from '../models/Appointment/Appointment';
import { AppointmentResponse } from '../models/Appointment/AppointmentResponse';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit {
  constructor(private patientService:PatientService,private doctorService:DoctorService,private appointmentService:AppointmentService){}
  //entities
  patients: Patient[] = [];
  doctors: IDoctor[] = [];
  Appointments:IAppointment[]=[];
  AppointmentResponse:AppointmentResponse={items:[],totalAppointments:0,pageLimit:20,pageNumber:1};
  currentPage:number=1;
  pageSize:number=10;
  errorMessage='';
  isLoading:boolean=false;
  
  
  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
    this.getAppointments(this.currentPage, this.pageSize);}
  
    //fetch the data from patients
  
    // Fetch patients (5 entries)
    loadPatients(): void {
      this.patientService.getPatients(this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            this.patients = response.items.slice(0, 5);
            console.log(this.patients) // Ensure only 5 items are displayed
          },
          error: (error: any) => {
            console.error('Error loading patients:', error);
          }
        });
    }
  
     // Fetch doctors (5 entries)
     loadDoctors(): void {
      this.isLoading = true;
      this.doctorService.getAllDoctors(this.currentPage, this.pageSize)
        .subscribe({
          next: (response) => {
            if (response) {
              this.doctors = response.data.slice(0, 5);
              console.log(this.doctors) // Ensure only 5 items are displayed
            } else {
              this.errorMessage = 'No doctor data available.';
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading doctors:', error);
            this.errorMessage = 'Failed to load doctors.';
            this.isLoading = false;
          }
        });
    }
  
  
    //fetch the data from appointments
   // Fetch appointments (5 entries)
   getAppointments(pageNo: number, pageLimit: number): void {
    this.isLoading = true;
    this.appointmentService.getAppointments(pageNo, pageLimit)
      .subscribe({
        next: (response: AppointmentResponse) => {
          this.Appointments = response.items.slice(0, 5); 
          console.log(this.Appointments)
          // Ensure only 5 items are displayed
        },
        error: (err: any) => {
          this.errorMessage = err;
          this.isLoading = false;
        }
      });
    }
  }
  

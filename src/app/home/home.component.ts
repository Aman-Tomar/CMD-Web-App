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
  imports: [NgIf,NgFor,NgClass,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit {
  constructor(private patientService:PatientService,private doctorService:DoctorService,private appointmentService:AppointmentService){}
  //entities
  AppointmentStatus = AppointmentStatus;
  patients: Patient[] = [];
  doctors: IDoctor[] = [];
  patientDetails: { [id: number]: { name: string, age: number,state:string,country:string } } = {}; // Cache for patient details
  doctorDetails: { [id: number]: {name:string} } = {}; // Cache for doctor details

  Appointments:IAppointment[]=[];
  AppointmentResponse:AppointmentResponse={items:[],totalAppointments:0,pageLimit:50,pageNumber:1};
  filteredAppointments:IAppointment[]=[];
  currentPage:number=1;
  pageSize:number=10;
  errorMessage='';
  isLoading:boolean=false;

  totalAppointments:number=0;
  totalScheduledAppointments: number = 0;
  totalCancelledAppointments: number = 0;
  totalClosedAppointments: number = 0;
  
  
  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
    this.getAppointments(1, 50);}
  
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
          this.Appointments = response.items; 
          this.totalAppointments=response.totalAppointments
          this.filteredAppointments=this.Appointments

          this.Appointments.forEach(appointment => {
            this.fetchPatientDetails(appointment.patientId);
            this.fetchDoctorDetails(appointment.doctorId);
          });

           // Filter appointments by "Scheduled" status and calculate total
           this.totalScheduledAppointments = this.Appointments.filter(appointment => 
            appointment.status === AppointmentStatus.Scheduled // Assuming `Scheduled` is a value in AppointmentStatus
          ).length;
          this.totalCancelledAppointments = this.Appointments.filter(appointment => 
            appointment.status === AppointmentStatus.Cancelled // Assuming `Scheduled` is a value in AppointmentStatus
          ).length;

          this.totalClosedAppointments = this.Appointments.filter(appointment => 
            appointment.status === AppointmentStatus.Closed // Assuming `Scheduled` is a value in AppointmentStatus
          ).length;

          console.log(this.Appointments)
          // Ensure only 5 items are displayed
        },
        error: (err: any) => {
          this.errorMessage = err;
          this.isLoading = false;
        }
      });
    }

// Fetch and cache patient details
fetchPatientDetails(patientId: number): void {
  if (!this.patientDetails[patientId]) {
    this.appointmentService.getPatientById(patientId).subscribe({
      next: (response: any) => {
        this.patientDetails[patientId] = { name: response.patientName, age: response.age,state:response.state,country:response.country };
        console.log(this.patientDetails)
      },
      error: () => {
        this.patientDetails[patientId] = { name: 'Unknown', age: 0,state:'',country:'' }; // Handle error case
      }
    });
  }
}

// Fetch and cache doctor details
fetchDoctorDetails(doctorId: number): void {
  if (!this.doctorDetails[doctorId]) {
    this.appointmentService.getDoctorById(doctorId).subscribe({
      next: (response: any) => {
        this.doctorDetails[doctorId] = {name:response.firstName+" "+response.lastName};
        console.log(this.doctorDetails)
      },
      error: () => {
        this.doctorDetails[doctorId] = {name:"Unknown"}; // Handle error case
      }
    });
  }
}



getLimitedAppointments() {
  return this.filteredAppointments.slice(0, 5);
}



  }
  

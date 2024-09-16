import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { IAppointment } from '../../models/Appointment/Appointment';
import { NgClass, NgIf } from '@angular/common';
import { AppointmentStatus } from '../../models/Appointment/AppointmentStatus';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [NgClass,RouterLink,NgIf],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css'
})
export class AppointmentDetailsComponent implements OnInit {
  AppointmentStatus = AppointmentStatus;
  route: ActivatedRoute = inject(ActivatedRoute);
  service: AppointmentService = inject(AppointmentService);
  router: Router = inject(Router);
  successMessage = '';
  errorMessage = '';

  Appointment: IAppointment | undefined;
  Patient: any | undefined;
  Doctor: any | undefined;

  ngOnInit(): void {
    console.log(this.successMessage);
    console.log(this.errorMessage);
    this.route.paramMap.subscribe(param => {
      const id = Number(param.get('id'));
      if (id) {
        // Fetch the appointment details
        this.service.getAppointmentById(id).subscribe({
          next: (data) => {
            this.Appointment = data;
            if (data.patientId) {
              this.getPatientDetails(data.patientId);
            }
            if (data.doctorId) {
              this.getDoctorDetails(data.doctorId);
            }
          },
          error: (err) => console.log(err)
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/appointments']);
  }

  getPatientDetails(patientId: number) {
    this.service.getPatientById(patientId).subscribe({
      next: (patientData) => this.Patient = patientData,
      error: (err) => console.log('Error fetching patient details:', err)
    });
  }

  getDoctorDetails(doctorId: number) {
    this.service.getDoctorById(doctorId).subscribe({
      next: (doctorData) => this.Doctor = doctorData,
      error: (err) => console.log('Error fetching doctor details:', err)
    });
  }

  cancelAppointment(appointmentId: number | undefined) {
    if (!appointmentId) {
      this.errorMessage = 'Invalid appointment ID.';
      return;
    }

    this.service.cancelAppointmentById(appointmentId).subscribe({
      next: () => {
        this.successMessage = 'Appointment canceled successfully!';
        setTimeout(() => {
          this.navigateAndReload('/appointments');
        }, 1500); 
       
      },
      error: (error) => {
        console.log(error);
        
        this.errorMessage = 'Appointments cannot be canceled less than 24 hours before the scheduled time. Please contact support for further assistance.';
        setTimeout(() => {
          this.navigateAndReload('/appointments');
        }, 1500); 
      }
    });
  }

  private navigateAndReload(route: string) {
    this.router.navigate([route]).then(() => {
      this.router.navigateByUrl('/appointments', { skipLocationChange: true }).then(() => {
        this.router.navigate([route]);  // Navigate to the route again to reload the component
      });
    });
  }
}

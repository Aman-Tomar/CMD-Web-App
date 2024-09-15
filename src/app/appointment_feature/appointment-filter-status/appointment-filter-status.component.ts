import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IAppointment } from '../../models/Appointment/Appointment';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { AppointmentResponse } from '../../models/Appointment/AppointmentResponse';

@Component({
  selector: 'app-appointment-filter-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-filter-status.component.html',
  styleUrl: './appointment-filter-status.component.css'
})

export class AppointmentFilterComponent implements OnInit {
  isDropdownVisible = false;
  appointments: IAppointment[] = [];
  filterType: 'active' | 'inactive' | '' = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    // Reset dropdown state on component initialization
    this.isDropdownVisible = false;
    //Reset filterType to empty string
    this.filterType= '';
    // Load initial appointments (you might want to load all appointments by default)
    this.loadAppointments();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  filterAppointments(status: 'active' | 'inactive') {
    this.filterType = status;
    this.isDropdownVisible = false; // Close dropdown after selection
    this.loadAppointments(status);
  }

  private loadAppointments(status?: 'active' | 'inactive') {
    let observable;
    if (status === 'active') {
      observable = this.appointmentService.getActiveAppointments();
    } else if (status === 'inactive') {
      observable = this.appointmentService.getInactiveAppointments();
    // } else {
    //   observable = this.appointmentService.getAppointments();
    // }

    observable.subscribe(
      (data) => {
        // if (status === 'active' || status === 'inactive') {
          // Handle list of appointments
          this.appointments = data;
        } 
        //else {
        //   // Handle AppointmentResponse, 
        //   this.appointments = data.Items;
        // }
      // }
      ,
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
  }
}
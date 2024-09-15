import { Component, inject } from '@angular/core';
import { IAppointment } from '../../models/Appointment/Appointment';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink } from '@angular/router';
import { AppointmentStatus } from '../../models/Appointment/AppointmentStatus';
import { AppointmentResponse } from '../../models/Appointment/AppointmentResponse';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule,NgClass,RouterLink],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent {
AppointmentStatus = AppointmentStatus;
AppointmentResponse:AppointmentResponse={Items:[],TotalAppointments:0,PageLimit:20,PageNumber:1};
Appointments:IAppointment[]=[];
appointmentService:AppointmentService=inject(AppointmentService);
currentPage: number = 1;
pageSize: number = 20;
// totalAppointments: number = 0;
pageSizes: number[] = [5, 10, 20, 50];
totalPages: number[] = [];
isLastPage:boolean=false;
errorMessage: string = '';
sortOrder: string = 'asc'; // Default sort order
loading:boolean=false //Loading default to false

ngOnInit(): void {
  this.getAppointments(this.currentPage, this.pageSize);
  // this.updateTotalPages();
}

getAppointments(pageNo: number, pageLimit: number): void {
  this.loading = true;  // Start loading
  this.appointmentService.getAppointments(pageNo, pageLimit).subscribe({
    next: (data: AppointmentResponse) => {
      this.AppointmentResponse = data;
      console.log('Received data:', data);  // Debugging: log the full response
      this.Appointments = data.Items;  // Assign response.Items to Appointments
      console.log('Appointments:', this.Appointments);  // Debugging: log the appointments

      // Update pagination and check last page
      this.updateTotalPages();
      this.checkLastPage(this.Appointments);

      this.loading = false;  // Stop loading
    },
    error: (err: any) => {
      this.errorMessage = err;
      this.loading = false;  // Stop loading in case of error
      console.error('Error:', this.errorMessage);  // Improved error logging
    }
  });
}


 //Toggle sorting by date
 sortByDate(): void {
  if (this.sortOrder === 'asc') {
    this.AppointmentResponse.Items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.sortOrder = 'desc'; // Toggle to descending order
  } else {
    this.AppointmentResponse.Items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.sortOrder = 'asc'; // Toggle to ascending order
  }
}

updateTotalPages(): void {
  const totalAppointments = this.AppointmentResponse.TotalAppointments; // Length of the filtered appointments
  // const totalPageCount = Math.ceil(totalAppointments / this.pageSize);
  // this.totalPages = Array.from({ length: totalPageCount }, (_, i) => i + 1);
}

  //Check if the current response indicates the last page
  checkLastPage(appointments: IAppointment[]): void {
    console.log(this.Appointments.length,this.pageSize)
    // If the response size is less than the page size, it's the last page
    if (appointments.length < this.pageSize) {
      this.isLastPage = true;
    } else {
      this.isLastPage = false;
    }
  }

// Go to the next page
nextPage(): void {
  if (this.currentPage < this.totalPages.length) {
    this.currentPage++;
    this.getAppointments(this.currentPage, this.pageSize);
  }
}

// Go to the previous page
previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.getAppointments(this.currentPage, this.pageSize);
  }
}

// Go to a specific page
goToPage(pageNo: number): void {
  this.currentPage = pageNo;
  this.getAppointments(this.currentPage, this.pageSize);
}

// Handle page size change
onPageSizeChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  this.pageSize = Number(target.value);
  this.currentPage = 1; // Reset to the first page
  this.getAppointments(this.currentPage, this.pageSize);
}

// Method to format appointment ID
formatAppointmentId(id: number): string {
  return `APT${id.toString().padStart(4, '0')}`;
}

// Method to format status
formatStatus(status: number): string {
  return status === 0 ? 'Active' : 'Inactive';
}
}

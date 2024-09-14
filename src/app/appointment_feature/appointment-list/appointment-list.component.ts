import { Component, inject } from '@angular/core';
import { IAppointment } from '../../models/Appointment/Appointment';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule,NgClass,RouterLink],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent {
Appointments:IAppointment[]=[]
appointmentService:AppointmentService=inject(AppointmentService);
currentPage: number = 1;
pageSize: number = 20;
totalAppointments: number = 0;
pageSizes: number[] = [5, 10, 20, 50];
totalPages: number[] = [];
errorMessage: string = '';

ngOnInit(): void {
  this.getAppointments(this.currentPage, this.pageSize);
}

getAppointments(pageNo: number, pageLimit: number): void {
  this.appointmentService.getAppointments(pageNo, pageLimit).subscribe({
    next: (data: IAppointment[]) => {
      this.Appointments = data;
      console.log(data)
    } ,
    error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
  });
}

 // Update total pages based on the total number of appointments
 updateTotalPages(): void {
  this.totalAppointments = 100; // Assume total appointments count comes from a response (this is just a placeholder)
  const totalPageCount = Math.ceil(this.totalAppointments / this.pageSize);
  this.totalPages = Array.from({ length: totalPageCount }, (_, i) => i + 1);
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

import { Component, inject, OnInit } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-doctor',
  standalone: true,
  imports: [CommonModule,FormsModule,NgIf,RouterLink],
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit{

  doctors: IDoctor[] = [];
  totalDoctors: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;  
  pages: number[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  fallbackimage = 'assets/placeholder-image.jpg';
 

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getAllDoctors(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Ensure the response structure is as expected
        if (response && response.data) {
          this.doctors = response.data.map((doctor: any) => ({
            ...doctor, // Copy all doctor properties
            city: doctor.doctorAddress ? doctor.doctorAddress.city : '' // Map city from doctorAddress
          }));
  
          this.pages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
          console.log(this.doctors);
        } else {
          this.errorMessage = 'No doctor data available.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Failed to load doctors.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Doctor data loading complete.');
      }

    });
  }
 
  changePage(page: number): void {
    if (page !== this.pageNumber) {
      console.log(`Changing page from ${this.pageNumber} to ${page}`);
      this.pageNumber = page;
      this.loadDoctors();
    }
  }
  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = +selectElement.value; // Update the page size based on user selection
    this.pageNumber = 1; // Reset to the first page whenever the page size changes
    this.loadDoctors(); // Reload the doctors with the new page size
  }
  getDisplayRange(): string {
    const start = (this.pageNumber - 1) * this.pageSize + 1;
    const end = Math.min(this.pageNumber * this.pageSize, this.totalDoctors);
    return `Showing ${start} to ${end} of ${this.totalDoctors} entries`;
  }
  
 
}

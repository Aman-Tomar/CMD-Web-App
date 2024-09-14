import { Component, inject, OnInit } from '@angular/core';
import { IDoctor } from '../models/Doctors/doctor.models';
import { DoctorService } from '../services/doctor/doctor.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-doctor',
  standalone: true,
  imports: [CommonModule,NgIf],
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit{

  doctors: IDoctor[] = [];
  totalDoctors: number = 0;
  pageNumber: number = 1;
  pageSize: number = 3;  // Adjust page size as needed
  pages: number[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  

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
 
}

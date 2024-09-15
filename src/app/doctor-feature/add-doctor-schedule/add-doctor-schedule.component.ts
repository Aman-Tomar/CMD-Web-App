import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor/doctor.service';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { Router } from '@angular/router';
import { DoctorScheduleService } from '../../services/doctor/doctor-schedule.service';

@Component({
  selector: 'app-add-doctor-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-doctor-schedule.component.html',
  styleUrls: ['./add-doctor-schedule.component.css'] // Fixed typo: 'styleUrl' to 'styleUrls'
})
export class AddDoctorScheduleComponent implements OnInit {
  // Form group to manage the schedule form
  scheduleForm: FormGroup;
  // Array to hold the list of doctors
  doctors: IDoctor[] = [];
  // Pagination variables
  totalDoctors: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;  // Number of doctors per page
  pages: number[] = [];
  // Loading and error state variables
  isLoading: boolean = false;
  errorMessage: string = '';
  // Fallback image for doctors
  fallbackimage = 'assets/placeholder-image.jpg';
  // Message and status for form submission feedback
  status: boolean | null = null;
  message: string | null = null;
  success: boolean = false;

  constructor(
    private fb: FormBuilder, // FormBuilder service for creating reactive forms
    private doctorService: DoctorService, // Service to interact with doctor-related API
    private doctorScheduleService: DoctorScheduleService, // Service to manage doctor schedules
    private router: Router // Router for navigation
  ) {
    // Initialize the form with default values and validators
    this.scheduleForm = this.fb.group({
      // Clinic ID with default value
      clinicId: [1, Validators.required], 
      // Day of the week for the schedule
      weekDay: ['', Validators.required],
      // Start time of the schedule 
      startTime: ['', Validators.required], 
      // End time of the schedule
      endTime: ['', Validators.required],
      // Status of the schedule (active/inactive) 
      status: [true, Validators.required], 
      // ID of the doctor for whom the schedule is created
      doctorId: [null, Validators.required] 
    });
  }

  ngOnInit() {
    // Load doctors when the component initializes
    this.loadDoctors();
  }
  
  loadDoctors(): void {
    this.isLoading = true; // Set loading state to true
    this.doctorService.getAllDoctors(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Log API response for debugging
        if (response && response.data) {
          // Process the response and map doctor data
          this.doctors = response.data.map((doctor: any) => ({
            ...doctor, // Copy all doctor properties
            city: doctor.doctorAddress ? doctor.doctorAddress.city : '' // Map city from doctorAddress
          }));
  
          // Generate an array of page numbers for pagination
          this.pages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
          console.log(this.doctors);
        } else {
          this.errorMessage = 'No doctor data available.';
        }
        this.isLoading = false; // Set loading state to false
      },
      error: (error) => {
        console.error('API Error:', error); // Log API error for debugging
        this.errorMessage = 'Failed to load doctors.';
        this.isLoading = false; // Set loading state to false
      },
      complete: () => {
        console.log('Doctor data loading complete.'); // Log when data loading is complete
      }
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      // Prepare the schedule data for submission
      const scheduleData: IDoctorSchedule = {
        ...this.scheduleForm.value,
        doctorId: Number(this.scheduleForm.value.doctorId) // Ensure doctorId is a number
      };

      this.doctorScheduleService.createSchedule(this.scheduleForm.value.doctorId, scheduleData).subscribe({
        next: (response) => {
          this.message = 'Schedule created successfully!'; // Set success message
          this.success = true;
          setTimeout(() => {
            this.message = null; // Clear the message after a delay
            this.router.navigate(['/schedule']); // Navigate to the schedule page
          }, 2000);
          // console.log('Schedule created successfully:', response);
        },
        error: (error) => {
          this.message = 'Error occurred while creating the schedule.'; // Set error message
          this.success = false;
          // console.error('Error creating schedule:', error);
        },
        complete: () => {
          // console.log('Request complete.'); // Log when request is complete
          // Handle completion if needed
        }
      });
    }
  }
}

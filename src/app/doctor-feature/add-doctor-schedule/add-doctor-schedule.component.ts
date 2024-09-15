import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDoctorSchedule } from '../../models/Doctors/doctorSchedule.models';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor/doctor.service';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { Router } from '@angular/router';
import { DoctorScheduleService } from '../../services/doctor/doctor-schedule.service';

@Component({
  selector: 'app-add-doctor-schedule',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-doctor-schedule.component.html',
  styleUrl: './add-doctor-schedule.component.css'
})
export class AddDoctorScheduleComponent implements OnInit {
  scheduleForm: FormGroup;
  doctors : IDoctor[] = [];
  totalDoctors: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;  // Adjust page size as needed
  pages: number[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  fallbackimage = 'assets/placeholder-image.jpg';
  status: boolean | null = null;
  message: string | null = null;
  success: boolean = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private doctorScheduleService: DoctorScheduleService,
    private router: Router
  ) {
    // Initialize the form in the constructor
    this.scheduleForm = this.fb.group({
      clinicId: [1, Validators.required],
      weekDay: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: [true, Validators.required],
      doctorId: [null, Validators.required]
    });
  }

  ngOnInit() {
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

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const scheduleData: IDoctorSchedule = {
        ...this.scheduleForm.value,
        doctorId: Number(this.scheduleForm.value.doctorId)
      };

      this.doctorScheduleService.createSchedule(this.scheduleForm.value.doctorId, scheduleData).subscribe({
        next: (response) => {
          this.message = 'Schedule created successfully!';
          this.success = true;
          setTimeout(() => {
            this.message = null;
            this.router.navigate(['/schedule']);
          }, 2000);
          // console.log('Schedule created successfully:', response);
        },
        error: (error) => {
          this.message = 'Error occurred while creating the schedule.';
          this.success = false;
          // console.error('Error creating schedule:', error);
        },
        complete: () => {
          // console.log('Request complete.');
          // Handle completion if needed
        }
      });
    }
  }
}

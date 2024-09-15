import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IDoctor } from "../models/Doctors/doctor.models";
import { DoctorService } from "../services/doctor/doctor.service";
import { DoctorScheduleService } from "../services/doctor-schedule.service";
import { IDoctorSchedule } from "../models/Doctors/doctorSchedule.models";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-edit-doctor-schedule',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-doctor-schedule.component.html',
  styleUrl: './edit-doctor-schedule.component.css'
})

export class EditDoctorScheduleComponent implements OnInit {
  // scheduleForm: FormGroup;
  doctors: IDoctor[] = [];
  totalDoctors: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;  // Adjust page size as needed
  pages: number[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  fallbackimage = 'assets/placeholder-image.jpg';
  status: boolean | null = null;
  doctorScheduleId: number | null = null;

  scheduleForm = new FormGroup({
    clinicId: new FormControl<number | null>(null, [Validators.required]),
    weekDay: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    status: new FormControl<boolean | null>(null, [Validators.required]),
    doctorId: new FormControl<number | null>(null, [Validators.required])
  });

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private doctorScheduleService: DoctorScheduleService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.doctorScheduleId = +id;  
        this.loadDoctorSchedule(this.doctorScheduleId);  
      }
    });

    this.loadDoctors();
  }

  loadDoctorSchedule(id: number): void {
    this.isLoading = true;
    this.doctorScheduleService.getSchedules(id).subscribe({
      next: (response) => {
        console.log('Loaded schedule data:', response);
        if (response) {
          const schedule = response;
  
          // Convert startTime and endTime to HH:mm format
          const formattedStartTime = this.formatTime(schedule.startTime);
          const formattedEndTime = this.formatTime(schedule.endTime);
  
          // Patch the form with the loaded schedule data
          this.scheduleForm.setValue({
            clinicId: schedule.clinicId,
            weekDay: this.capitalizeWeekDay(schedule.weekday), // Convert "MONDAY" to "Monday"
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            status: schedule.status,
            doctorId: schedule.doctorId // Ensure doctorId is patched
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading schedule:', error);
        this.errorMessage = 'Failed to load schedule.';
        this.isLoading = false;
      }
    });
  }
  
  // Utility function to format time in HH:mm format
  private formatTime(time: string): string {
    return time.slice(0, 5); // "10:00:00" becomes "10:00"
  }
  
  // Utility function to capitalize weekday
  private capitalizeWeekDay(weekday: string | undefined): string {
    if (!weekday) {
      return ''; // Return an empty string or handle the case as needed
    }
    return weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase(); // "MONDAY" becomes "Monday"
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
      // Extract values from the form
      const formValues = this.scheduleForm.value;
  
      // Ensure all required fields are properly set
      const scheduleData: IDoctorSchedule = {
        doctorId: Number(formValues.doctorId), // Convert to number
        clinicId: formValues.clinicId !== null && formValues.clinicId !== undefined ? Number(formValues.clinicId) : 0, // Default value 0 if undefined or null
        weekday: formValues.weekDay || '', // Default to empty string if undefined
        startTime: formValues.startTime || '', // Default to empty string if undefined
        endTime: formValues.endTime || '', // Default to empty string if undefined
        status: formValues.status ?? true // Default to true if null or undefined
      };
  
      if (this.doctorScheduleId !== null) {
        this.doctorScheduleService.editSchedule(this.doctorScheduleId, scheduleData).subscribe({
          next: (response) => {
            console.log('Schedule created successfully:', response);
            // Handle success (e.g., redirect or show a success message)
          },
          error: (error) => {
            console.error('Error creating schedule:', error);
            // Handle error (e.g., show an error message)
          },
          complete: () => {
            console.log('Request complete.');
          }
        });
      }
    }
  }
}
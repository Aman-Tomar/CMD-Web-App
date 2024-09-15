import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IDoctor } from "../../models/Doctors/doctor.models";
import { DoctorService } from "../../services/doctor/doctor.service";
import { IDoctorSchedule } from "../../models/Doctors/doctorSchedule.models";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { DoctorScheduleService } from "../../services/doctor/doctor-schedule.service";


@Component({
  selector: 'app-edit-doctor-schedule',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-doctor-schedule.component.html',
  styleUrl: './edit-doctor-schedule.component.css'
})

export class EditDoctorScheduleComponent implements OnInit {
  // scheduleForm: FormGroup;
  isLoading: boolean = false;
  doctors: IDoctor[] = [];
  totalDoctors: number = 0;
  pageNumber: number = 1;
  pageSize: number = 1000;  // Adjust page size as needed
  pages: number[] = [];
  errorMessage: string = '';
  fallbackimage = 'assets/placeholder-image.jpg';
  status: boolean | null = null;
  doctorScheduleId: number | null = null;
  message: string | null = null;
  success: boolean = false;

  scheduleForm = new FormGroup({
    weekDay: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    status: new FormControl<boolean | null>(null, [Validators.required]),
    doctorId: new FormControl<number | null>(null, [Validators.required])
  });

  constructor(
    private doctorService: DoctorService,
    private doctorScheduleService: DoctorScheduleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
    this.doctorScheduleService.getSchedule(id).subscribe({
      next: (response) => {
        // console.log('Loaded schedule data:', response);
        if (response) {
          // Convert startTime and endTime to HH:mm format
          const formattedStartTime = this.formatTime(response.startTime);
          const formattedEndTime = this.formatTime(response.endTime);
  
          // Patch the form with the loaded schedule data
          this.scheduleForm.setValue({
            weekDay: this.capitalizeWeekDay(response.weekday), // Convert "MONDAY" to "Monday"
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            status: response.status,
            doctorId: response.doctorId // Ensure doctorId is patched
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
        // console.log('API Response:', response);
        if (response && response.data) {
          this.doctors = response.data.map((doctor: any) => ({
            ...doctor, // Copy all doctor properties
            city: doctor.doctorAddress ? doctor.doctorAddress.city : '' // Map city from doctorAddress
          }));
          this.pages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
          // console.log(this.doctors);
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
        doctorScheduleId: this.doctorScheduleId ? this.doctorScheduleId : -1,
        doctorId: Number(formValues.doctorId), // Convert to number
        weekday: formValues.weekDay || '', // Default to empty string if undefined
        startTime: formValues.startTime || '', // Default to empty string if undefined
        endTime: formValues.endTime || '', // Default to empty string if undefined
        status: formValues.status ?? true // Default to true if null or undefined
      };
  
      if (this.doctorScheduleId !== null) {
        this.doctorScheduleService.editSchedule(this.doctorScheduleId, scheduleData).subscribe({
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
          }
        });
      }
    }
  }
}
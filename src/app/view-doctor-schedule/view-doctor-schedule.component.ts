import { Component } from '@angular/core';
import { DoctorScheduleService } from '../services/doctor-schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-doctor-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-doctor-schedule.component.html',
  styleUrl: './view-doctor-schedule.component.css'
})
export class ViewDoctorScheduleComponent {
  schedules: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private doctorScheduleService: DoctorScheduleService) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.doctorScheduleService.getSchedules(5).subscribe({
      next: (response) => {
        //this.schedules = response.data; // Access the 'data' array in response
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading schedule:', error);
        this.errorMessage = 'Failed to load schedules.';
        this.isLoading = false;
      }
    });
  }

}

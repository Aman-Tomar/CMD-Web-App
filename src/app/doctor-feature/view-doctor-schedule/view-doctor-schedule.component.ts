import { Component, inject, OnInit } from '@angular/core';
import { forkJoin, map, switchMap } from 'rxjs';
import { IDoctorSchedule, IScheduleResponse } from '../../models/Doctors/doctorSchedule.models';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor/doctor.service';
import { DoctorScheduleService } from '../../services/doctor/doctor-schedule.service';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { IDepartment } from '../../models/Doctors/department.models';

@Component({
  selector: 'app-view-doctor-schedule',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './view-doctor-schedule.component.html',
  styleUrls: ['./view-doctor-schedule.component.css']
})
export class ViewDoctorScheduleComponent implements OnInit {
  // Array to hold doctor schedules with extended details
  doctorSchedules: ExtendedDoctorSchedule[] = [];
  // Properties to hold doctor and department names
  doctorName: string = '';
  departmentName: string = '';
  // Pagination properties
  totalScheduless: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  // Loading and error state
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private doctorScheduleService: DoctorScheduleService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    // Load doctor schedules when the component initializes
    this.loadDoctorSchedule();
  }

  loadDoctorSchedule() {
    this.isLoading = true; // Set loading state to true

    // Fetch doctor schedules with pagination
    this.doctorScheduleService.getAllSchedules(this.pageNumber, this.pageSize).pipe(
      switchMap((response: IScheduleResponse) => {
        if (response && response.data && response.data.length > 0) {
          // Create an observable for each doctor's details
          const doctorObservables = response.data.map(schedule =>
            this.doctorService.getDoctorById(schedule.doctorId).pipe(
              switchMap((doctorDetails: IDoctor) =>
                this.doctorScheduleService.getDepartmentNameById(doctorDetails.departmentId).pipe(
                  map((departmentName: string | undefined) => {
                    // Extend schedule with doctor and department details
                    return {
                      ...schedule,
                      doctorFirstName: doctorDetails.firstName,
                      doctorLastName: doctorDetails.lastName,
                      departmentName: departmentName ?? 'Unknown'
                    };
                  })
                )
              )
            )
          );

          // Combine all observables and update component properties
          return forkJoin(doctorObservables).pipe(
            map((schedulesWithDetails) => {
              this.pageNumber = response.page;
              this.pageSize = response.pageSize;
              this.totalScheduless = response.totalItems;
              this.pages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
              return schedulesWithDetails;
            })
          );
        } else {
          this.errorMessage = 'No doctor schedule data available.';
          this.isLoading = false;
          return []; // Return an empty array if no data is available
        }
      })
    ).subscribe({
      next: (schedulesWithDetails: any[]) => {
        // Update component with fetched schedules
        this.doctorSchedules = schedulesWithDetails;
        this.isLoading = false; // Set loading state to false
      },
      error: (error) => {
        // Handle errors during data fetch
        console.error('Error fetching doctor schedules:', error);
        this.errorMessage = 'Failed to load doctor schedules.';
        this.isLoading = false; // Set loading state to false
      },
      complete: () => {
        // Log completion of data load
        console.log('Doctor schedules loaded.');
      }
    });
  }

  // Method to handle page change
  changePage(page: number): void {
    if (page !== this.pageNumber) {
      this.pageNumber = page;
      this.loadDoctorSchedule(); // Reload schedules for the new page
    }
  }

  // Method to handle page size change
  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = +selectElement.value; // Update page size
    this.pageNumber = 1; // Reset to the first page
    this.loadDoctorSchedule(); // Reload schedules with new page size
  }

  // Method to get display range of the current page
  getDisplayRange(): string {
    const start = (this.pageNumber - 1) * this.pageSize + 1;
    const end = Math.min(this.pageNumber * this.pageSize, this.totalScheduless);
    return `Showing ${start} to ${end} of ${this.totalScheduless} entries`;
  }
}

// Interface to extend IDoctorSchedule with additional details
interface ExtendedDoctorSchedule extends IDoctorSchedule {
  doctorFirstName?: string;
  doctorLastName?: string;
  departmentName?: IDepartment;
}

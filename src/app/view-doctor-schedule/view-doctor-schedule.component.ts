import { Component, inject, OnInit } from '@angular/core';
import { IDoctorSchedule } from '../models/Doctors/doctorSchedule.models';
import { DoctorScheduleService } from '../services/doctor/doctor-schedule.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../services/doctor/doctor.service';


@Component({
  selector: 'app-view-doctor-schedule',
  standalone: true,
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './view-doctor-schedule.component.html',
  styleUrl: './view-doctor-schedule.component.css'
})
export class ViewDoctorScheduleComponent implements OnInit{

  // doctorScheduleService:DoctorScheduleService = inject(DoctorScheduleService);
  // doctorSchedules: IDoctorSchedule[] = [];
  // totalScheduless: number = 0;
  // pageNumber: number = 1;
  // pageSize: number = 10;  
  // pages: number[] = [];
  // isLoading: boolean = false;
  // errorMessage: string = '';

  // ngOnInit(): void {
  //   this.loadDoctorSchedule();
  // }

  // loadDoctorSchedule() {
  //   this.isLoading = true;
  //   this.doctorScheduleService.getDoctorSchedule(this.pageNumber, this.pageSize).subscribe({
  //     next: (response) => {
  //       if (response && response.data) {
  //         // Create an array of doctorSchedules to populate later
  //         this.doctorSchedules = [];
  
  //         // Process each schedule
  //         response.data.forEach((schedule: any) => {
  //           // Fetch the department name asynchronously for each schedule
  //           this.doctorScheduleService.getDepartmentNameById(schedule.doctor.departmentId).subscribe((departmentName) => {
  //             this.doctorSchedules.push({
  //               ...schedule,
  //               doctorFirstName: schedule.doctor.firstName,
  //               doctorLastName: schedule.doctor.lastName,
  //               departmentName: departmentName || 'Unknown' 
  //             });
  //           });
  //         });
  //         this.pages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
  //         console.log(this.doctorSchedules);
  //       } else {
  //         this.errorMessage = 'No doctor schedule data available.';
  //       }
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('API Error:', error);
  //       this.errorMessage = 'Failed to load doctors.';
  //       this.isLoading = false;
  //     },
  //     complete: () => {
  //       console.log('Doctor data loading complete.');
  //     }

  //   });
  // }

  // changePage(page: number): void {
  //   if (page !== this.pageNumber) {
  //     console.log(`Changing page from ${this.pageNumber} to ${page}`);
  //     this.pageNumber = page;
  //     this.loadDoctorSchedule();
  //   }
  // }
  // onPageSizeChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   this.pageSize = +selectElement.value; 
  //   this.pageNumber = 1; 
  //   this.loadDoctorSchedule(); 
  // }
  // getDisplayRange(): string {
  //   const start = (this.pageNumber - 1) * this.pageSize + 1;
  //   const end = Math.min(this.pageNumber * this.pageSize, this.totalScheduless);
  //   return `Showing ${start} to ${end} of ${this.totalScheduless} entries`;
  // }

  doctorScheduleService: DoctorScheduleService = inject(DoctorScheduleService);
  doctorService:DoctorService = inject(DoctorService);
  doctorSchedules: IDoctorSchedule[] = [];
  doctorName:string='';
  departmentName:string='';
  totalScheduless: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadDoctorSchedule();
  }

  loadDoctorSchedule() {
    this.isLoading = true;
    this.doctorScheduleService.getDoctorSchedule(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Reset doctorSchedules array
          this.doctorSchedules = [];
          
          // Process each schedule
          response.data.forEach((schedule: any) => {
            // Fetch doctor details by doctorId
            this.doctorService.getDoctorById(schedule.doctorId).subscribe((doctorDetails: any) => {
              const { firstName, lastName, departmentId } = doctorDetails;
  
              // Update the doctorName variable
              this.doctorName = `${firstName} ${lastName}`;
              
              // Fetch the department name by departmentId
              this.doctorScheduleService.getDepartmentNameById(departmentId).subscribe((departmentName) => {
                // Update the departmentName variable
                this.departmentName = departmentName || 'Unknown';
  
                // Push the fully populated schedule to the array
                this.doctorSchedules.push({
                  ...schedule,
                  doctorFirstName: firstName,
                  doctorLastName: lastName,
                  departmentName: this.departmentName
                });
              });
            });
          });
  
          this.pages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        } else {
          this.errorMessage = 'No doctor schedule data available.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Failed to load doctor schedules.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Doctor schedules loaded.');
      }
    });
  }
  
  changePage(page: number): void {
    if (page !== this.pageNumber) {
      this.pageNumber = page;
      this.loadDoctorSchedule();
    }
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = +selectElement.value;
    this.pageNumber = 1; // Reset to first page
    this.loadDoctorSchedule();
  }

  getDisplayRange(): string {
    const start = (this.pageNumber - 1) * this.pageSize + 1;
    const end = Math.min(this.pageNumber * this.pageSize, this.totalScheduless);
    return `Showing ${start} to ${end} of ${this.totalScheduless} entries`;
  }
  
}

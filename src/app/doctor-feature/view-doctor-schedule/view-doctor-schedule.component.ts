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
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './view-doctor-schedule.component.html',
  styleUrl: './view-doctor-schedule.component.css'
})
export class ViewDoctorScheduleComponent implements OnInit{
  doctorSchedules: ExtendedDoctorSchedule[] = [];
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
  constructor(
    private doctorScheduleService: DoctorScheduleService,
    private doctorService:DoctorService
  ) {}


  loadDoctorSchedule() {
    this.isLoading = true;
  
    this.doctorScheduleService.getAllSchedules(this.pageNumber, this.pageSize).pipe(
      switchMap((response: IScheduleResponse) => {
        if (response && response.data && response.data.length > 0) {
          const doctorObservables = response.data.map(schedule =>
            this.doctorService.getDoctorById(schedule.doctorId).pipe(
              switchMap((doctorDetails: IDoctor) =>
                this.doctorScheduleService.getDepartmentNameById(doctorDetails.departmentId).pipe(
                  map((departmentName: string | undefined) => {
                    console.log('Doctor details:', doctorDetails); // Debugging
                    console.log('Department name:', departmentName); // Debugging
                    
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
  
          return forkJoin(doctorObservables).pipe(
            map((schedulesWithDetails) => {
              console.log('Schedules with details:', schedulesWithDetails);
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
          return [];
        }
      })
    ).subscribe({
      next: (schedulesWithDetails: any[]) => {
        this.doctorSchedules = schedulesWithDetails;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching doctor schedules:', error);
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







interface ExtendedDoctorSchedule extends IDoctorSchedule {
  doctorFirstName?: string;
  doctorLastName?: string;
  departmentName?: IDepartment;
}
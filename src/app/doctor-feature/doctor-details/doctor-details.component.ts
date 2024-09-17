import { Component, inject, OnInit } from '@angular/core';
import { IDoctor } from '../../models/Doctors/doctor.models';
import { DoctorService } from '../../services/doctor/doctor.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { state } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { IDepartment } from '../../models/Doctors/department.models';
import { IClinic } from '../../models/Doctors/clinic.model';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [DatePipe,RouterLink],
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css'] // Note: Corrected 'styleUrl' to 'styleUrls'
})
export class DoctorDetailsComponent implements OnInit {

    // Injecting necessary services like DoctorService and ActivatedRoute for data fetching and routing
    doctorService: DoctorService = inject(DoctorService);
    route: ActivatedRoute = inject(ActivatedRoute);
    router:Router=inject(Router);

    // Property to hold the doctor ID from the route parameters
    doctorId: number = 0;

    // Variables to hold the doctor and address details
    doctor: IDoctor | undefined;
    department:IDepartment | undefined;
    clinic:IClinic | undefined;

    // Placeholder image to be used if the doctor's profile picture is not available
    fallbackimage = 'assets/placeholder-image.jpg';
    
    /**
     * Angular lifecycle hook that is called after the component is initialized.
     * It subscribes to the route parameters to fetch the doctor ID and then retrieves doctor details.
     */
    ngOnInit(): void {
      // Subscribe to the route parameters to extract the doctor ID from the URL
      this.route.paramMap.subscribe(data => {
        // Convert the doctor ID from string to a number
        this.doctorId = Number(data.get('id'));
        console.log("Received doctor ID is " + this.doctorId);

        // Fetch doctor details based on the received doctor ID
        this.getDoctorById(this.doctorId);
      });
    }

    /**
     * Fetches the details of a doctor by their ID.
     * Calls the DoctorService to retrieve the doctor information from the backend.
     * @param doctorId - The ID of the doctor to fetch details for.
     */
    getDoctorById(doctorId: number) {
       this.doctorService.getDoctorById(doctorId).subscribe({
        next: (doctor) => {
          // Success callback: Assigns the retrieved doctor data to the component's doctor variable
          this.doctor = doctor;
          if (this.doctor?.departmentId) {
            // Fetch the department name after fetching the doctor details
            this.getDepartmentName(this.doctor.departmentId);
          }
          if (this.doctor?.clinicId) {
            this.getClinicName(this.doctor.clinicId);
          }
        },
        error: (error) => {
          // Error callback: Logs the error in case of a failure in fetching doctor details
          console.error("Error fetching doctor", error);
        }
       });
    }

    getDepartmentName(departmentId: number) {
      this.doctorService.getDepartmentById(departmentId).subscribe({
        next: (department) => {
          // Assign the department name to the component's property
          this.department = department;
        },
        error: (error) => {
          console.error("Error fetching department", error);
        }
      });
    }

    getClinicName(clinicId: number) {
      this.doctorService.getClinicById(clinicId).subscribe({
        next: (c) => {
          // Map the received data to clinicId and clinicName
          this.clinic = {
            clinicId: c.id,      // Map 'id' to 'clinicId'
            clinicName: c.name   // Map 'name' to 'clinicName'
          };
        },
        error: (error) => {
          console.error("Error fetching clinic", error);
        }
      });
    }
    

    getProfilePicture(): string {
      return this.doctor?.profilePicture || this.fallbackimage;
    }

    goBack() {
      this.router.navigate(['/doctor']);
    }
    
}

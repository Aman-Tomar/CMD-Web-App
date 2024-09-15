import { Component, inject, OnInit } from '@angular/core';
import { IDoctor } from '../models/Doctors/doctor.models';
import { DoctorService } from '../services/doctor/doctor.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-doctor',
  standalone: true,
  imports: [CommonModule,FormsModule,NgIf,RouterLink],
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit {

  // Array to hold the list of doctors fetched from the API
  doctors: IDoctor[] = [];

  // Total number of doctors available (for pagination)
  totalDoctors: number = 0;

  // Current page number in the pagination
  pageNumber: number = 1;

  // Number of doctors to display per page
  pageSize: number = 10;  
  
  // Array to hold the page numbers for pagination
  pages: number[] = [];

  // Flag to show whether the data is being loaded
  isLoading: boolean = false;

  // Message to show if there's an error during data loading
  errorMessage: string = '';

  // Placeholder image for doctors without a profile picture
  fallbackimage = 'assets/placeholder-image.jpg';

  // Holds the ID of the doctor whose dropdown menu is currently toggled
  currentDoctorId: number | null = null;

  // Inject the DoctorService to fetch doctor data from the backend
  constructor(private doctorService: DoctorService) {}

  // Lifecycle hook that is called when the component is initialized
  ngOnInit(): void {
    // Load the initial list of doctors when the component is initialized
    this.loadDoctors();
  }

  // Fetches the list of doctors from the server
  loadDoctors(): void {
    this.isLoading = true; // Set loading flag to true while fetching data
    this.doctorService.getAllDoctors(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        // Log the API response to ensure the data structure is correct
        console.log('API Response:', response); 
        
        if (response && response.data) {
          // Set the total number of doctors from the response
          this.totalDoctors = response.totalItems;
          
          // Map the doctor data from the response, setting the city from the address object
          this.doctors = response.data.map((doctor: any) => ({
            ...doctor, // Copy all doctor properties
            city: doctor.doctorAddress ? doctor.doctorAddress.city : '' // Set city from doctorAddress if available
          }));
  
          // Generate the pagination array based on the total number of pages
          this.pages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
          
          // Log the doctor data for debugging
          console.log(this.doctors);
        } else {
          // If the response has no data, set an error message
          this.errorMessage = 'No doctor data available.';
        }

        // Set loading flag to false when data loading is complete
        this.isLoading = false;
      },
      error: (error) => {
        // Log any errors that occur during the API request
        console.error('API Error:', error);
        
        // Set an error message if the request fails
        this.errorMessage = 'Failed to load doctors.';
        
        // Set loading flag to false when the error occurs
        this.isLoading = false;
      },
      complete: () => {
        // Log a message when the data loading is complete
        console.log('Doctor data loading complete.');
      }
    });
  }

  // Handles the page change when a user clicks a pagination button
  changePage(page: number): void {
    if (page !== this.pageNumber) {
      // Log the page change action for debugging
      console.log(`Changing page from ${this.pageNumber} to ${page}`);
      
      // Update the current page number
      this.pageNumber = page;
      
      // Reload the doctors for the new page
      this.loadDoctors();
    }
  }

  // Handles the change in page size when the user selects a different option from the dropdown
  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    
    // Update the page size based on the user's selection
    this.pageSize = +selectElement.value;
    
    // Reset to the first page whenever the page size changes
    this.pageNumber = 1;
    
    // Reload the doctors with the new page size
    this.loadDoctors();
  }

  // Displays the range of doctors currently being shown (e.g., "Showing 1-10 of 50 entries")
  getDisplayRange(): string {
    const start = (this.pageNumber - 1) * this.pageSize + 1; // Calculate the starting entry number
    const end = Math.min(this.pageNumber * this.pageSize, this.totalDoctors); // Calculate the ending entry number
    return `Showing ${start} to ${end} of ${this.totalDoctors} entries`; // Return the formatted range string
  }

  // Toggles the dropdown menu for the selected doctor
  toggleMenu(id: number) {    
    // Set the current doctor ID to toggle the menu, or null to close it if the same ID is selected
    this.currentDoctorId = this.currentDoctorId === id ? null : id;   
  }

}

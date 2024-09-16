import { CommonModule } from '@angular/common';
import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Patient } from '../../models/Patients/patient.model';
import { PatientService } from '../../services/patient/patient.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { PatientCardComponent } from '../patient-card/patient-card.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PatientCardComponent ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
  animations: [
    trigger('fadeInOut', [
      // Define enter animation for fade-in effect
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
       // Define leave animation for fade-out effect
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class PatientListComponent implements OnInit, AfterViewInit{

  [x: string]: any;
  // Array to store list of patients
  patients: Patient[] = [];
  
  math=Math;

  // Variables for pagination
  totalPatients: number = 0;
  currentPage: number = 1;
  pageSize: number = 20;

  // Variable to hold the currently selected patient
  selectedPatient: Patient | null = null;

   // Variables for sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private patientService: PatientService) { }


  ngOnInit(): void {
    this.loadPatients(); // Load initial list of patients
  }

  // Method to load patients based on current page and page size
  loadPatients(): void {
    this.patientService.getPatients(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          // Set the patients and total patient count from API response
          this.patients = response.items;
          this.totalPatients = response.totalCountOfPatients;
        },
        error: (error: any) => {
          console.error('Error loading patients:', error);
        }
      });
  }

  // Method called when the page number is changed in the pagination control
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber; // Update the current page
    this.loadPatients(); // Reload the patients based on the new page
  }

  // Method to select a patient or deselect if already selected
  selectPatient(patient: Patient): void {
    this.selectedPatient = this.selectedPatient === patient ? null : patient;
  }

  // Method to sort the patients by a specific column
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      // If already sorting by the same column, toggle the direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Otherwise, set the new sort column and reset direction to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Get value from patient object dynamically
    this.patients.sort((a, b) => {
      const valueA = (a as any)[column]; // Get value from patient object dynamically
      const valueB = (b as any)[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Method to get the icon for indicating sort direction in the UI
  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '-up' : '-down';
    }
    return '';
  }

  // Reference to the table element for column resizing functionality
  @ViewChild('resizableTable') resizableTable!: ElementRef;

  // Lifecycle hook called after the view has been initialized
  ngAfterViewInit(): void {
    this.setupColumnResize();
  }

  // Method to set up column resizing by attaching event handlers
  setupColumnResize() {
    const table = this.resizableTable.nativeElement;
    const rows = table.getElementsByTagName('tr');
    const cols = rows[0].children;

    for (let i = 0; i < cols.length; i++) {
      const div = cols[i].querySelector('.resize-handle');
      if (div) {
        this.createResizableColumn(cols[i], div);
      }
    }
  }

  // Method to make a column resizable by mouse dragging
  createResizableColumn(col: HTMLElement, resizer: HTMLElement) {
    let x = 0;
    let w = 0;

    // Mouse down event handler to start resizing
    const mouseDownHandler = (e: MouseEvent) => {
      x = e.clientX;
      const styles = window.getComputedStyle(col);
      w = parseInt(styles.width, 10);

      // Attach event handlers for mouse move and mouse up
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    // Mouse move event handler to resize the column as the mouse is dragged
    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - x;
      col.style.width = `${w + dx}px`;
    };

    // Mouse up event handler to stop resizing
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
  } 
}

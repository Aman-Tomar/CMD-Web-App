import { CommonModule } from '@angular/common';
import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Patient } from '../../models/patient.model';
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
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class PatientListComponent implements OnInit, AfterViewInit{

  [x: string]: any;
  patients: Patient[] = [];
  math=Math;
  totalPatients: number = 0;
  currentPage: number = 1;
  pageSize: number = 20;
  selectedPatient: Patient | null = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private patientService: PatientService) { }


  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.patients = response.items;
          this.totalPatients = response.totalCountOfPatients;
        },
        error: (error: any) => {
          console.error('Error loading patients:', error);
        }
      });
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadPatients();
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = this.selectedPatient === patient ? null : patient;
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.patients.sort((a, b) => {
      const valueA = (a as any)[column];
      const valueB = (b as any)[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '-up' : '-down';
    }
    return '';
  }

  @ViewChild('resizableTable') resizableTable!: ElementRef;

  ngAfterViewInit(): void {
    this.setupColumnResize();
  }

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
  createResizableColumn(col: HTMLElement, resizer: HTMLElement) {
    let x = 0;
    let w = 0;

    const mouseDownHandler = (e: MouseEvent) => {
      x = e.clientX;
      const styles = window.getComputedStyle(col);
      w = parseInt(styles.width, 10);
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - x;
      col.style.width = `${w + dx}px`;
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
  } 
}

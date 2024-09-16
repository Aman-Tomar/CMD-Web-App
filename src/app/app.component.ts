import { Component, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgClass } from '@angular/common';
import { SidebarService } from './sidebar.service';
import { PatientListComponent } from './patient_feature/patient-list/patient-list.component';
import { PatientDetailComponent } from './patient_feature/patient-detail/patient-detail.component';
import { PatientFormComponent } from './patient_feature/patient-form/patient-form.component';
import { PatientCardComponent } from './patient_feature/patient-card/patient-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass,RouterOutlet,NavbarComponent,SidebarComponent,PatientListComponent,PatientDetailComponent, PatientFormComponent, PatientCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None 
})
export class AppComponent implements OnInit {
  title = 'cmd-ui-app';

  isSidebarOpen: boolean = true;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarState$.subscribe(state => {
      this.isSidebarOpen = state;
    });
}

@HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Check if the click happened inside the sidebar or navbar (ignore those clicks)
    const clickedInsideSidebar = target.closest('.sidebar-container') || target.closest('nav');
    if (this.isSidebarOpen && !clickedInsideSidebar) {
      this.sidebarService.toggleSidebar();  // Close sidebar if open
    }
  }
}

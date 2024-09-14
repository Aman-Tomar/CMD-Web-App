import { Routes } from '@angular/router';
import { PatientDetailComponent } from './patient_feature/patient-detail/patient-detail.component';
import { PatientFormComponent } from './patient_feature/patient-form/patient-form.component';
import { PatientListComponent } from './patient_feature/patient-list/patient-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/patients', pathMatch: 'full' },
    { path: 'patients', component: PatientListComponent },
    { path: 'patients/new', component: PatientFormComponent },
    { path: 'patients/:id', component: PatientDetailComponent },
    { path: 'patients/:id/edit', component: PatientFormComponent },

];

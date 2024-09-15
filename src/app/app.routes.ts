import { Routes } from '@angular/router';
import { ViewDoctorComponent } from './doctor-feature/view-doctor/view-doctor.component';
import { AddDoctorComponent } from './doctor-feature/add-doctor/add-doctor.component';
import { EditDoctorComponent } from './doctor-feature/edit-doctor/edit-doctor.component';
import { ViewDoctorScheduleComponent } from './doctor-feature/view-doctor-schedule/view-doctor-schedule.component';
import { EditDoctorScheduleComponent } from './doctor-feature/edit-doctor-schedule/edit-doctor-schedule.component';
import { AddDoctorScheduleComponent } from './doctor-feature/add-doctor-schedule/add-doctor-schedule.component';
import { DoctorDetailsComponent } from './doctor-feature/doctor-details/doctor-details.component';

export const routes: Routes = [
    {path:'doctor',component:ViewDoctorComponent,title:'doctors'},
    {path:'doctor/add',component:AddDoctorComponent,title:'add doctor'},
    {path:'doctor/edit/:id',component:EditDoctorComponent,title:'edit doctor'},
    {path:'schedule',component:ViewDoctorScheduleComponent,title:'doctor schedule'},
    {path:'schedule/edit/:id',component:EditDoctorScheduleComponent,title:'edit schedule'},
    {path:'schedule/add',component:AddDoctorScheduleComponent,title:'add schedule'},
    {path:'doctor/:id',component:DoctorDetailsComponent,title:'doctor details'}
];

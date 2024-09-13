import { Routes } from '@angular/router';
import { ViewDoctorComponent } from './view-doctor/view-doctor.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import { ViewDoctorScheduleComponent } from './view-doctor-schedule/view-doctor-schedule.component';
import { EditDoctorScheduleComponent } from './edit-doctor-schedule/edit-doctor-schedule.component';
import { AddDoctorScheduleComponent } from './add-doctor-schedule/add-doctor-schedule.component';

export const routes: Routes = [
    
];
export const routes: Routes = [
    {path:'doctor',component:ViewDoctorComponent,title:'doctors'},
    {path:'doctor/add',component:AddDoctorComponent,title:'add doctor'},
    {path:'doctor/edit',component:EditDoctorComponent,title:'edit doctor'},
    {path:'view-schedule',component:ViewDoctorScheduleComponent,title:'doctor schedule'},
    {path:'view-schedule/edit',component:EditDoctorScheduleComponent,title:'edit schedule'},
    {path:'view-schedule/add',component:AddDoctorScheduleComponent,title:'add schedule'},
];

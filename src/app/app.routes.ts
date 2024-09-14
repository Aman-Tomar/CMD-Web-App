import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentListComponent } from './appointment_feature/appointment-list/appointment-list.component';
import { AddAppointmentComponent } from './appointment_feature/add-appointment/add-appointment.component';
import { AppointmentFilterComponent } from './appointment-filter-status/appointment-filter-status.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'appointments',component:AppointmentListComponent,title:"All appointments"},
    {path:'appointments/add',component:AddAppointmentComponent,title:"Add appointment"},
    {path:'appointments/filterbystatus',component:AppointmentFilterComponent,title:"filter by status"}
   
];

import { Routes } from '@angular/router';
import { PatientDetailComponent } from './patient_feature/patient-detail/patient-detail.component';
import { PatientFormComponent } from './patient_feature/patient-form/patient-form.component';
import { PatientListComponent } from './patient_feature/patient-list/patient-list.component';
import { ViewDoctorComponent } from './doctor-feature/view-doctor/view-doctor.component';
import { AddDoctorComponent } from './doctor-feature/add-doctor/add-doctor.component';
import { EditDoctorComponent } from './doctor-feature/edit-doctor/edit-doctor.component';
import { ViewDoctorScheduleComponent } from './doctor-feature/view-doctor-schedule/view-doctor-schedule.component';
import { EditDoctorScheduleComponent } from './doctor-feature/edit-doctor-schedule/edit-doctor-schedule.component';
import { AddDoctorScheduleComponent } from './doctor-feature/add-doctor-schedule/add-doctor-schedule.component';
import { DoctorDetailsComponent } from './doctor-feature/doctor-details/doctor-details.component';
import { HomeComponent } from './home/home.component';
import { AppointmentListComponent } from './appointment_feature/appointment-list/appointment-list.component';
import { AddAppointmentComponent } from './appointment_feature/add-appointment/add-appointment.component';
import { EditAppointmentComponent } from './appointment_feature/edit-appointment/edit-appointment.component';
import { AppointmentDetailsComponent } from './appointment_feature/appointment-details/appointment-details.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component:HomeComponent,title:"Connect my Doc" },
    { path: 'patients', component: PatientListComponent,title:"Patients" },
    { path: 'patients/new', component: PatientFormComponent,title:"Add patient" },
    { path: 'patients/:id', component: PatientDetailComponent,title:"Patient Details" },
    { path: 'patients/:id/edit', component: PatientFormComponent,title:"Edit patient details" },

    
    {path:'doctor',component:ViewDoctorComponent,title:'Doctors'},
    {path:'doctor/add',component:AddDoctorComponent,title:'Add doctor'},
    {path:'doctor/edit/:id',component:EditDoctorComponent,title:'Edit doctor'},
    {path:'schedule',component:ViewDoctorScheduleComponent,title:'Doctor schedule'},
    {path:'schedule/edit/:id',component:EditDoctorScheduleComponent,title:'Edit schedule'},
    {path:'schedule/add',component:AddDoctorScheduleComponent,title:'Add schedule'},
    {path:'doctor/:id',component:DoctorDetailsComponent,title:'Doctor details'},
    {path:'appointments',component:AppointmentListComponent,title:"Appointments"},
    {path:'appointments/add',component:AddAppointmentComponent,title:"Add appointment"},
    {path:'appointments/:id',component:AppointmentDetailsComponent,title:"View Appointment"},
    {path:'appointments/edit/:id', component:EditAppointmentComponent,title:"Edit Appointment" },

    {path:'login',component:LoginComponent,title:"Login"}
];

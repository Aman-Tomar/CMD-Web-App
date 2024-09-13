import { Component, inject, OnInit } from '@angular/core';
import { IDoctor } from '../models/Doctors/doctor.models';
import { DoctorService } from '../services/doctor/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-doctor',
  standalone: true,
  imports: [],
  templateUrl: './view-doctor.component.html',
  styleUrl: './view-doctor.component.css'
})
export class ViewDoctorComponent implements OnInit{

    // doctorService:DoctorService = inject(DoctorService);
    // router:Router = inject(Router);
       ngOnInit(): void {
    //   this.loadDoctor();
      }
    // doctors:IDoctor[] =[];

    // loadDoctor(){
    //   this.doctorService.getDoctors().subscribe({ 
    //     next:(doctor)=>{
    //       this.doctors = doctor; 
    //       console.log(doctor);
    //     },
    //     error:(error)=>{
    //       console.log(error);
    //     }
    //   });
    // }
 
}

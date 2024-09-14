import { Component, inject, OnInit } from '@angular/core';
import { IDoctor } from '../models/Doctors/doctor.models';
import { DoctorService } from '../services/doctor/doctor.service';
import { ActivatedRoute } from '@angular/router';
import { IAddress } from '../models/Doctors/address.models';
import { state } from '@angular/animations';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.css'
})
export class DoctorDetailsComponent implements OnInit{
    ngOnInit(): void {
      this.route.paramMap.subscribe(data =>{
        this.doctorId = Number(data.get('id'));
        console.log("received doctor id is " + this.doctorId);
        this.getDoctorById(this.doctorId);
      })
    }
    doctorService:DoctorService = inject(DoctorService);
    route:ActivatedRoute = inject(ActivatedRoute);
    doctorId:number = 0 ;
    doctor:IDoctor | undefined;
    doctorAddress:IAddress | undefined;
    
    getDoctorById(doctorId:number){
       this.doctorService.getDoctorById(doctorId).subscribe({
        next:(doctor)=>{
          console.log(doctor);
          this.doctor = doctor;
        },
        error:(error)=>{
          console.log("Error fetching doctor",error)
        }
       });
    }
    
}

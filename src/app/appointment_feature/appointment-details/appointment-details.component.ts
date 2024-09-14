import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { IAppointment } from '../../models/Appointment/Appointment';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [NgClass,RouterLink],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css'
})
export class AppointmentDetailsComponent {
  route:ActivatedRoute=inject(ActivatedRoute);
  service:AppointmentService=inject(AppointmentService);
  router:Router=inject(Router);
  
  Appointment:IAppointment|undefined;
  ngOnInit(): void {
   this.route.paramMap.subscribe(param=>{
    const id=Number(param.get('id'));
    if(id)
    {
      this.service.getAppointmentById(id).subscribe({
        next:(data)=>this.Appointment=data,
        error:(err)=>console.log(err)
      })
    }
   })
  }

  goBack()
{
this.router.navigate(['appointments']);
}

cancelAppointment()
{

}
}

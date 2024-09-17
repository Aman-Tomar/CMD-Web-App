import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { Patient } from '../../models/Appointment/Patient';
import { IDoctor } from '../../models/Appointment/Doctor';
import { IAppointment } from '../../models/Appointment/Appointment';
import { AppointmentStatus } from '../../models/Appointment/AppointmentStatus';
import { IAppointmentDTO } from '../../models/Appointment/EditAppointmentDTO';
import { dateRangeValidator, timeNotInPastValidator } from '../../Validators/AppointmentCustomValidator';
import { DoctorResponse } from '../../models/Appointment/DoctorResponse';
import { PatientResponse } from '../../models/Appointment/PatientResponse';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, FormsModule,RouterLink],
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.css']
})
export class EditAppointmentComponent implements OnInit {
  appointmentService = inject(AppointmentService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  AppointmentStatus = AppointmentStatus;
  errorMessage: string = '';
  successMessage: string = '';
  appointmentId!: number;
  formattedAppontmentId:string='loading...';
  appointment!: IAppointment;
  patients: Patient[]=[];
  doctors: IDoctor[]=[];
  purposeOfVisit: any[] = [];
  updatedAppointment: IAppointmentDTO = {} as IAppointmentDTO;

  reactiveForm = new FormGroup({
    patient: new FormControl('', [Validators.required]),
    doctor: new FormControl('', [Validators.required]),
    purposeOfVisit: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^(\+91|91)?[6-9][0-9]{9}$/)]),
    date: new FormControl('', [Validators.required, dateRangeValidator()]),
    time: new FormControl('', [Validators.required,timeNotInPastValidator('date')]),
    message: new FormControl('', [Validators.required,Validators.maxLength(150)]),
    status:new FormControl('',[Validators.required])
  });

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadPurposeOfVisit();
    
    this.route.paramMap.subscribe(param => {
      this.appointmentId = Number(param.get('id'));
      if (this.appointmentId) {
        this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
          next: data => {
            this.appointment = data;
            this.formattedAppontmentId=this.formatAppointmentId(this.appointmentId);
            this.reactiveForm.patchValue({
              patient: String(this.appointment.patientId),
              doctor:String(this.appointment.doctorId),
              purposeOfVisit: this.appointment.purposeOfVisit,
              email: this.appointment.email,
              phone: this.appointment.phone,
              date: this.appointment.date,
              time: (this.appointment.time).slice(0,5),
              message: this.appointment.message,
              status:this.getStatusLabel(this.appointment.status)
            });
          },
          error: err => console.log(err)
        });
      }
    });
  }

  get Patient() { return this.reactiveForm.get("patient"); }
  get Doctor() { return this.reactiveForm.get("doctor"); }
  get PurposeOfVisit() { return this.reactiveForm.get("purposeOfVisit"); }
  get Email() { return this.reactiveForm.get("email"); }
  get PhoneNumber() { return this.reactiveForm.get("phone"); }
  get Date() { return this.reactiveForm.get("date"); }
  get Time() { return this.reactiveForm.get("time"); }
  get Message() { return this.reactiveForm.get("message"); }

  onSubmit(): void {
    console.log('Form Value:', this.reactiveForm.value);
    this.mapFormToAppointment();
    console.log('Updated Appointment:', this.updatedAppointment);

    if (this.reactiveForm.valid) {
      const appointmentId = this.appointmentId;
      this.appointmentService.updateAppointment(this.updatedAppointment, appointmentId).subscribe({
        next: data => {
          console.log('Appointment edited successfully', data);
          this.successMessage = 'Appointment Updated Successfully';
          this.reactiveForm.reset();
        },
        error: error => {
          this.errorMessage = 'Error! Appointment Could Not Be Edited';
          console.error('Error editing appointment', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  loadPatients(): void {
    this.appointmentService.getPatients().subscribe({
      next: (data: PatientResponse) => {
        this.patients = data.items;
        console.log(data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }

  loadDoctors(): void {
    console.log("Doctors loading");
    this.appointmentService.getDoctors().subscribe({
      next: (data: DoctorResponse) => {
        this.doctors = data.data;
        console.log("doctors:"+data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }
  loadPurposeOfVisit():void{
    this.appointmentService.getPurposeOfVisit().subscribe({
      next: (data: any) => {
        this.purposeOfVisit = data;
        console.log("purposeOfvisit:"+data)
      } ,
      error: (err: string) => {this.errorMessage=err;console.log(this.errorMessage)}
    });
  }

  // Method to format appointment ID
  formatAppointmentId(id: number): string {
    return `APT${id.toString().padStart(4, '0')}`;
  }
  formatPatientId(id: number): string {
    return `PAT${id.toString().padStart(4, '0')}`;
  }
  formatDoctortId(id: number): string {
    return `DOC${id.toString().padStart(4, '0')}`;
  }

  getStatusLabel(status: AppointmentStatus): string {
    if (status === AppointmentStatus.Scheduled) {
      return 'active';
    } else {
      return 'inactive';
    }
  }

  private mapFormToAppointment(): void {
    const formValues = this.reactiveForm.value;
    
    this.updatedAppointment = {
      PurposeOfvisit: String(formValues.purposeOfVisit),
      Date: String(formValues.date),
      Time: `${String(formValues.time)}:00`,
      Email: String(formValues.email),
      Phone: String(formValues.phone),
      Message: String(formValues.message),
      LastModifiedBy:"admin",
      PatientId:Number(formValues.patient),
      DoctorId:Number(formValues.doctor),
      Status: formValues.status === 'active' ? AppointmentStatus.Scheduled : AppointmentStatus.Cancelled
    };
    console.log(this.updatedAppointment);
  }
}

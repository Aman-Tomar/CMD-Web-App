import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppointmentService } from '../../services/appointmnent/appointment.service';
import { Patient } from '../../models/Appointment/Patient';
import { IDoctor } from '../../models/Appointment/Doctor';
import { IAppointment } from '../../models/Appointment/Appointment';
import { AppointmentStatus } from '../../models/Appointment/AppointmentStatus';
import { IAppointmentDTO } from '../../models/Appointment/AppointmentDTO';
import { lastValueFrom } from 'rxjs';
import { dateRangeValidator } from '../../Validators/AppointmentCustomValidator';

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
  patient!: Patient;
  doctor!: IDoctor;
  updatedAppointment: IAppointmentDTO = {} as IAppointmentDTO;

  reactiveForm = new FormGroup({
    patient: new FormControl('', [Validators.required]),
    doctor: new FormControl('', [Validators.required]),
    purposeOfVisit: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^(\+91|91)?[6-9][0-9]{9}$/)]),
    date: new FormControl('', [Validators.required, dateRangeValidator()]),
    time: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.reactiveForm.get('patient')?.disable();
    this.reactiveForm.get('doctor')?.disable();

    this.route.paramMap.subscribe(param => {
      this.appointmentId = Number(param.get('id'));
      if (this.appointmentId) {
        this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
          next: data => {
            this.appointment = data;
            this.formattedAppontmentId=this.formatAppointmentId(this.appointmentId);
            this.reactiveForm.patchValue({
              patient: this.formatPatientId(this.appointment.patientId),
              doctor:this.formatDoctortId(this.appointment.doctorId),
              purposeOfVisit: this.appointment.purposeOfVisit,
              email: this.appointment.email,
              phone: this.appointment.phone,
              date: this.appointment.date,
              time: (this.appointment.time).slice(0,5),
              message: this.appointment.message
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

  private mapFormToAppointment(): void {
    const formValues = this.reactiveForm.value;
    
    this.updatedAppointment = {
      PurposeOfvisit: String(formValues.purposeOfVisit),
      Date: String(formValues.date),
      Time: `${String(formValues.time)}:00`,
      Email: String(formValues.email),
      Phone: String(formValues.phone),
      Message: String(formValues.message),
      LastModifiedBy:"admin"
    };
    console.log(this.updatedAppointment);
  }
}

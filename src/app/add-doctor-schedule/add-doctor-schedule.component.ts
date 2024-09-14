import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDoctorSchedule } from '../models/Doctors/doctorSchedule.models';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../services/doctor/doctor.service';

@Component({
  selector: 'app-add-doctor-schedule',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-doctor-schedule.component.html',
  styleUrl: './add-doctor-schedule.component.css'
})
export class AddDoctorScheduleComponent implements OnInit {
  scheduleForm: FormGroup;
  doctors = [
    { doctorId: 1, firstName: 'John', lastName: 'Doe' },
    { doctorId: 2, firstName: 'Jane', lastName: 'Smith' }
  ];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService
  ) {
    // Initialize the form in the constructor
    this.scheduleForm = this.fb.group({
      clinicId: [1, Validators.required],
      weekDay: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: [true],
      doctorId: [0, Validators.required],
      message: ['']
    });
  }

  ngOnInit() {
    // If you need to perform any additional initialization, you can do it here
  }

  onSubmit(): void {
  //   if (this.scheduleForm.valid) {
  //     const scheduleData: IDoctorSchedule = this.scheduleForm.value;
  //     this.doctorService.createSchedule(scheduleData).subscribe({
  //       next: (response) => {
  //         console.log('Schedule created successfully:', response);
  //         // Handle success (e.g., redirect or show a success message)
  //       },
  //       error: (error) => {
  //         console.error('Error creating schedule:', error);
  //         // Handle error (e.g., show an error message)
  //       },
  //       complete: () => {
  //         console.log('Request complete.');
  //         // Handle completion if needed
  //       }
  //     });
  //   }
   }
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppointmentService } from '../services/appointmnent/appointment.service';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();
    const inputDate = new Date(control.value);
    
    //not considering time 
    currentDate.setHours(0, 0, 0, 0);

    // Check if the input date is in the past
    console.log(currentDate);
    if (inputDate < currentDate) {
      return { pastDate: true }; // Invalid if date is in the past
    }

    // Check if the input date is more than 30 days in the future
    const futureLimitDate = new Date();
    futureLimitDate.setDate(currentDate.getDate() + 30);

    if (inputDate > futureLimitDate) {
      return { futureDateExceeded: true }; // Invalid if date is more than 30 days in the future
    }

    return null; // Valid if date is within the valid range
  };
}

export function timeNotInPastValidator(dateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const timeValue = control.value;
  
      // Access the parent form to retrieve the date value
      const formGroup = control.parent;
      if (!formGroup) {
        return null; // No validation if no parent form exists
      }
  
      const dateControl = formGroup.get(dateControlName);
      const dateValue = dateControl ? dateControl.value : null;
  
      if (!timeValue || !dateValue) {
        return null; // No validation required if either date or time is missing
      }
  
      // Create a Date object from the dateValue and timeValue
      const inputDateTime = new Date(dateValue);
      const [hours, minutes] = timeValue.split(':').map(Number);
      inputDateTime.setHours(hours, minutes, 0, 0);
  
      const currentDateTime = new Date();
      
      console.log(currentDateTime+" "+inputDateTime);

      // Check if the combined date and time is in the past
      return inputDateTime < currentDateTime ? { timeInPast: true } : null;
    };
  }
  
  export function doctorAvailabilityValidator(doctorControlName: string, dateControlName: string, appointmentService:AppointmentService): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const timeValue = control.value;
  
      // Access the parent form to retrieve the date value
      const formGroup = control.parent;
      if (!formGroup) {
        return null; // No validation if no parent form exists
      }
  
      const dateControl = formGroup.get(dateControlName);
      const dateValue = dateControl ? dateControl.value : null;

      const doctor = formGroup.get(doctorControlName);
      const doctorId = doctor ? doctor.value : null;
  
      if (!timeValue || !dateValue) {
        return null; // No validation required if either date or time is missing
      }
  
      // Extract date in 'yyyy-MM-dd' format
      const appointmentDate = new Date(dateValue);
      const formattedDate = appointmentDate.toISOString().split('T')[0]; // yyyy-MM-dd format
  
      // Extract time in 'HH:mm:ss' format and calculate end time
      const [hours, minutes] = timeValue.split(':');
      const startTime = `${hours}:${minutes}:00`; // HH:mm:ss format
  
      const endTimeDate = new Date(appointmentDate);
      endTimeDate.setHours(+hours + 1, +minutes); // Add 1 hour to start time
      const endTime = `${String(endTimeDate.getHours()).padStart(2, '0')}:${String(endTimeDate.getMinutes()).padStart(2, '0')}:00`;
  
      console.log("Doctor Unavailable Validator")
      // Call the service to check availability
      return appointmentService.getDoctorAvailabilty(doctorId, formattedDate, startTime, endTime).pipe(
        map((response) => {
          if (response.status === 404) {
            console.log("Doctor Unavailable :staus 404")
            return { doctorUnavailable: true }; // No availability found
          }
          if (response.body && response.body.length === 0) {
            console.log("Doctor Unavailable :empty body")
            return { doctorUnavailable: true }; // No availability found based on the body
          }
          console.log("Doctor Available")
          return null; // Doctor is available
        }),
        catchError((error) => {
          console.log("Errror in Doctor Unavailable",error)
          return of({ doctorUnavailable: true }); // Handle API errors
        })
      );
    }
  }
  
  
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
  
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();
    const inputDate = new Date(control.value);
    
    // Check if the input date is in the past
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

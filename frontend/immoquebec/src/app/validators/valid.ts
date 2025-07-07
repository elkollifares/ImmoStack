import { FormGroup, ValidationErrors } from "@angular/forms";

export class MyValidators {
  static mustMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => ValidationErrors | null {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

 
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null; 
      }


      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ 'mustMatch': true });
        return { 'mustMatch': true }; 
      } else {
        matchingControl.setErrors(null);
        return null; 
      }
    };
  }
}

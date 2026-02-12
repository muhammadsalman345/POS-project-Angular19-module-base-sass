import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false // Important: As per your module-based request
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  
  countries: string[] = [
    'Pakistan',
    'India',
    'USA',
    'UK',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'UAE',
    'Other'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Registration Form Data:', this.registrationForm.value);
        this.isLoading = false;
        
        // Show success message (you can add MatSnackBar here)
        alert('Registration Successful!');
      }, 2000);
    } else {
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter valid numbers only';
    }
    if (controlName === 'confirmPassword' && this.registrationForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  resetForm(): void {
    this.registrationForm.reset();
    Object.keys(this.registrationForm.controls).forEach(key => {
      this.registrationForm.get(key)?.setErrors(null);
      this.registrationForm.get(key)?.markAsUntouched();
    });
  }
}
// features/auth/components/register/register.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false // Important: As per your module-based request
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  private destroy$ = new Subject<void>();

  // Sirf essential fields jo backend expect karta hai
  countries = [
    { code: '+1', name: 'USA/Canada' },
    { code: '+44', name: 'UK' },
    { code: '+91', name: 'India' },
    { code: '+92', name: 'Pakistan' },
    { code: '+61', name: 'Australia' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.formBuilder.group({
      // Required fields - backend ke hisaab se
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)  // "password123" ki tarah
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10,15}$')  // Sirf digits allow
      ]],
      countryCode: ['+1'],  // Default country code
      address: ['', Validators.required],
      
      // Optional fields - agar zaroorat ho to
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Password match validator
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  // Getter for easy access
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    // Mark all as touched to show validation errors
    this.registerForm.markAllAsTouched();

    // Check if form is invalid
    if (this.registerForm.invalid) {
      // Find first invalid field
      const firstInvalid = Object.keys(this.registerForm.controls)
        .find(key => this.registerForm.get(key)?.invalid);
      
      if (firstInvalid) {
        let message = 'Please check ';
        switch(firstInvalid) {
          case 'email': message += 'email address'; break;
          case 'password': message += 'password'; break;
          case 'firstName': message += 'first name'; break;
          case 'lastName': message += 'last name'; break;
          case 'phoneNumber': message += 'phone number'; break;
          case 'address': message += 'address'; break;
          case 'acceptTerms': message += 'terms and conditions'; break;
          default: message += firstInvalid;
        }
        this.toastService.warning(message);
        
        // Scroll to invalid field
        const element = document.querySelector(`[formcontrolname="${firstInvalid}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.loading = true;
    
    // EXACT format jo backend expect karta hai (aapke Postman data ke hisaab se)
    const registrationData: any = {
      email: this.f['email'].value,
      password: this.f['password'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      phoneNumber: this.f['countryCode'].value + this.f['phoneNumber'].value,
      address: this.f['address'].value
    };

    // Debug: Check exact data being sent
    console.log('🚀 Sending to Backend (Postman Format):', JSON.stringify(registrationData, null, 2));
    
    // API Call
    this.authService.register(registrationData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Registration Success:', response);
          this.toastService.success('Registration successful!');
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('❌ Registration Error:', error);
          this.toastService.error(error.error?.message || error.message || 'Registration failed');
        }
      });
  }
}
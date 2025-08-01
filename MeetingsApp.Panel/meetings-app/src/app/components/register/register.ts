import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      profileImagePath: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.registerForm.value;
      delete formValue.confirmPassword; // API'ye göndermeyeceğiz

      this.authService.register(formValue).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          
          if (error.status === 0) {
            this.errorMessage = 'API sunucusuna bağlanılamıyor. Lütfen API sunucusunun çalıştığından emin olun.';
          } else if (error.status === 400) {
            this.errorMessage = 'Geçersiz bilgiler. Lütfen formu kontrol edin.';
          } else if (error.status === 409) {
            this.errorMessage = 'Bu email adresi zaten kullanılıyor.';
          } else {
            this.errorMessage = 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}

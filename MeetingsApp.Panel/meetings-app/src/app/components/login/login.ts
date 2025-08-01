import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      console.log('Login form submitted:', this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isLoading = false;
          
          if (error.status === 0) {
            this.errorMessage = 'API sunucusuna bağlanılamıyor. Lütfen API sunucusunun çalıştığından emin olun.';
          } else if (error.status === 401) {
            this.errorMessage = error.error || 'Email veya şifre hatalı.';
          } else if (error.status === 400) {
            this.errorMessage = 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.';
          } else {
            this.errorMessage = 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}

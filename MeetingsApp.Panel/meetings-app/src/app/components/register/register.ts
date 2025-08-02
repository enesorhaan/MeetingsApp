import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { RegisterRequest } from '../../models/user.model';

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
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  uploadProgress = 0;

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
      photoPath: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Dosya tipini kontrol et
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Lütfen geçerli bir fotoğraf dosyası seçin.';
        return;
      }

      // Dosya boyutunu kontrol et (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Fotoğraf boyutu 5MB\'dan küçük olmalıdır.';
        return;
      }

      this.selectedPhoto = file;
      this.errorMessage = '';

      // Fotoğraf önizlemesi oluştur
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.selectedPhoto = null;
    this.photoPreview = null;
    this.registerForm.patchValue({ photoPath: '' });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.uploadProgress = 0;

      const formData = this.registerForm.value;
      
      // Önce fotoğraf yükleme işlemi
      if (this.selectedPhoto) {
        console.log('Fotoğraf yükleniyor:', this.selectedPhoto.name);
        this.authService.uploadPhoto(this.selectedPhoto).subscribe({
          next: (uploadResponse) => {
            console.log('Fotoğraf yükleme başarılı:', uploadResponse);
            this.uploadProgress = 100;
            this.registerWithPhoto(formData, uploadResponse.path);
          },
          error: (err) => {
            console.error('Fotoğraf yükleme hatası:', err);
            this.errorMessage = 'Fotoğraf yüklenirken bir hata oluştu: ' + (err.error?.message || err.message);
            this.isLoading = false;
            this.uploadProgress = 0;
          }
        });
      } else {
        this.registerWithPhoto(formData, undefined);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private registerWithPhoto(formData: any, photoPath?: string): void {
    const registerData: RegisterRequest = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      profileImagePath: photoPath
    };

    console.log('Kayıt işlemi başlatılıyor:', registerData);
    console.log('API URL:', 'http://localhost:5016/api/auth/register');

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Kayıt başarılı:', response);
        this.isLoading = false;
        this.uploadProgress = 0;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Kayıt hatası:', err);
        this.isLoading = false;
        this.uploadProgress = 0;
        
        if (err.status === 0) {
          this.errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
        } else if (err.status === 400) {
          if (err.error && err.error.errors) {
            // Validation errors
            const errorMessages = Object.values(err.error.errors).flat();
            this.errorMessage = errorMessages.join(', ');
          } else {
            this.errorMessage = err.error?.message || 'Geçersiz bilgiler. Lütfen formu kontrol edin.';
          }
        } else if (err.status === 409) {
          this.errorMessage = 'Bu email adresi zaten kullanılıyor.';
        } else if (err.status === 500) {
          this.errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else {
          this.errorMessage = `Kayıt olurken bir hata oluştu (${err.status}): ${err.error?.message || err.message}`;
        }
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

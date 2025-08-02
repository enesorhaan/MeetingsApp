import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '../../services/meeting';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-join-meeting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join-meeting.html',
  styleUrl: './join-meeting.scss'
})
export class JoinMeetingComponent implements OnInit {
  joinForm: FormGroup;
  loading = false;
  error = '';
  meetingGuid = '';
  meetingDetails: any = null;
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private authService: AuthService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.joinForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // URL'den GUID'i al
    this.meetingGuid = this.route.snapshot.params['guid'];
    
    // Kullanıcı giriş yapmış mı kontrol et
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.isAuthenticated && this.currentUser) {
      // Giriş yapmış kullanıcı için formu doldur
      this.joinForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
    }
    
    // Toplantı detaylarını yükle
    this.loadMeetingDetails();
  }

  private loadMeetingDetails(): void {
    if (!this.meetingGuid) {
      this.error = 'Geçersiz toplantı linki.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.meetingService.joinMeetingByLink(this.meetingGuid).subscribe({
      next: (response) => {
        this.meetingDetails = response;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 404) {
          this.error = 'Bağlanmaya çalışılan toplantı linki hatalı veya geçersiz.';
        } else if (err.status === 0) {
          this.error = 'API sunucusuna bağlanılamıyor.';
        } else {
          this.error = 'Toplantı bilgileri yüklenirken bir hata oluştu.';
        }
      }
    });
  }

  onSubmit(): void {
    if (this.joinForm.valid) {
      this.loading = true;
      this.error = '';

      const formData = this.joinForm.value;
      
      // Burada gerçek toplantıya katılma işlemi yapılacak
      console.log('Toplantıya katılma:', formData);
      
      // Şimdilik başarılı sayalım
      setTimeout(() => {
        this.loading = false;
        alert('Toplantı odasına yönlendiriliyorsunuz...');
        // Burada toplantı odasına yönlendirme yapılacak
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.joinForm.controls).forEach(key => {
      const control = this.joinForm.get(key);
      control?.markAsTouched();
    });
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 
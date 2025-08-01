import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from '../../services/meeting';
import { CreateMeetingRequest, Meeting } from '../../models/meeting.model';
import { SuccessModalComponent } from '../success-modal/success-modal';
import { InviteModalComponent } from '../invite-modal/invite-modal';

@Component({
  selector: 'app-meeting-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuccessModalComponent, InviteModalComponent],
  templateUrl: './meeting-form.html',
  styleUrl: './meeting-form.scss'
})
export class MeetingFormComponent {
  meetingForm: FormGroup;
  loading = false;
  error = '';
  selectedFile: File | null = null;
  uploadProgress = 0;
  
  // Modal states
  showSuccessModal = false;
  showInviteModal = false;
  createdMeeting: Meeting | null = null;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Şu anki zamandan 15 dakika sonrasını hesapla
    const now = new Date();
    const defaultStartTime = new Date(now.getTime() + 15 * 60 * 1000); // 15 dakika sonra
    
    // datetime-local input için yerel zaman formatı: YYYY-MM-DDTHH:MM
    const year = defaultStartTime.getFullYear();
    const month = String(defaultStartTime.getMonth() + 1).padStart(2, '0');
    const day = String(defaultStartTime.getDate()).padStart(2, '0');
    const hours = String(defaultStartTime.getHours()).padStart(2, '0');
    const minutes = String(defaultStartTime.getMinutes()).padStart(2, '0');
    const formattedStartTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    this.meetingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', []], // Zorunluluk kaldırıldı
      startTime: [formattedStartTime, [Validators.required, this.futureDateValidator()]], // Default 15 dakika sonra
      durationInMinutes: [30, [Validators.required, Validators.min(15), Validators.max(480)]], // Default 30 dakika
      filePath: ['']
    });
  }

  // Geçmiş tarih validasyonu
  private futureDateValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      
      const selectedDate = new Date(control.value);
      const now = new Date();
      
      // Şu anki zamandan 5 dakika sonrasına kadar izin ver
      const minDate = new Date(now.getTime() + 5 * 60 * 1000);
      
      if (selectedDate < minDate) {
        return { pastDate: true };
      }
      
      return null;
    };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.meetingForm.valid) {
      this.loading = true;
      this.error = '';
      this.uploadProgress = 0;

      const formData = this.meetingForm.value;

      // Önce dosya yükleme işlemi
      if (this.selectedFile) {
        this.meetingService.uploadFile(this.selectedFile).subscribe({
          next: (uploadResponse) => {
            this.uploadProgress = 100;
            // Loading state'ini sıfırlamıyoruz, createMeetingWithFile içinde sıfırlanacak
            this.createMeetingWithFile(formData, uploadResponse.path);
          },
          error: (err) => {
            this.loading = false;
            this.uploadProgress = 0;

            if (err.status === 0) {
              this.error = 'API sunucusuna bağlanılamıyor. Lütfen API sunucusunun çalıştığından emin olun.';
            } else if (err.status === 400) {
              if (err.error && err.error.message) {
                this.error = 'Dosya yükleme hatası: ' + err.error.message;
              } else if (err.error && typeof err.error === 'string') {
                this.error = 'Dosya yükleme hatası: ' + err.error;
              } else {
                this.error = 'Dosya yüklenirken bir hata oluştu. Lütfen dosyayı kontrol edin.';
              }
            } else if (err.status === 413) {
              this.error = 'Dosya boyutu çok büyük. Lütfen daha küçük bir dosya seçin.';
            } else {
              this.error = 'Dosya yüklenirken bir hata oluştu: ' + (err.error?.message || err.message);
            }
          }
        });
      } else {
        this.createMeetingWithFile(formData, undefined);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createMeetingWithFile(formData: any, filePath?: string): void {
    const meetingData: CreateMeetingRequest = {
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      durationInMinutes: formData.durationInMinutes,
      filePath: filePath
    };

    console.log('createMeetingWithFile çağrıldı:', meetingData);

    this.meetingService.createMeeting(meetingData).subscribe({
      next: (response) => {
        console.log('Toplantı oluşturma başarılı:', response);
        
        // Loading state'ini hemen sıfırla
        this.loading = false;
        this.uploadProgress = 0;
        this.cdr.detectChanges();
        console.log('Loading state sıfırlandı:', this.loading);
        
        // Başarı modalını göster
        this.createdMeeting = response;
        this.showSuccessModal = true;
        console.log('Success modal gösteriliyor:', this.showSuccessModal);
        console.log('Created meeting:', this.createdMeeting);
        
        // Eğer modal görünmezse loading'i manuel olarak sıfırla
        setTimeout(() => {
          console.log('3 saniye sonra loading durumu:', this.loading);
          if (this.loading) {
            console.log('Loading manuel olarak sıfırlanıyor');
            this.loading = false;
          }
        }, 3000);
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 0) {
          this.error = 'API sunucusuna bağlanılamıyor. Lütfen API sunucusunun çalıştığından emin olun.';
        } else if (err.status === 400) {
          if (err.error && err.error.message) {
            this.error = err.error.message;
          } else if (err.error && typeof err.error === 'string') {
            this.error = err.error;
          } else {
            this.error = 'Geçersiz istek. Lütfen form bilgilerinizi kontrol edin.';
          }
        } else if (err.status === 401) {
          this.error = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
        } else if (err.status === 500) {
          this.error = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        } else {
          this.error = `Toplantı oluşturulurken bir hata oluştu (${err.status}): ${err.error?.message || err.message}`;
        }
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.meetingForm.controls).forEach(key => {
      const control = this.meetingForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  // Modal event handlers
  onSuccessModalClose(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/dashboard']);
  }

  onInviteClicked(meeting: Meeting): void {
    this.showSuccessModal = false;
    this.showInviteModal = true;
  }

  onInviteModalClose(): void {
    this.showInviteModal = false;
    this.router.navigate(['/dashboard']);
  }

  onInvitationsSent(): void {
    // Davet gönderildikten sonra dashboard'a yönlendir
    this.router.navigate(['/dashboard']);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from '../../services/meeting';
import { AuthService } from '../../services/auth';
import { Meeting } from '../../models/meeting.model';
import { InviteModalComponent } from '../invite-modal/invite-modal';

@Component({
  selector: 'app-meeting-detail-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InviteModalComponent],
  templateUrl: './meeting-detail-modal.html',
  styleUrl: './meeting-detail-modal.scss'
})
export class MeetingDetailModalComponent {
  @Input() meeting: Meeting | null = null;
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() meetingCancelled = new EventEmitter<number>();

  joinForm: FormGroup;
  loading = false;
  error = '';
  joinLoading = false;
  joinError = '';
  meetingDetails: any = null;
  cancelLoading = false; // İptal işlemi için loading
  cancelSuccess = false; // İptal başarılı mesajı için
  showCancelConfirmation = false; // Onay dialogu için
  
  // Davet modal state'leri
  showInviteModal = false;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.joinForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.meeting) {
      this.loadMeetingDetails();
      this.setupFormForUser();
    }
  }

  private setupFormForUser(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Kullanıcı giriş yapmışsa formu doldur
      this.joinForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      });
    }
  }

  private loadMeetingDetails(): void {
    if (!this.meeting?.publicLink) return;

    // Public link'ten GUID'i çıkar
    const guid = this.extractGuidFromLink(this.meeting.publicLink);
    if (!guid) return;

    this.loading = true;
    this.meetingService.joinMeetingByLink(guid).subscribe({
      next: (response) => {
        this.meetingDetails = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Toplantı detayları yüklenirken hata:', err);
        this.error = 'Toplantı detayları yüklenemedi.';
        this.loading = false;
      }
    });
  }

  private extractGuidFromLink(link: string): string | null {
    const match = link.match(/\/join\/([a-f0-9-]+)$/i);
    return match ? match[1] : null;
  }

  onJoinMeeting(): void {
    if (this.joinForm.valid) {
      this.joinLoading = true;
      this.joinError = '';

      const formData = this.joinForm.value;
      const currentUser = this.authService.getCurrentUser();

      if (currentUser) {
        // Giriş yapmış kullanıcı - direkt katıl
        this.joinAsAuthenticatedUser();
      } else {
        // Misafir kullanıcı - form verilerini kullan
        this.joinAsGuest(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private joinAsAuthenticatedUser(): void {
    // Burada gerçek toplantıya katılma işlemi yapılacak
    console.log('Giriş yapmış kullanıcı toplantıya katılıyor');
    
    // Şimdilik başarılı sayalım
    setTimeout(() => {
      this.joinLoading = false;
      this.showMeetingRoom();
    }, 1000);
  }

  private joinAsGuest(guestData: any): void {
    // Misafir kullanıcı için toplantıya katılma
    console.log('Misafir kullanıcı toplantıya katılıyor:', guestData);
    
    // Şimdilik başarılı sayalım
    setTimeout(() => {
      this.joinLoading = false;
      this.showMeetingRoom();
    }, 1000);
  }

  private showMeetingRoom(): void {
    // Toplantı odası sayfasına yönlendir
    // Bu kısım daha sonra implement edilecek
    alert('Toplantı odasına yönlendiriliyorsunuz...');
    this.closeModal.emit();
  }

  onCancelMeeting(): void {
    if (!this.meeting?.id) return;

    this.cancelLoading = true;
    this.error = '';
    this.cancelSuccess = false;

    this.meetingService.cancelMeeting(this.meeting.id).subscribe({
      next: () => {
        this.cancelLoading = false;
        this.cancelSuccess = true;
        
        // 1 saniye sonra modal'ı kapat ve event emit et
        setTimeout(() => {
          this.meetingCancelled.emit(this.meeting!.id);
          this.closeModal.emit();
        }, 1000);
      },
      error: (err) => {
        console.error('Toplantı iptal hatası:', err);
        this.cancelLoading = false;
        
        if (err.status === 404) {
          this.error = 'Toplantı bulunamadı veya zaten iptal edilmiş.';
        } else if (err.status === 401) {
          this.error = 'Bu işlem için yetkiniz bulunmuyor.';
        } else if (err.status === 0) {
          this.error = 'API sunucusuna bağlanılamıyor.';
        } else {
          this.error = 'Toplantı iptal edilirken bir hata oluştu.';
        }
      }
    });
  }

  // Onay dialogunu göster
  showCancelConfirmationDialog(): void {
    this.showCancelConfirmation = true;
    this.error = '';
  }

  // Onay dialogunu gizle
  hideCancelConfirmationDialog(): void {
    this.showCancelConfirmation = false;
  }

  // Onaylandığında iptal işlemini başlat
  confirmCancelMeeting(): void {
    this.showCancelConfirmation = false;
    this.onCancelMeeting();
  }

  onDownloadFile(): void {
    if (this.meeting?.filePath) {
      const fileUrl = this.meetingService.getFile(this.meeting.filePath);
      window.open(fileUrl, '_blank');
    }
  }

  onLoginRedirect(): void {
    this.closeModal.emit();
    this.router.navigate(['/login']);
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  // Davet gönderme metodları
  onInviteClicked(): void {
    this.showInviteModal = true;
  }

  onInviteModalClose(): void {
    this.showInviteModal = false;
  }

  onInvitationsSent(): void {
    this.showInviteModal = false;
    // Davet gönderildikten sonra meeting detail modal'ı da kapat
    this.closeModal.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.joinForm.controls).forEach(key => {
      const control = this.joinForm.get(key);
      control?.markAsTouched();
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  // Gelecek toplantı kontrolü
  isFutureMeeting(): boolean {
    if (!this.meeting) return false;
    
    const now = new Date();
    const startTime = new Date(this.meeting.startTime);
    
    return startTime > now;
  }

  // Debug için organizatör kontrolü
  isOrganizer(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!(currentUser && this.meeting && currentUser.id === this.meeting.createdByUserId);
  }

  isCompletedMeeting(): boolean {
    if (!this.meeting) return false;
    const now = new Date();
    const endTime = new Date(this.meeting.endTime);
    return now > endTime;
  }

  isOngoingMeeting(): boolean {
    if (!this.meeting) return false;
    const now = new Date();
    const startTime = new Date(this.meeting.startTime);
    const endTime = new Date(this.meeting.endTime);
    return now >= startTime && now <= endTime;
  }
}

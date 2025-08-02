import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../services/meeting';
import { Meeting, MeetingInvitationDto } from '../../models/meeting.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-invite-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invite-modal.html',
  styleUrl: './invite-modal.scss'
})
export class InviteModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() meeting: Meeting | null = null;
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() invitationsSent = new EventEmitter<void>();

  loading = false;
  error = '';
  success = false;
  showCopyToast = false;
  emailList: string[] = [''];

  constructor(
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      this.initializeForm();
    }
  }

  ngOnDestroy(): void {
    this.resetForm();
  }

  private initializeForm(): void {
    this.resetForm();
    this.addEmailField();
  }

  private resetForm(): void {
    this.emailList = [''];
    this.error = '';
    this.success = false;
  }

  addEmailField(): void {
    this.emailList.push('');
  }

  removeEmailField(index: number): void {
    if (this.emailList.length > 1) {
      this.emailList.splice(index, 1);
    }
  }

  updateEmail(index: number, value: string): void {
    this.emailList[index] = value;
  }

  onCloseModal(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  copyMeetingLink(): void {
    if (this.meeting?.publicLink) {
      const frontendLink = this.convertToFrontendLink(this.meeting.publicLink);
      navigator.clipboard.writeText(frontendLink).then(() => {
        this.showCopyToast = true;
        setTimeout(() => {
          this.showCopyToast = false;
        }, 3000);
      });
    }
  }

  private convertToFrontendLink(backendLink: string): string {
    // Backend URL'sini frontend URL'sine dönüştür
    const guid = backendLink.split('/').pop();
    if (guid) {
      return `${environment.frontendUrl}/meeting/join/${guid}`;
    }
    return backendLink;
  }

  getFrontendLink(): string {
    if (this.meeting?.publicLink) {
      return this.convertToFrontendLink(this.meeting.publicLink);
    }
    return '';
  }

  onSubmit(): void {
    if (this.meeting) {
      this.loading = true;
      this.error = '';
      this.success = false;

      // Geçerli email'leri topla
      const emails = this.emailList
        .map(email => email.trim())
        .filter(email => email && email.length > 0 && this.isValidEmail(email));

      if (emails.length === 0) {
        this.error = 'En az bir geçerli email adresi girmelisiniz.';
        this.loading = false;
        return;
      }

      const invitationDto: MeetingInvitationDto = {
        meetingId: this.meeting.id,
        emailList: emails
      };

      this.meetingService.sendInvitations(invitationDto).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;
          
          // Basit alert göster
          const alertMessage = `${emails.length} davetiye başarıyla gönderildi!`;
          this.showAlert(alertMessage, 'success');
          
          // Hemen modal'ı kapat
          this.invitationsSent.emit();
        },
        error: (err) => {
          this.loading = false;
          
          let errorMessage = 'Davet gönderilirken bir hata oluştu.';
          
          if (err.status === 200) {
            // API başarılı ama response parse edilemedi
            this.loading = false;
            this.success = true;
            
            const alertMessage = `${emails.length} davetiye başarıyla gönderildi!`;
            this.showAlert(alertMessage, 'success');
            
            // Hemen modal'ı kapat
            this.invitationsSent.emit();
            return;
          } else if (err.status === 400) {
            errorMessage = err.error || 'Geçersiz email adresleri.';
          } else if (err.status === 0) {
            errorMessage = 'API sunucusuna bağlanılamıyor.';
          } else if (err.status === 401) {
            errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          } else if (err.status === 500) {
            errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          }
          
          this.error = errorMessage;
          this.showAlert(errorMessage, 'error');
        }
      });
    }
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    // Basit alert oluştur
    const alertDiv = document.createElement('div');
    alertDiv.className = `simple-alert alert-${type}`;
    alertDiv.innerHTML = `
      <div class="alert-content">
        <span class="alert-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="alert-message">${message}</span>
        <button class="alert-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    
    // Stil ekle
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      background: ${type === 'success' ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-weight: 500;
      font-size: 14px;
      min-width: 300px;
      animation: slideInRight 0.3s ease-out;
    `;
    
    // CSS animasyonu ekle
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .simple-alert .alert-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .simple-alert .alert-icon {
        font-size: 18px;
      }
      .simple-alert .alert-message {
        flex: 1;
      }
      .simple-alert .alert-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
      }
      .simple-alert .alert-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(alertDiv);
    
    // 4 saniye sonra otomatik kaldır
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove();
      }
    }, 4000);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  hasInvalidEmails(): boolean {
    return this.emailList.some(email => email.trim() && !this.isValidEmail(email.trim()));
  }

  getValidEmailCount(): number {
    return this.emailList.filter(email => email.trim() && this.isValidEmail(email.trim())).length;
  }

  trackByIndex(index: number): number {
    return index;
  }
} 
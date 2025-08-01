import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MeetingService } from '../../services/meeting';
import { Meeting, MeetingInvitationDto } from '../../models/meeting.model';

@Component({
  selector: 'app-invite-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invite-modal.html',
  styleUrl: './invite-modal.scss'
})
export class InviteModalComponent {
  @Input() meeting: Meeting | null = null;
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() invitationsSent = new EventEmitter<void>();

  inviteForm: FormGroup;
  loading = false;
  error = '';
  success = false;
  showCopyToast = false;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService
  ) {
    this.inviteForm = this.fb.group({
      emails: this.fb.array([])
    });
    this.addEmailField(); // İlk email alanını ekle
  }

  get emailsArray() {
    return this.inviteForm.get('emails') as FormArray;
  }

  addEmailField(): void {
    const emailControl = this.fb.control('', [Validators.required, Validators.email]);
    this.emailsArray.push(emailControl);
  }

  removeEmailField(index: number): void {
    if (this.emailsArray.length > 1) {
      this.emailsArray.removeAt(index);
    }
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  copyMeetingLink(): void {
    if (this.meeting?.publicLink) {
      navigator.clipboard.writeText(this.meeting.publicLink).then(() => {
        this.showCopyToast = true;
        setTimeout(() => {
          this.showCopyToast = false;
        }, 3000);
      });
    }
  }

  onSubmit(): void {
    if (this.inviteForm.valid && this.meeting) {
      this.loading = true;
      this.error = '';
      this.success = false;

      // Geçerli email'leri topla
      const emails = this.emailsArray.controls
        .map(control => control.value)
        .filter(email => email && email.trim().length > 0)
        .map(email => email.trim());

      if (emails.length === 0) {
        this.error = 'En az bir email adresi girmelisiniz.';
        this.loading = false;
        return;
      }

      const invitationDto: MeetingInvitationDto = {
        meetingId: this.meeting.id,
        emailList: emails
      };

      this.meetingService.sendInvitations(invitationDto).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          
          // 2 saniye sonra modal'ı kapat
          setTimeout(() => {
            this.invitationsSent.emit();
            this.closeModal.emit();
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          
          if (err.status === 400) {
            this.error = err.error || 'Geçersiz email adresleri.';
          } else if (err.status === 0) {
            this.error = 'API sunucusuna bağlanılamıyor.';
          } else {
            this.error = 'Davet gönderilirken bir hata oluştu.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    this.emailsArray.controls.forEach(control => {
      control.markAsTouched();
    });
  }

  hasInvalidEmails(): boolean {
    return this.emailsArray.controls.some(control => control.invalid && control.touched);
  }
} 
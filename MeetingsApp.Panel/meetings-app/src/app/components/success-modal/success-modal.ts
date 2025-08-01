import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meeting } from '../../models/meeting.model';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-modal.html',
  styleUrl: './success-modal.scss'
})
export class SuccessModalComponent implements OnChanges {
  @Input() meeting: Meeting | null = null;
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() inviteClicked = new EventEmitter<Meeting>();

  showCopyToast = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      // Modal visibility değiştiğinde yapılacak işlemler
    }
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onInviteClicked(): void {
    if (this.meeting) {
      this.inviteClicked.emit(this.meeting);
    }
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
} 
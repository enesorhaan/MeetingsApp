import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MeetingService } from '../../services/meeting';
import { AuthService } from '../../services/auth';
import { Meeting } from '../../models/meeting.model';
import { MeetingDetailModalComponent } from '../meeting-detail-modal/meeting-detail-modal';
import { JoinLinkModalComponent } from '../join-link-modal/join-link-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MeetingDetailModalComponent, JoinLinkModalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  meetings: Meeting[] = [];
  loading = false;
  showDetailModal = false;
  selectedMeeting: Meeting | null = null;
  showJoinLinkModal = false;

  constructor(
    public meetingService: MeetingService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    if (this.authService.isAuthenticated()) {
      this.loading = true;
      this.meetingService.getMeetings().subscribe({
        next: (meetings) => {
          this.meetings = meetings;
          this.loading = false;
        },
        error: (error) => {
          console.error('Toplantılar yüklenirken hata:', error);
          this.loading = false;
        }
      });
    }
  }

  openMeetingDetail(meeting: Meeting): void {
    this.selectedMeeting = meeting;
    this.showDetailModal = true;
  }

  closeMeetingDetail(): void {
    this.showDetailModal = false;
    this.selectedMeeting = null;
  }

  openJoinLinkModal(): void {
    this.showJoinLinkModal = true;
  }

  closeJoinLinkModal(): void {
    this.showJoinLinkModal = false;
  }

  onMeetingCancelled(meetingId: number): void {
    this.meetings = this.meetings.filter(m => m.id !== meetingId);
  }

  joinMeetingByLink(): void {
    this.openJoinLinkModal();
  }

  joinMeetingFromCard(meeting: Meeting): void {
    if (meeting.publicLink) {
      // Link'ten GUID'i çıkar
      const guid = meeting.publicLink.split('/').pop();
      if (guid) {
        this.router.navigate(['/meeting/join', guid]);
      }
    }
  }

  isCompletedMeeting(meeting: Meeting): boolean {
    const now = new Date();
    const endTime = new Date(meeting.endTime);
    return now > endTime;
  }

  getMeetingStatusClass(meeting: Meeting): string {
    if (meeting.isCanceled) {
      return 'status-cancelled';
    }
    
    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(meeting.endTime);
    
    if (now < startTime) {
      return 'status-upcoming';
    } else if (now >= startTime && now <= endTime) {
      return 'status-ongoing';
    } else {
      return 'status-completed';
    }
  }

  getMeetingStatusText(meeting: Meeting): string {
    if (meeting.isCanceled) {
      return 'İptal Edildi';
    }
    
    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(meeting.endTime);
    
    if (now < startTime) {
      return 'Yaklaşan';
    } else if (now >= startTime && now <= endTime) {
      return 'Devam Ediyor';
    } else {
      return 'Tamamlandı';
    }
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

  createMeeting(): void {
    this.router.navigate(['/meeting-form']);
  }

  logout(): void {
    this.authService.logout();
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  trackByMeetingId(index: number, meeting: Meeting): number {
    return meeting.id;
  }
}

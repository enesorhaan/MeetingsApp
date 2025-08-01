import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MeetingService } from '../../services/meeting';
import { AuthService } from '../../services/auth';
import { Meeting } from '../../models/meeting.model';
import { MeetingDetailModalComponent } from '../meeting-detail-modal/meeting-detail-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MeetingDetailModalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  meetings: Meeting[] = [];
  loading = false;
  error = '';
  selectedMeeting: Meeting | null = null;
  isModalVisible = false;

  constructor(
    public meetingService: MeetingService, // Made public for template access
    public authService: AuthService, // Made public for template access
    private router: Router
  ) {}

  ngOnInit(): void {
    // Token kontrolü
    const token = this.authService.getToken();
    if (!token || token === 'temp-token') {
      console.log('Token bulunamadı veya geçici token. Login sayfasına yönlendiriliyor.');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('Token mevcut, toplantılar yükleniyor...');
    this.loadMeetings();
  }

  // Image error handler
  onImageError(event: any): void {
    console.log('Image load error, using default avatar');
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }

  loadMeetings(): void {
    this.loading = true;
    this.error = '';

    this.meetingService.getMeetings().subscribe({
      next: (meetings) => {
        this.meetings = meetings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading meetings:', error);
        this.loading = false;
        
        if (error.status === 401) {
          this.error = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Toplantılar yüklenirken bir hata oluştu.';
        }
      }
    });
  }

  // Modal işlemleri
  openMeetingModal(meeting: Meeting): void {
    this.selectedMeeting = meeting;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedMeeting = null;
  }

  onMeetingCancelled(meetingId: number): void {
    // İptal edilen toplantıyı listede güncelle (kaldırmak yerine)
    const meetingIndex = this.meetings.findIndex(m => m.id === meetingId);
    if (meetingIndex !== -1) {
      this.meetings[meetingIndex].isCanceled = true;
    }
  }

  createMeeting(): void {
    this.router.navigate(['/meeting-form']);
  }

  joinMeetingByLink(): void {
    const link = prompt('Toplantı linkini girin:');
    if (link) {
      // Link'ten GUID'i çıkar
      const guid = link.split('/').pop();
      if (guid) {
        this.meetingService.joinMeetingByLink(guid).subscribe({
          next: (response) => {
            alert(`Toplantıya katıldınız: ${response.title}`);
            this.loadMeetings();
          },
          error: (error) => {
            alert('Toplantıya katılırken hata oluştu.');
          }
        });
      }
    }
  }

  inviteToMeeting(meeting: Meeting): void {
    const emails = prompt('Davet edilecek email adreslerini virgülle ayırarak girin:');
    if (emails) {
      const emailList = emails.split(',').map(email => email.trim());
      this.meetingService.inviteToMeeting({
        meetingId: meeting.id!,
        emailList: emailList
      }).subscribe({
        next: () => {
          alert('Davetler gönderildi.');
        },
        error: (error) => {
          alert('Davet gönderilirken hata oluştu.');
        }
      });
    }
  }

  isOrganizer(meeting: Meeting): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === meeting.createdByUserId;
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('tr-TR');
  }

  getMeetingStatus(meeting: Meeting): string {
    if (meeting.isCanceled) {
      return 'İptal Edildi';
    }
    
    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(meeting.endTime);
    
    if (now < startTime) {
      return 'Yaklaşıyor';
    } else if (now >= startTime && now <= endTime) {
      return 'Devam Ediyor';
    } else {
      return 'Tamamlandı';
    }
  }

  getMeetingStatusClass(meeting: Meeting): string {
    if (meeting.isCanceled) {
      return 'status-canceled';
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

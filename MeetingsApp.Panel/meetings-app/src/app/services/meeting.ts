import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Meeting,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  MeetingInviteRequest,
  JoinMeetingResponse,
  MeetingInvitationDto
} from '../models/meeting.model';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/meeting/my-meetings`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getMeetingById(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/meeting/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createMeeting(meeting: CreateMeetingRequest): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.apiUrl}/meeting`, meeting, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateMeeting(meeting: UpdateMeetingRequest): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/meeting/${meeting.id}`, meeting, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meeting/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  cancelMeeting(meetingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/meeting/${meetingId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  inviteToMeeting(inviteRequest: MeetingInviteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/meeting/invite`, inviteRequest, {
      headers: this.authService.getAuthHeaders()
    });
  }

  sendInvitations(invitationDto: MeetingInvitationDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/meeting/invite`, invitationDto, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text'
    });
  }

  joinMeetingByLink(publicLinkGuid: string): Observable<JoinMeetingResponse> {
    return this.http.get<JoinMeetingResponse>(`${this.apiUrl}/meeting/join/${publicLinkGuid}`);
  }

  uploadFile(file: File): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('File', file); // .NET API'deki FileUploadRequest.File ile eşleşiyor
    
    // Upload işlemlerinde token gerekmez
    return this.http.post<{ path: string }>(`${this.apiUrl}/filestorage/document-upload`, formData);
  }

  // Dosya getirme metodu
  getFile(path: string): string {
    return `${this.apiUrl}/filestorage/get-file?path=${encodeURIComponent(path)}`;
  }
}

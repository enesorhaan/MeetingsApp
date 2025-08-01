import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Meeting, 
  CreateMeetingRequest, 
  UpdateMeetingRequest, 
  MeetingInviteRequest,
  JoinMeetingResponse 
} from '../models/meeting.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:5016/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/meeting`, {
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

  cancelMeeting(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/meeting/${id}/cancel`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  inviteToMeeting(inviteRequest: MeetingInviteRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/meeting/invite`, inviteRequest, {
      headers: this.authService.getAuthHeaders()
    });
  }

  joinMeetingByLink(publicLinkGuid: string): Observable<JoinMeetingResponse> {
    return this.http.get<JoinMeetingResponse>(`${this.apiUrl}/meeting/join/${publicLinkGuid}`);
  }

  uploadFile(file: File): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('File', file); // .NET API'deki FileUploadRequest.File ile eşleşiyor
    
    // FormData kullanırken sadece Authorization header'ını gönderiyoruz
    // Browser otomatik olarak multipart/form-data Content-Type header'ını ekler
    return this.http.post<{ path: string }>(`${this.apiUrl}/filestorage/document-upload`, formData, {
      headers: this.authService.getAuthHeadersOnly()
    });
  }
}

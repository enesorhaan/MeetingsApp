export interface Meeting {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  createdByUserId: number;
  createdAt: string;
  filePath?: string;
  publicLink?: string;
  isCanceled?: boolean; // API'den dönen isCanceled ile eşleşiyor
}

export interface MeetingParticipant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImagePath?: string;
}

export interface CreateMeetingRequest {
  title: string;
  description: string;
  startTime: string;
  durationInMinutes: number;
  filePath?: string;
}

export interface UpdateMeetingRequest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  durationInMinutes: number;
  filePath?: string;
}

export interface MeetingInviteRequest {
  meetingId: number;
  emailList: string[];
}

export interface JoinMeetingResponse {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  publicLink: string;
}

export interface MeetingInvitationDto {
  meetingId: number;
  emailList: string[];
} 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from '../../services/meeting';
import { CreateMeetingRequest } from '../../models/meeting.model';

@Component({
  selector: 'app-meeting-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meeting-form.html',
  styleUrl: './meeting-form.scss'
})
export class MeetingFormComponent {
  meetingForm: FormGroup;
  loading = false;
  error = '';
  selectedFile: File | null = null;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private router: Router
  ) {
    this.meetingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startTime: ['', [Validators.required]],
      durationInMinutes: [60, [Validators.required, Validators.min(15), Validators.max(480)]],
      filePath: ['']
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Seçilen dosya:', file.name);
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
        console.log('Dosya yükleniyor:', this.selectedFile.name);
        this.meetingService.uploadFile(this.selectedFile).subscribe({
          next: (uploadResponse) => {
            console.log('Dosya yükleme başarılı:', uploadResponse);
            this.uploadProgress = 100;
            this.createMeetingWithFile(formData, uploadResponse.path);
          },
          error: (err) => {
            console.error('Dosya yükleme hatası:', err);
            this.error = 'Dosya yüklenirken bir hata oluştu: ' + (err.error?.message || err.message);
            this.loading = false;
            this.uploadProgress = 0;
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

    console.log('Toplantı oluşturuluyor:', meetingData);

    this.meetingService.createMeeting(meetingData).subscribe({
      next: (response) => {
        console.log('Toplantı oluşturma başarılı:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Toplantı oluşturma hatası:', err);
        this.error = err.error?.message || 'Toplantı oluşturulurken bir hata oluştu';
        this.loading = false;
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
}

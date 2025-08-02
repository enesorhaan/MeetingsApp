import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-link-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join-link-modal.html',
  styleUrl: './join-link-modal.scss'
})
export class JoinLinkModalComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();

  joinForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.joinForm = this.fb.group({
      meetingLink: ['', [Validators.required, this.linkValidator()]]
    });
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.joinForm.valid) {
      this.loading = true;
      this.error = '';

      const link = this.joinForm.get('meetingLink')?.value;
      
      // Link'ten GUID'i çıkar
      const guid = this.extractGuidFromLink(link);
      
      if (guid) {
        this.router.navigate(['/meeting/join', guid]);
        this.onCloseModal();
      } else {
        this.error = 'Geçersiz toplantı linki. Lütfen doğru linki girdiğinizden emin olun.';
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private extractGuidFromLink(link: string): string | null {
    // Farklı link formatlarını destekle
    const patterns = [
      /\/meeting\/join\/([a-f0-9-]+)/i,  // /meeting/join/guid
      /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i  // Sadece GUID
    ];

    for (const pattern of patterns) {
      const match = link.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  private linkValidator() {
    return (control: any) => {
      const link = control.value;
      if (!link) {
        return null;
      }

      // Basit link kontrolü
      const isValidLink = link.includes('meeting/join') || 
                         /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i.test(link);
      
      return isValidLink ? null : { invalidLink: true };
    };
  }

  private markFormGroupTouched(): void {
    Object.keys(this.joinForm.controls).forEach(key => {
      const control = this.joinForm.get(key);
      control?.markAsTouched();
    });
  }

  onPaste(event: any): void {
    // Paste event'ini yakala ve formu güncelle
    setTimeout(() => {
      const pastedText = event.clipboardData?.getData('text') || '';
      if (pastedText) {
        this.joinForm.patchValue({ meetingLink: pastedText });
      }
    }, 100);
  }
} 
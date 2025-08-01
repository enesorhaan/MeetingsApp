import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
}

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts; trackBy: trackByFn"
        class="toast toast-{{ toast.type }}"
        [@slideInOut]
      >
        <span class="toast-icon">
          {{ getIcon(toast.type) }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" (click)="removeToast(toast.id)">✕</button>
      </div>
    </div>
  `,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ],
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      max-width: 400px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-weight: 500;
      font-size: 14px;
      min-width: 300px;
      pointer-events: auto;
      color: white;
    }

    .toast-success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .toast-error {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    }

    .toast-warning {
      background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
      color: #212529;
    }

    .toast-info {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    }

    .toast-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      line-height: 1.4;
    }

    .toast-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: inherit;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .toast-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .toast-container {
        right: 10px;
        left: 10px;
        max-width: none;
      }
      
      .toast {
        min-width: auto;
      }
    }
  `]
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private eventListener: any;

  ngOnInit(): void {
    this.eventListener = (event: any) => {
      if (event.detail && event.detail.message && event.detail.type) {
        this.showToast({
          type: event.detail.type,
          message: event.detail.message,
          duration: 4000
        });
      }
    };
    
    window.addEventListener('showToast', this.eventListener);
  }

  ngOnDestroy(): void {
    if (this.eventListener) {
      window.removeEventListener('showToast', this.eventListener);
    }
  }

  showToast(toastData: { type: string; message: string; duration: number }): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      type: toastData.type as 'success' | 'error' | 'warning' | 'info',
      message: toastData.message,
      duration: toastData.duration
    };

    this.toasts.push(toast);

    // Otomatik kaldırma
    setTimeout(() => {
      this.removeToast(toast.id);
    }, toast.duration);
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💬';
    }
  }

  trackByFn(index: number, item: ToastMessage): string {
    return item.id;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
} 
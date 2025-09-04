import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Observable } from 'rxjs';
import { Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification$ | async as notification" 
         class="notification-container"
         [ngClass]="'notification-' + notification.type">
      <div class="notification-content">
        <div class="notification-icon">
          <i [ngClass]="getIconClass(notification.type)"></i>
        </div>
        <div class="notification-message">
          {{ notification.message }}
        </div>
        <button class="notification-close" (click)="close()" aria-label="Close notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notification-progress" [ngClass]="'progress-' + notification.type"></div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 24px;
      right: 24px;
      min-width: 350px;
      max-width: 450px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      z-index: 1050;
      overflow: hidden;
      animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      position: relative;
    }

    .notification-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      font-size: 16px;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .notification-message {
      flex: 1;
      color: #1e293b;
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.5;
      margin-top: 2px;
    }

    .notification-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: rgba(100, 116, 139, 0.1);
      border: none;
      border-radius: 8px;
      color: #64748b;
      cursor: pointer;
      font-size: 14px;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .notification-close:hover {
      background: rgba(100, 116, 139, 0.2);
      color: #1e293b;
      transform: scale(1.05);
    }

    .notification-progress {
      height: 3px;
      width: 100%;
      background: rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .notification-progress::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      transform: translateX(-100%);
      animation: progressBar 4s linear;
    }

    /* Success variant */
    .notification-success .notification-icon {
      background: rgba(5, 150, 105, 0.1);
      color: #059669;
    }

    .notification-success .notification-progress::after {
      background: linear-gradient(90deg, #059669, #10b981);
    }

    /* Error variant */
    .notification-error .notification-icon {
      background: rgba(220, 38, 38, 0.1);
      color: #dc2626;
    }

    .notification-error .notification-progress::after {
      background: linear-gradient(90deg, #dc2626, #ef4444);
    }

    /* Warning variant */
    .notification-warning .notification-icon {
      background: rgba(217, 119, 6, 0.1);
      color: #d97706;
    }

    .notification-warning .notification-progress::after {
      background: linear-gradient(90deg, #d97706, #f59e0b);
    }

    /* Info variant */
    .notification-info .notification-icon {
      background: rgba(37, 99, 235, 0.1);
      color: #2563eb;
    }

    .notification-info .notification-progress::after {
      background: linear-gradient(90deg, #2563eb, #3b82f6);
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes progressBar {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .notification-container {
        top: 88px;
        right: 16px;
        left: 16px;
        min-width: auto;
        max-width: none;
        border-radius: 12px;
      }

      .notification-content {
        padding: 16px;
        gap: 12px;
      }

      .notification-icon {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }

      .notification-message {
        font-size: 0.9rem;
      }

      .notification-close {
        width: 28px;
        height: 28px;
        font-size: 12px;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .notification-container {
        border-width: 2px;
        border-color: #000;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .notification-container {
        animation: none;
      }
      
      .notification-progress::after {
        animation: none;
      }
      
      .notification-close,
      .notification-icon {
        transition: none;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .notification-container {
        background: rgba(30, 41, 59, 0.95);
        border-color: rgba(30, 41, 59, 0.2);
      }

      .notification-message {
        color: #f1f5f9;
      }

      .notification-close {
        background: rgba(148, 163, 184, 0.1);
        color: #94a3b8;
      }

      .notification-close:hover {
        background: rgba(148, 163, 184, 0.2);
        color: #f1f5f9;
      }

      .notification-progress {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  `],
  animations: [
    // You can add Angular animations here if needed
  ]
})
export class NotificationComponent {
  notification$: Observable<Notification | null>;

  constructor(private notificationService: NotificationService) {
    this.notification$ = this.notificationService.notification$;
  }

  close() {
    this.notificationService.clear();
  }

  getIconClass(type: string): string {
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return iconMap[type as keyof typeof iconMap] || 'fas fa-info-circle';
  }
}
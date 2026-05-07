import { Injectable, inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AppStore, Notification } from '../store/app.store';
import { AuthService } from '@farmeasy/shared-auth';

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private readonly appStore = inject(AppStore);
  private readonly authService = inject(AuthService);
  private ws: WebSocket | null = null;
  private readonly destroy$ = new Subject<void>();

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const token = this.authService.getAccessToken();
    if (!token) return;

    const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/notifications?token=${token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => this.appStore.setWsConnected(true);

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const notification = JSON.parse(event.data as string) as Notification;
        this.appStore.addNotification(notification);
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.appStore.setWsConnected(false);
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}

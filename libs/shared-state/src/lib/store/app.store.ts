import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { computed } from '@angular/core';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  notifications: Notification[];
  wsConnected: boolean;
  sidenavOpen: boolean;
  globalLoading: boolean;
}

const initialState: AppState = {
  notifications: [],
  wsConnected: false,
  sidenavOpen: true,
  globalLoading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    unreadCount: computed(() => store.notifications().filter((n) => !n.read).length),
    unreadNotifications: computed(() => store.notifications().filter((n) => !n.read)),
  })),
  withMethods((store) => {
    type Updater = (s: Partial<AppState>) => void;
    const update = () => (store as unknown as { $update: Updater }).$update;

    return {
      addNotification(notification: Notification): void {
        update()?.({ notifications: [notification, ...store.notifications()] });
      },
      markAllRead(): void {
        update()?.({ notifications: store.notifications().map((n) => ({ ...n, read: true })) });
      },
      markRead(id: string): void {
        update()?.({
          notifications: store.notifications().map((n) => (n.id === id ? { ...n, read: true } : n)),
        });
      },
      setWsConnected(connected: boolean): void {
        update()?.({ wsConnected: connected });
      },
      toggleSidenav(): void {
        update()?.({ sidenavOpen: !store.sidenavOpen() });
      },
      setSidenavOpen(open: boolean): void {
        update()?.({ sidenavOpen: open });
      },
      setGlobalLoading(loading: boolean): void {
        update()?.({ globalLoading: loading });
      },
    };
  })
);

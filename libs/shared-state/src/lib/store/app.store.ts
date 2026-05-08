import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
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
  withMethods((store) => ({
    addNotification(notification: Notification): void {
      patchState(store, { notifications: [notification, ...store.notifications()] });
    },
    markAllRead(): void {
      patchState(store, { notifications: store.notifications().map((n) => ({ ...n, read: true })) });
    },
    markRead(id: string): void {
      patchState(store, {
        notifications: store.notifications().map((n) => (n.id === id ? { ...n, read: true } : n)),
      });
    },
    setWsConnected(connected: boolean): void {
      patchState(store, { wsConnected: connected });
    },
    toggleSidenav(): void {
      patchState(store, { sidenavOpen: !store.sidenavOpen() });
    },
    setSidenavOpen(open: boolean): void {
      patchState(store, { sidenavOpen: open });
    },
    setGlobalLoading(loading: boolean): void {
      patchState(store, { globalLoading: loading });
    },
  }))
);

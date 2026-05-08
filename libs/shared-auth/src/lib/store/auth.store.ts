import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { CurrentUser, Tenant, TokenPair } from '../models/auth.models';

interface AuthState {
  currentUser: CurrentUser | null;
  tenant: Tenant | null;
  tokens: TokenPair | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  tenant: null,
  tokens: null,
  isLoading: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => store.currentUser() !== null),
    userRole: computed(() => store.currentUser()?.role ?? null),
    accessToken: computed(() => store.tokens()?.accessToken ?? null),
    tenantId: computed(() => store.currentUser()?.tenantId ?? null),
    displayName: computed(() => store.currentUser()?.name ?? ''),
  })),
  withMethods((store) => ({
    setAuth(user: CurrentUser, tenant: Tenant, tokens: TokenPair): void {
      patchState(store, { currentUser: user, tenant, tokens, isLoading: false });
    },
    clearAuth(): void {
      patchState(store, { currentUser: null, tenant: null, tokens: null });
    },
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    updateTokens(tokens: TokenPair): void {
      patchState(store, { tokens });
    },
  }))
);

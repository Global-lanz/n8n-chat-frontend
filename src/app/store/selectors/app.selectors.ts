import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, AuthState, MessagesState, ConfigState, AdminState } from '../reducers/app.reducer';

// Feature Selectors
export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectMessagesState = createFeatureSelector<MessagesState>('messages');
export const selectConfigState = createFeatureSelector<ConfigState>('config');
export const selectAdminState = createFeatureSelector<AdminState>('admin');

// Auth Selectors
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => !!user
);

export const selectIsAdmin = createSelector(
  selectCurrentUser,
  (user) => user?.is_admin ?? false
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// Messages Selectors
export const selectMessages = createSelector(
  selectMessagesState,
  (state) => state.messages
);

export const selectMessagesLoading = createSelector(
  selectMessagesState,
  (state) => state.loading
);

export const selectMessagesError = createSelector(
  selectMessagesState,
  (state) => state.error
);

// Config Selectors
export const selectConfig = createSelector(
  selectConfigState,
  (state) => state.config
);

export const selectBotName = createSelector(
  selectConfig,
  (config) => config?.botName ?? 'NorteIA'
);

export const selectConfigLoading = createSelector(
  selectConfigState,
  (state) => state.loading
);

// Admin Selectors
export const selectUsers = createSelector(
  selectAdminState,
  (state) => state.users
);

export const selectAdminLoading = createSelector(
  selectAdminState,
  (state) => state.loading
);

export const selectAdminError = createSelector(
  selectAdminState,
  (state) => state.error
);

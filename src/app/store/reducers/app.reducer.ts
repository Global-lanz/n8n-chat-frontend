import { createReducer, on } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';
import { User, Message, AppConfig } from '@core/models';

export interface AppState {
  auth: AuthState;
  messages: MessagesState;
  config: ConfigState;
  admin: AdminState;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export interface ConfigState {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Initial States
const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null
};

const initialMessagesState: MessagesState = {
  messages: [],
  loading: false,
  error: null
};

const initialConfigState: ConfigState = {
  config: null,
  loading: false,
  error: null
};

const initialAdminState: AdminState = {
  users: [],
  loading: false,
  error: null
};

// Auth Reducer
export const authReducer = createReducer(
  initialAuthState,
  on(AppActions.login, AppActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AppActions.loginSuccess, AppActions.registerSuccess, AppActions.updateUsernameSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AppActions.loginFailure, AppActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AppActions.logout, () => initialAuthState)
);

// Messages Reducer
export const messagesReducer = createReducer(
  initialMessagesState,
  on(AppActions.loadMessages, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AppActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages,
    loading: false,
    error: null
  })),
  on(AppActions.loadMessagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AppActions.addMessage, AppActions.receiveMessage, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  })),
  on(AppActions.sendMessage, (state) => ({
    ...state,
    loading: true
  })),
  on(AppActions.sendMessageSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(AppActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

// Config Reducer
export const configReducer = createReducer(
  initialConfigState,
  on(AppActions.loadConfig, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AppActions.loadConfigSuccess, (state, { config }) => ({
    ...state,
    config,
    loading: false,
    error: null
  })),
  on(AppActions.loadConfigFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

// Admin Reducer
export const adminReducer = createReducer(
  initialAdminState,
  on(AppActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AppActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null
  })),
  on(AppActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AppActions.createUser, AppActions.updateUser, AppActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AppActions.createUserSuccess, AppActions.updateUserSuccess, AppActions.deleteUserSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(AppActions.createUserFailure, AppActions.updateUserFailure, AppActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

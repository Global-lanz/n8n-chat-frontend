import { createAction, props } from '@ngrx/store';
import { User, Message, AppConfig } from '@core/models';

// Auth Actions
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ username: string; email: string; password: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const validateToken = createAction('[Auth] Validate Token');

export const updateUsername = createAction(
  '[Auth] Update Username',
  props<{ username: string }>()
);

export const updateUsernameSuccess = createAction(
  '[Auth] Update Username Success',
  props<{ user: User }>()
);

// Messages Actions
export const loadMessages = createAction('[Messages] Load Messages');

export const loadMessagesSuccess = createAction(
  '[Messages] Load Messages Success',
  props<{ messages: Message[] }>()
);

export const loadMessagesFailure = createAction(
  '[Messages] Load Messages Failure',
  props<{ error: string }>()
);

export const sendMessage = createAction(
  '[Messages] Send Message',
  props<{ content: string }>()
);

export const sendMessageSuccess = createAction('[Messages] Send Message Success');

export const sendMessageFailure = createAction(
  '[Messages] Send Message Failure',
  props<{ error: string }>()
);

export const addMessage = createAction(
  '[Messages] Add Message',
  props<{ message: Message }>()
);

export const receiveMessage = createAction(
  '[Messages] Receive Message',
  props<{ message: Message }>()
);

// Config Actions
export const loadConfig = createAction('[Config] Load Config');

export const loadConfigSuccess = createAction(
  '[Config] Load Config Success',
  props<{ config: AppConfig }>()
);

export const loadConfigFailure = createAction(
  '[Config] Load Config Failure',
  props<{ error: string }>()
);

// Admin Actions
export const loadUsers = createAction('[Admin] Load Users');

export const loadUsersSuccess = createAction(
  '[Admin] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[Admin] Load Users Failure',
  props<{ error: string }>()
);

export const createUser = createAction(
  '[Admin] Create User',
  props<{ username: string; email: string; password: string; licenseExpiresAt?: string | null; isAdmin?: boolean; isActive?: boolean }>()
);

export const createUserSuccess = createAction('[Admin] Create User Success');

export const createUserFailure = createAction(
  '[Admin] Create User Failure',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[Admin] Update User',
  props<{ userId: number; data: any }>()
);

export const updateUserSuccess = createAction('[Admin] Update User Success');

export const updateUserFailure = createAction(
  '[Admin] Update User Failure',
  props<{ error: string }>()
);

export const deleteUser = createAction(
  '[Admin] Delete User',
  props<{ userId: number }>()
);

export const deleteUserSuccess = createAction('[Admin] Delete User Success');

export const deleteUserFailure = createAction(
  '[Admin] Delete User Failure',
  props<{ error: string }>()
);

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as AppActions from '../actions/app.actions';
import { ApiService, AuthService, WebSocketService, NotificationService, ThemeService } from '@core/services';

@Injectable()
export class AppEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.login),
      switchMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map(user => AppActions.loginSuccess({ user })),
          catchError(error => {
            const errorMsg = error.error?.error || 'Erro ao fazer login';
            this.notificationService.error(errorMsg);
            return of(AppActions.loginFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.register),
      switchMap(({ username, email, password }) =>
        this.authService.register({ username, email, password }).pipe(
          map(user => AppActions.registerSuccess({ user })),
          catchError(error => {
            const errorMsg = error.error?.error || 'Erro ao fazer registro';
            this.notificationService.error(errorMsg);
            return of(AppActions.registerFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  validateToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.validateToken),
      switchMap(() =>
        this.authService.validateToken().pipe(
          map(() => {
            const user = this.authService.getCurrentUser();
            return user ? AppActions.validateTokenSuccess({ user }) : AppActions.validateTokenFailure();
          }),
          catchError(() => of(AppActions.validateTokenFailure()))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loginSuccess, AppActions.registerSuccess),
      tap(({ user }) => {
        // Apply user's theme preference
        if (user.theme) {
          this.themeService.setTheme(user.theme as any);
        }
        this.webSocketService.connect();
        this.router.navigate(['/chat']);
      })
    ),
    { dispatch: false }
  );

  validateTokenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.validateTokenSuccess),
      tap(({ user }) => {
        // Apply user's theme preference
        if (user.theme) {
          this.themeService.setTheme(user.theme as any);
        }
        this.webSocketService.connect();
      })
    ),
    { dispatch: false }
  );

  updateUsernameSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateUsernameSuccess),
      tap(({ user }) => {
        // Apply user's theme preference when updated
        if (user.theme) {
          this.themeService.setTheme(user.theme as any);
        }
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.logout),
      tap(() => {
        this.authService.logout();
        this.webSocketService.disconnect();
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  updateUsername$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateUsername),
      switchMap(({ username, theme }) =>
        this.apiService.updateUsername({ username, theme }).pipe(
          map(response => AppActions.updateUsernameSuccess({ user: response.user })),
          catchError(error => of(AppActions.loginFailure({ error: error.error?.error || 'Update failed' })))
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.changePassword),
      switchMap(({ currentPassword, newPassword }) =>
        this.apiService.changePassword({ currentPassword, newPassword }).pipe(
          map(() => {
            this.notificationService.success('Senha alterada com sucesso!');
            return AppActions.changePasswordSuccess();
          }),
          catchError(error => {
            const errorMsg = error.error?.error || 'Erro ao alterar senha';
            this.notificationService.error(errorMsg);
            return of(AppActions.changePasswordFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadMessages),
      switchMap(() =>
        this.apiService.getMessages().pipe(
          map(messages => AppActions.loadMessagesSuccess({ messages })),
          catchError(error => of(AppActions.loadMessagesFailure({ error: error.message })))
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.sendMessage),
      switchMap(({ content }) =>
        this.apiService.sendMessage({ content }).pipe(
          map(() => AppActions.sendMessageSuccess()),
          catchError(error => of(AppActions.sendMessageFailure({ error: error.message })))
        )
      )
    )
  );

  loadConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadConfig),
      switchMap(() =>
        this.apiService.getConfig().pipe(
          map(config => AppActions.loadConfigSuccess({ config })),
          catchError(error => of(AppActions.loadConfigFailure({ error: error.message })))
        )
      )
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUsers),
      switchMap(() =>
        this.apiService.getUsers().pipe(
          map(response => AppActions.loadUsersSuccess({ users: response.users })),
          catchError(error => of(AppActions.loadUsersFailure({ error: error.error?.error || 'Failed to load users' })))
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createUser),
      switchMap((action) =>
        this.apiService.createUser(action).pipe(
          map(() => {
            this.notificationService.success('Usuário criado com sucesso!');
            return AppActions.createUserSuccess();
          }),
          catchError(error => {
            const errorMsg = error.error?.error || 'Erro ao criar usuário';
            this.notificationService.error(errorMsg);
            return of(AppActions.createUserFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateUser),
      switchMap(({ userId, data }) =>
        this.apiService.updateUser(userId, data).pipe(
          map(() => {
            this.notificationService.success('Usuário atualizado com sucesso!');
            return AppActions.updateUserSuccess();
          }),
          catchError(error => {
            const errorMsg = error.error?.error || 'Erro ao atualizar usuário';
            this.notificationService.error(errorMsg);
            return of(AppActions.updateUserFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteUser),
      switchMap(({ userId }) =>
        this.apiService.deleteUser(userId).pipe(
          map(() => {
            this.notificationService.success('Usuário deletado com sucesso!');
            return AppActions.deleteUserSuccess();
          }),
          catchError(error => {
            const errorMsg = error.error?.error || 'Erro ao deletar usuário';
            this.notificationService.error(errorMsg);
            return of(AppActions.deleteUserFailure({ error: errorMsg }));
          })
        )
      )
    )
  );

  userModificationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createUserSuccess, AppActions.updateUserSuccess, AppActions.deleteUserSuccess),
      map(() => AppActions.loadUsers())
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private router: Router
  ) {}
}

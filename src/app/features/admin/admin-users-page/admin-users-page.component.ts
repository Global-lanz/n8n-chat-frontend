import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import * as AppActions from '@store/actions/app.actions';
import * as AppSelectors from '@store/selectors/app.selectors';
import { User } from '@core/models';
import { UserFormComponent } from '../user-form/user-form.component';
import { UsersTableComponent } from '../users-table/users-table.component';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, UserFormComponent, UsersTableComponent],
  templateUrl: './admin-users-page.component.html',
  styleUrls: ['./admin-users-page.component.css']
})
export class AdminUsersPageComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  
  showUserForm = false;
  editingUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private actions$: Actions) {
    this.users$ = this.store.select(AppSelectors.selectUsers);
    this.loading$ = this.store.select(AppSelectors.selectAdminLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadUsers());
    
    // Close form only on success
    this.actions$.pipe(
      ofType(AppActions.createUserSuccess, AppActions.updateUserSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onCancelForm();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onShowCreateForm(): void {
    this.editingUser = null;
    this.showUserForm = true;
  }

  onEditUser(user: User): void {
    this.editingUser = user;
    this.showUserForm = true;
  }

  onSaveUser(data: any): void {
    if (this.editingUser) {
      this.store.dispatch(AppActions.updateUser({ 
        userId: this.editingUser.id, 
        data 
      }));
    } else {
      this.store.dispatch(AppActions.createUser({
        username: data.username,
        email: data.email,
        password: data.password,
        licenseExpiresAt: data.licenseExpiresAt,
        isAdmin: data.isAdmin,
        isActive: data.isActive
      }));
    }
  }

  onCancelForm(): void {
    this.showUserForm = false;
    this.editingUser = null;
  }

  onDeleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja deletar o usuário "${user.username}"?`)) {
      this.store.dispatch(AppActions.deleteUser({ userId: user.id }));
    }
  }
}

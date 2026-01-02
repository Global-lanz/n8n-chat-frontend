import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
export class AdminUsersPageComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  
  showUserForm = false;
  editingUser: User | null = null;

  constructor(private store: Store) {
    this.users$ = this.store.select(AppSelectors.selectUsers);
    this.loading$ = this.store.select(AppSelectors.selectAdminLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadUsers());
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
    console.log('onSaveUser called with data:', data);
    console.log('editingUser:', this.editingUser);
    
    if (this.editingUser) {
      this.store.dispatch(AppActions.updateUser({ 
        userId: this.editingUser.id, 
        data 
      }));
    } else {
      const actionData = {
        username: data.username,
        email: data.email,
        password: data.password,
        licenseExpiresAt: data.licenseExpiresAt,
        isAdmin: data.isAdmin,
        isActive: data.isActive
      };
      console.log('Dispatching createUser with:', actionData);
      this.store.dispatch(AppActions.createUser(actionData));
    }
    this.onCancelForm();
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

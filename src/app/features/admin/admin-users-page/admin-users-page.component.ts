import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, UserFormComponent, UsersTableComponent],
  templateUrl: './admin-users-page.component.html',
  styleUrls: ['./admin-users-page.component.css']
})
export class AdminUsersPageComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  
  // Filtro e Paginação
  searchFilter = signal<string>('');
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);
  allUsers = signal<User[]>([]);
  
  // Computed: Usuários filtrados
  filteredUsers = computed(() => {
    const filter = this.searchFilter().toLowerCase().trim();
    const users = this.allUsers();
    
    if (!filter) return users;
    
    return users.filter(user => 
      user.username.toLowerCase().includes(filter) ||
      user.email.toLowerCase().includes(filter)
    );
  });
  
  // Computed: Total de páginas
  totalPages = computed(() => {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage());
  });
  
  // Computed: Usuários da página atual
  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredUsers().slice(start, end);
  });
  
  showUserForm = false;
  editingUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private actions$: Actions) {
    this.users$ = this.store.select(AppSelectors.selectUsers);
    this.loading$ = this.store.select(AppSelectors.selectAdminLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(AppActions.loadUsers());
    
    // Subscribe to users
    this.users$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.allUsers.set(users);
    });
    
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

  onFilterChange(): void {
    // Reset para primeira página quando filtrar
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    // Mostrar até 5 páginas
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    // Ajustar start se estiver no final
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
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

import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '@core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() editingUser: User | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  showPassword = false;

  // Internal split date/time state
  private licenseDate = '';
  private licenseTime = '23:59';

  constructor(private fb: FormBuilder) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  ngOnChanges(): void {
    this.updateForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      licenseExpiresAt: [''],
      isAdmin: [false],
      isActive: [true]
    });
  }

  private updateForm(): void {
    if (this.editingUser) {
      if (this.editingUser.licenseExpiresAt) {
        const dt = this.formatDateTimeLocal(this.editingUser.licenseExpiresAt);
        this.licenseDate = dt.slice(0, 10);
        this.licenseTime = dt.slice(11, 16);
      } else {
        this.licenseDate = '';
        this.licenseTime = '23:59';
      }

      this.userForm.patchValue({
        username: this.editingUser.username,
        email: this.editingUser.email,
        licenseExpiresAt: this.licenseDate ? `${this.licenseDate}T${this.licenseTime}` : '',
        isAdmin: this.editingUser.isAdmin,
        isActive: this.editingUser.isActive
      });

      this.userForm.get('password')?.clearValidators();
    } else {
      this.licenseDate = '';
      this.licenseTime = '23:59';
      this.userForm.reset({ isActive: true, isAdmin: false });
      this.userForm.get('password')?.setValidators([Validators.required]);
    }

    this.userForm.get('password')?.updateValueAndValidity();
  }

  private formatDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  }

  // Split date/time helpers
  getLicenseDate(): string { return this.licenseDate; }
  getLicenseTime(): string { return this.licenseTime; }

  onDateChange(event: Event, part: 'date' | 'time'): void {
    const val = (event.target as HTMLInputElement).value;
    if (part === 'date') this.licenseDate = val;
    else this.licenseTime = val;
    const combined = this.licenseDate ? `${this.licenseDate}T${this.licenseTime || '23:59'}` : '';
    this.userForm.patchValue({ licenseExpiresAt: combined });
  }

  clearLicense(): void {
    this.licenseDate = '';
    this.licenseTime = '23:59';
    this.userForm.patchValue({ licenseExpiresAt: '' });
  }

  formatLicensePreview(): string {
    if (!this.licenseDate) return '';
    const dt = new Date(`${this.licenseDate}T${this.licenseTime || '23:59'}`);
    return dt.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const data: any = {
        username: formValue.username,
        email: formValue.email,
        licenseExpiresAt: formValue.licenseExpiresAt || null,
        isAdmin: formValue.isAdmin,
        isActive: formValue.isActive
      };
      
      // Include password if provided (required for creation, optional for editing)
      if (formValue.password && formValue.password.trim()) {
        data.password = formValue.password;
      }
      
      this.save.emit(data);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.userForm.get(field);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}

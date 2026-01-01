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
      license_expires_at: [''],
      is_admin: [false],
      is_active: [true]
    });
  }

  private updateForm(): void {
    if (this.editingUser) {
      const licenseExpires = this.editingUser.license_expires_at 
        ? this.formatDateTimeLocal(this.editingUser.license_expires_at)
        : '';
      
      this.userForm.patchValue({
        username: this.editingUser.username,
        email: this.editingUser.email,
        license_expires_at: licenseExpires,
        is_admin: this.editingUser.is_admin,
        is_active: this.editingUser.is_active
      });
      
      // Remove password requirement for editing
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset({
        is_active: true,
        is_admin: false
      });
      
      // Add password requirement for creating
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

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const data: any = {
        username: formValue.username,
        email: formValue.email,
        license_expires_at: formValue.license_expires_at || null,
        is_admin: formValue.is_admin,
        is_active: formValue.is_active
      };
      
      if (!this.editingUser && formValue.password) {
        data.password = formValue.password;
      }
      
      this.save.emit(data);
    }
  }
}

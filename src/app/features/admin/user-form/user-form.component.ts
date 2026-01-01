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
      licenseExpiresAt: [''],
      isAdmin: [false],
      isActive: [true]
    });
  }

  private updateForm(): void {
    if (this.editingUser) {
      const licenseExpires = this.editingUser.licenseExpiresAt 
        ? this.formatDateTimeLocal(this.editingUser.licenseExpiresAt)
        : '';
      
      this.userForm.patchValue({
        username: this.editingUser.username,
        email: this.editingUser.email,
        licenseExpiresAt: licenseExpires,
        isAdmin: this.editingUser.isAdmin,
        isActive: this.editingUser.isActive
      });
      
      // Remove password requirement for editing
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset({
        isActive: true,
        isAdmin: false
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
        licenseExpiresAt: formValue.licenseExpiresAt || null,
        isAdmin: formValue.isAdmin,
        isActive: formValue.isActive
      };
      
      if (!this.editingUser && formValue.password) {
        data.password = formValue.password;
      }
      
      this.save.emit(data);
    }
  }
}

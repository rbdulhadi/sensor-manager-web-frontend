import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, Role } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>{{ isEditMode ? 'Edit User' : 'Create New User' }}</h2>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username *</label>
            <input
              type="text"
              id="username"
              class="form-control"
              formControlName="username"
              [readonly]="isEditMode"
              required
            />
            <div *ngIf="userForm.get('username')?.hasError('required') && userForm.get('username')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              class="form-control"
              formControlName="email"
              required
            />
            <div *ngIf="userForm.get('email')?.hasError('required') && userForm.get('email')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Email is required
            </div>
            <div *ngIf="userForm.get('email')?.hasError('email') && userForm.get('email')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group" *ngIf="!isEditMode">
            <label for="password">Password *</label>
            <input
              type="password"
              id="password"
              class="form-control"
              formControlName="password"
              required
            />
            <div *ngIf="userForm.get('password')?.hasError('required') && userForm.get('password')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Password is required
            </div>
          </div>

          <div class="form-group" *ngIf="isEditMode">
            <label for="password">New Password (leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              class="form-control"
              formControlName="password"
            />
          </div>

          <div class="form-group">
            <label for="role">Role *</label>
            <select id="role" class="form-control" formControlName="role" required>
              <option value="">Select a role</option>
              <option value="READ_ONLY">Read Only</option>
              <option value="READ_WRITE">Read Write</option>
            </select>
            <div *ngIf="userForm.get('role')?.hasError('required') && userForm.get('role')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Role is required
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || loading">
              {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/users">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUser();
    } else {
      this.userForm.get('password')?.setValidators([Validators.required]);
    }
  }

  loadUser(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.userForm.patchValue({
            username: user.username,
            email: user.email,
            role: user.role
          });
        },
        error: (error) => {
          this.errorMessage = 'Failed to load user. Please try again.';
          console.error('Error loading user:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const formValue = this.userForm.value;
      
      const userData: User = {
        username: formValue.username,
        email: formValue.email,
        role: formValue.role
      };

      // Only include password if it's provided (for new users or when updating password)
      if (formValue.password) {
        userData.password = formValue.password;
      }

      if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.error?.message || 'Failed to update user. Please try again.';
            console.error('Error updating user:', error);
          }
        });
      } else {
        if (!userData.password) {
          this.errorMessage = 'Password is required for new users.';
          this.loading = false;
          return;
        }
        this.userService.registerUser(userData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.error?.message || 'Failed to create user. Please try again.';
            console.error('Error creating user:', error);
          }
        });
      }
    }
  }
}

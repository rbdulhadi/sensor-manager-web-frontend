import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDTO, Role } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Users</h2>
          <button class="btn btn-primary" routerLink="/users/new">
            Add New User
          </button>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <table class="table" *ngIf="!loading && users.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" [class.badge-readonly]="user.role === 'READ_ONLY'" [class.badge-readwrite]="user.role === 'READ_WRITE'">
                  {{ user.role }}
                </span>
              </td>
              <td class="table-actions">
                <button class="btn btn-secondary" (click)="editUser(user.id!)">Edit</button>
                <button class="btn btn-danger" (click)="deleteUser(user.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && users.length === 0" class="alert alert-info">
          No users found. Create one to get started!
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserListComponent implements OnInit {
  users: UserDTO[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again.';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  editUser(id: number): void {
    this.router.navigate(['/users', id, 'edit']);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user. Please try again.';
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}

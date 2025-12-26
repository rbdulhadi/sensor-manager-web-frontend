import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="header" *ngIf="isAuthenticated()">
      <h1>Sensor Manager</h1>
      <nav>
        <ul class="nav-links">
          <li><a routerLink="/sensors" routerLinkActive="active">Sensors</a></li>
          <li><a routerLink="/measurements" routerLinkActive="active">Measurements</a></li>
          <li><a routerLink="/users" routerLinkActive="active" *ngIf="isReadWrite()">Users</a></li>
        </ul>
      </nav>
      <div class="user-info">
        <span>{{ getUsername() }}</span>
        <button class="btn btn-secondary" (click)="logout()">Logout</button>
      </div>
    </div>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isReadWrite(): boolean {
    return this.authService.isReadWrite();
  }

  getUsername(): string {
    const user = this.authService.getUser();
    return user?.username || '';
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}

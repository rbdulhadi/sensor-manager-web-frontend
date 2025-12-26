import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SensorService } from '../../services/sensor.service';
import { AuthService } from '../../services/auth.service';
import { SensorDTO } from '../../models/sensor.model';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Sensors</h2>
          <button
            *ngIf="isReadWrite()"
            class="btn btn-primary"
            routerLink="/sensors/new"
          >
            Add New Sensor
          </button>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <table class="table" *ngIf="!loading && sensors.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th *ngIf="isReadWrite()">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let sensor of sensors">
              <td>{{ sensor.id }}</td>
              <td>{{ sensor.name }}</td>
              <td>{{ sensor.location }}</td>
              <td>{{ sensor.type }}</td>
              <td>
                <span class="badge" [class.badge-active]="sensor.active" [class.badge-inactive]="!sensor.active">
                  {{ sensor.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td *ngIf="isReadWrite()" class="table-actions">
                <button class="btn btn-secondary" (click)="editSensor(sensor.id!)">Edit</button>
                <button class="btn btn-danger" (click)="deleteSensor(sensor.id!)">Delete</button>
                <button class="btn btn-success" routerLink="/measurements/chart/{{ sensor.id }}">Chart</button>
              </td>
              <td *ngIf="!isReadWrite()">
                <button class="btn btn-success" routerLink="/measurements/chart/{{ sensor.id }}">Chart</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && sensors.length === 0" class="alert alert-info">
          No sensors found. Create one to get started!
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SensorListComponent implements OnInit {
  sensors: SensorDTO[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private sensorService: SensorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSensors();
  }

  loadSensors(): void {
    this.loading = true;
    this.errorMessage = '';
    this.sensorService.getAllSensors().subscribe({
      next: (data) => {
        this.sensors = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load sensors. Please try again.';
        this.loading = false;
        console.error('Error loading sensors:', error);
      }
    });
  }

  editSensor(id: number): void {
    this.router.navigate(['/sensors', id, 'edit']);
  }

  deleteSensor(id: number): void {
    if (confirm('Are you sure you want to delete this sensor?')) {
      this.sensorService.deleteSensor(id).subscribe({
        next: () => {
          this.loadSensors();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete sensor. Please try again.';
          console.error('Error deleting sensor:', error);
        }
      });
    }
  }

  isReadWrite(): boolean {
    return this.authService.isReadWrite();
  }
}

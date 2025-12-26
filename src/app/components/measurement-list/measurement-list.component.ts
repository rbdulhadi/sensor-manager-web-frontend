import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MeasurementService } from '../../services/measurement.service';
import { SensorService } from '../../services/sensor.service';
import { AuthService } from '../../services/auth.service';
import { MeasurementDTO } from '../../models/measurement.model';
import { SensorDTO } from '../../models/sensor.model';

@Component({
  selector: 'app-measurement-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Measurements</h2>
          <button
            *ngIf="isReadWrite()"
            class="btn btn-primary"
            routerLink="/measurements/new"
          >
            Add New Measurement
          </button>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <table class="table" *ngIf="!loading && measurements.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sensor</th>
              <th>Timestamp</th>
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
              <th *ngIf="isReadWrite()">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let measurement of measurements">
              <td>{{ measurement.id }}</td>
              <td>{{ getSensorName(measurement.sensorId) }}</td>
              <td>{{ formatDate(measurement.timestamp) }}</td>
              <td>{{ measurement.temperature }}</td>
              <td>{{ measurement.humidity }}</td>
              <td *ngIf="isReadWrite()" class="table-actions">
                <button class="btn btn-danger" (click)="deleteMeasurement(measurement.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="!loading && measurements.length === 0" class="alert alert-info">
          No measurements found. Create one to get started!
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MeasurementListComponent implements OnInit {
  measurements: MeasurementDTO[] = [];
  sensors: SensorDTO[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private measurementService: MeasurementService,
    private sensorService: SensorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSensors();
    this.loadMeasurements();
  }

  loadSensors(): void {
    this.sensorService.getAllSensors().subscribe({
      next: (data) => {
        this.sensors = data;
      },
      error: (error) => {
        console.error('Error loading sensors:', error);
      }
    });
  }

  loadMeasurements(): void {
    this.loading = true;
    this.errorMessage = '';
    this.measurementService.getAllMeasurements().subscribe({
      next: (data) => {
        this.measurements = data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load measurements. Please try again.';
        this.loading = false;
        console.error('Error loading measurements:', error);
      }
    });
  }

  getSensorName(sensorId: number): string {
    const sensor = this.sensors.find(s => s.id === sensorId);
    return sensor ? sensor.name : `Sensor ${sensorId}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  deleteMeasurement(id: number): void {
    if (confirm('Are you sure you want to delete this measurement?')) {
      this.measurementService.deleteMeasurement(id).subscribe({
        next: () => {
          this.loadMeasurements();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete measurement. Please try again.';
          console.error('Error deleting measurement:', error);
        }
      });
    }
  }

  isReadWrite(): boolean {
    return this.authService.isReadWrite();
  }
}

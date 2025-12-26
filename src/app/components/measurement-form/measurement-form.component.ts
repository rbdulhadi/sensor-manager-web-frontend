import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MeasurementService } from '../../services/measurement.service';
import { SensorService } from '../../services/sensor.service';
import { Measurement } from '../../models/measurement.model';
import { SensorDTO } from '../../models/sensor.model';

@Component({
  selector: 'app-measurement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Create New Measurement</h2>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form [formGroup]="measurementForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="sensorId">Sensor *</label>
            <select id="sensorId" class="form-control" formControlName="sensorId" required>
              <option value="">Select a sensor</option>
              <option *ngFor="let sensor of sensors" [value]="sensor.id">
                {{ sensor.name }} ({{ sensor.location }})
              </option>
            </select>
            <div *ngIf="measurementForm.get('sensorId')?.hasError('required') && measurementForm.get('sensorId')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Sensor is required
            </div>
          </div>

          <div class="form-group">
            <label for="timestamp">Timestamp *</label>
            <input
              type="datetime-local"
              id="timestamp"
              class="form-control"
              [value]="getCurrentDateTime()"
              (input)="onTimestampChange($event)"
              required
            />
            <div *ngIf="measurementForm.get('timestamp')?.hasError('required') && measurementForm.get('timestamp')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Timestamp is required
            </div>
          </div>

          <div class="form-group">
            <label for="temperature">Temperature (°C) *</label>
            <input
              type="number"
              id="temperature"
              class="form-control"
              formControlName="temperature"
              step="0.01"
              required
            />
            <div *ngIf="measurementForm.get('temperature')?.hasError('required') && measurementForm.get('temperature')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Temperature is required
            </div>
          </div>

          <div class="form-group">
            <label for="humidity">Humidity (%) *</label>
            <input
              type="number"
              id="humidity"
              class="form-control"
              formControlName="humidity"
              step="0.01"
              min="0"
              max="100"
              required
            />
            <div *ngIf="measurementForm.get('humidity')?.hasError('required') && measurementForm.get('humidity')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Humidity is required
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button type="submit" class="btn btn-primary" [disabled]="measurementForm.invalid || loading">
              {{ loading ? 'Creating...' : 'Create' }}
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/measurements">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class MeasurementFormComponent implements OnInit {
  measurementForm: FormGroup;
  sensors: SensorDTO[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private measurementService: MeasurementService,
    private sensorService: SensorService,
    private router: Router
  ) {
    this.measurementForm = this.fb.group({
      sensorId: ['', Validators.required],
      timestamp: [this.getCurrentDateTime(), Validators.required],
      temperature: ['', [Validators.required]],
      humidity: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loadSensors();
  }

  loadSensors(): void {
    this.sensorService.getActiveSensors().subscribe({
      next: (data) => {
        this.sensors = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load sensors. Please try again.';
        console.error('Error loading sensors:', error);
      }
    });
  }

  getCurrentDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  onTimestampChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isoString = new Date(target.value).toISOString();
    this.measurementForm.patchValue({ timestamp: isoString });
  }

  onSubmit(): void {
    if (this.measurementForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const formValue = this.measurementForm.value;
      
      // Convert timestamp to ISO string format
      const timestamp = new Date(formValue.timestamp).toISOString();
      
      const measurementData: Measurement = {
        sensorId: +formValue.sensorId,
        timestamp: timestamp,
        temperature: +formValue.temperature,
        humidity: +formValue.humidity
      };

      this.measurementService.createMeasurement(measurementData).subscribe({
        next: () => {
          this.router.navigate(['/measurements']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to create measurement. Please try again.';
          console.error('Error creating measurement:', error);
        }
      });
    }
  }
}

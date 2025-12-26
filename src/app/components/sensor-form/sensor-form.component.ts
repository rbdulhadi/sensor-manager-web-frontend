import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SensorService } from '../../services/sensor.service';
import { Sensor, SensorType } from '../../models/sensor.model';

@Component({
  selector: 'app-sensor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>{{ isEditMode ? 'Edit Sensor' : 'Create New Sensor' }}</h2>
        </div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <form [formGroup]="sensorForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name *</label>
            <input
              type="text"
              id="name"
              class="form-control"
              formControlName="name"
              required
            />
            <div *ngIf="sensorForm.get('name')?.hasError('required') && sensorForm.get('name')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Name is required
            </div>
          </div>

          <div class="form-group">
            <label for="location">Location *</label>
            <input
              type="text"
              id="location"
              class="form-control"
              formControlName="location"
              required
            />
            <div *ngIf="sensorForm.get('location')?.hasError('required') && sensorForm.get('location')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Location is required
            </div>
          </div>

          <div class="form-group">
            <label for="type">Type *</label>
            <select id="type" class="form-control" formControlName="type" required>
              <option value="">Select a type</option>
              <option value="OUTDOOR">Outdoor</option>
              <option value="INDOOR">Indoor</option>
              <option value="WATER">Water</option>
            </select>
            <div *ngIf="sensorForm.get('type')?.hasError('required') && sensorForm.get('type')?.touched" class="alert alert-error" style="margin-top: 0.5rem; padding: 0.5rem;">
              Type is required
            </div>
          </div>

          <div class="form-group">
            <label>
              <input
                type="checkbox"
                formControlName="active"
              />
              Active
            </label>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button type="submit" class="btn btn-primary" [disabled]="sensorForm.invalid || loading">
              {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
            <button type="button" class="btn btn-secondary" routerLink="/sensors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class SensorFormComponent implements OnInit {
  sensorForm: FormGroup;
  isEditMode: boolean = false;
  sensorId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  sensorTypes = Object.values(SensorType);

  constructor(
    private fb: FormBuilder,
    private sensorService: SensorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sensorForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.sensorId = +id;
      this.loadSensor();
    }
  }

  loadSensor(): void {
    if (this.sensorId) {
      this.sensorService.getSensorById(this.sensorId).subscribe({
        next: (sensor) => {
          this.sensorForm.patchValue({
            name: sensor.name,
            location: sensor.location,
            type: sensor.type,
            active: sensor.active
          });
        },
        error: (error) => {
          this.errorMessage = 'Failed to load sensor. Please try again.';
          console.error('Error loading sensor:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.sensorForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const sensorData: Sensor = this.sensorForm.value;

      if (this.isEditMode && this.sensorId) {
        this.sensorService.updateSensor(this.sensorId, sensorData).subscribe({
          next: () => {
            this.router.navigate(['/sensors']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Failed to update sensor. Please try again.';
            console.error('Error updating sensor:', error);
          }
        });
      } else {
        this.sensorService.createSensor(sensorData).subscribe({
          next: () => {
            this.router.navigate(['/sensors']);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = 'Failed to create sensor. Please try again.';
            console.error('Error creating sensor:', error);
          }
        });
      }
    }
  }
}

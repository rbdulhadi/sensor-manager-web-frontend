import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { MeasurementService } from '../../services/measurement.service';
import { SensorService } from '../../services/sensor.service';
import { MeasurementDTO } from '../../models/measurement.model';
import { SensorDTO } from '../../models/sensor.model';

@Component({
  selector: 'app-measurement-chart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Measurement Chart - {{ sensorName }}</h2>
          <button class="btn btn-secondary" routerLink="/sensors">Back to Sensors</button>
        </div>

        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Time Range:</label>
          <select class="form-control" (change)="onTimeRangeChange($event)" [value]="selectedRange">
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>

        <div class="chart-container" *ngIf="!loading && measurements.length > 0">
          <canvas #chartCanvas></canvas>
        </div>

        <div *ngIf="!loading && measurements.length === 0" class="alert alert-info">
          No measurements found for the selected time range.
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MeasurementChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'line'> | null = null;
  
  sensorId: number = 0;
  sensorName: string = '';
  measurements: MeasurementDTO[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  selectedRange: string = '7';
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature and Humidity Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measurementService: MeasurementService,
    private sensorService: SensorService
  ) {}

  ngOnInit(): void {
    this.sensorId = +this.route.snapshot.paramMap.get('sensorId')!;
    this.loadSensor();
    this.loadMeasurements();
  }

  ngAfterViewInit(): void {
    // Chart will be created in updateChart when data is available
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  loadSensor(): void {
    this.sensorService.getSensorById(this.sensorId).subscribe({
      next: (sensor) => {
        this.sensorName = sensor.name;
      },
      error: (error) => {
        console.error('Error loading sensor:', error);
      }
    });
  }

  loadMeasurements(): void {
    this.loading = true;
    this.errorMessage = '';
    
    const days = parseInt(this.selectedRange);
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);
    
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    this.measurementService.getMeasurementsBySensorAndTimeRange(this.sensorId, startISO, endISO).subscribe({
      next: (data) => {
        this.measurements = data.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        this.updateChart();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load measurements. Please try again.';
        this.loading = false;
        console.error('Error loading measurements:', error);
      }
    });
  }

  onTimeRangeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedRange = target.value;
    this.loadMeasurements();
  }

  updateChart(): void {
    if (!this.chartCanvas?.nativeElement) {
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.measurements.map(m => {
      const date = new Date(m.timestamp);
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    });
    const temperatures = this.measurements.map(m => m.temperature);
    const humidities = this.measurements.map(m => m.humidity);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        },
        {
          label: 'Humidity (%)',
          data: humidities,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1
        }
      ]
    };

    // Create chart using Chart.js directly
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions
    });
  }
}

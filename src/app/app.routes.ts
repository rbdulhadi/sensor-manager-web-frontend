import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { readWriteGuard } from './guards/readwrite.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/sensors', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'sensors',
    loadComponent: () => import('./components/sensor-list/sensor-list.component').then(m => m.SensorListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'sensors/new',
    loadComponent: () => import('./components/sensor-form/sensor-form.component').then(m => m.SensorFormComponent),
    canActivate: [authGuard, readWriteGuard]
  },
  {
    path: 'sensors/:id/edit',
    loadComponent: () => import('./components/sensor-form/sensor-form.component').then(m => m.SensorFormComponent),
    canActivate: [authGuard, readWriteGuard]
  },
  {
    path: 'measurements',
    loadComponent: () => import('./components/measurement-list/measurement-list.component').then(m => m.MeasurementListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'measurements/new',
    loadComponent: () => import('./components/measurement-form/measurement-form.component').then(m => m.MeasurementFormComponent),
    canActivate: [authGuard, readWriteGuard]
  },
  {
    path: 'measurements/chart/:sensorId',
    loadComponent: () => import('./components/measurement-chart/measurement-chart.component').then(m => m.MeasurementChartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [authGuard, readWriteGuard]
  },
  {
    path: 'users/new',
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
    canActivate: [authGuard, readWriteGuard]
  },
  {
    path: 'users/:id/edit',
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
    canActivate: [authGuard, readWriteGuard]
  },
  { path: '**', redirectTo: '/sensors' }
];

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensor, SensorDTO, SensorType } from '../models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://localhost:8081/api/sensors';

  constructor(private http: HttpClient) {}

  getAllSensors(): Observable<SensorDTO[]> {
    return this.http.get<SensorDTO[]>(this.apiUrl);
  }

  getSensorById(id: number): Observable<SensorDTO> {
    return this.http.get<SensorDTO>(`${this.apiUrl}/${id}`);
  }

  createSensor(sensor: Sensor): Observable<SensorDTO> {
    return this.http.post<SensorDTO>(this.apiUrl, sensor);
  }

  updateSensor(id: number, sensor: Sensor): Observable<SensorDTO> {
    return this.http.put<SensorDTO>(`${this.apiUrl}/${id}`, sensor);
  }

  deleteSensor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSensorsByType(type: SensorType): Observable<SensorDTO[]> {
    return this.http.get<SensorDTO[]>(`${this.apiUrl}/type/${type}`);
  }

  getActiveSensors(): Observable<SensorDTO[]> {
    return this.http.get<SensorDTO[]>(`${this.apiUrl}/active`);
  }
}

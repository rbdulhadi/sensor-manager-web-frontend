import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Measurement, MeasurementDTO, AverageMeasurementDTO } from '../models/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private apiUrl = 'http://localhost:8081/api/measurements';

  constructor(private http: HttpClient) {}

  getAllMeasurements(): Observable<MeasurementDTO[]> {
    return this.http.get<MeasurementDTO[]>(this.apiUrl);
  }

  getMeasurementById(id: number): Observable<MeasurementDTO> {
    return this.http.get<MeasurementDTO>(`${this.apiUrl}/${id}`);
  }

  createMeasurement(measurement: Measurement): Observable<MeasurementDTO> {
    return this.http.post<MeasurementDTO>(this.apiUrl, measurement);
  }

  deleteMeasurement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMeasurementsBySensor(sensorId: number): Observable<MeasurementDTO[]> {
    return this.http.get<MeasurementDTO[]>(`${this.apiUrl}/sensor/${sensorId}`);
  }

  getMeasurementsBySensorAndTimeRange(
    sensorId: number,
    start: string,
    end: string
  ): Observable<MeasurementDTO[]> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<MeasurementDTO[]>(`${this.apiUrl}/sensor/${sensorId}/range`, { params });
  }

  getAverageMeasurements(
    sensorId: number,
    start: string,
    end: string
  ): Observable<AverageMeasurementDTO> {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<AverageMeasurementDTO>(`${this.apiUrl}/sensor/${sensorId}/averages`, { params });
  }
}

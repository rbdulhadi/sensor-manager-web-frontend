export interface Measurement {
  id?: number;
  sensorId: number;
  timestamp: string;
  temperature: number;
  humidity: number;
}

export interface MeasurementDTO {
  id?: number;
  sensorId: number;
  timestamp: string;
  temperature: number;
  humidity: number;
}

export interface AverageMeasurementDTO {
  averageTemperature: number;
  averageHumidity: number;
}

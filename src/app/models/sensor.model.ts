export enum SensorType {
  OUTDOOR = 'OUTDOOR',
  INDOOR = 'INDOOR',
  WATER = 'WATER'
}

export interface Sensor {
  id?: number;
  name: string;
  location: string;
  active: boolean;
  type: SensorType;
}

export interface SensorDTO {
  id?: number;
  name: string;
  location: string;
  active: boolean;
  type: SensorType;
}

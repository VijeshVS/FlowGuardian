export interface PipelineData {
  id: string;
  area: string;
  type: 'industrial' | 'domestic' | 'commercial';
  pressure1: number;
  pressure2: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
  location: string;
}

export interface PressureHistory {
  timestamp: string;
  pressure1: number;
  pressure2: number;
}

export interface AlertData {
  id: string;
  pipelineId: string;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: string;
}
import { PipelineData } from '../types';
import { generatePressureHistory } from '../utils/pressureData';

export const pipelineData: PipelineData[] = [
  {
    id: '1',
    area: 'North Industrial Zone',
    type: 'industrial',
    pressure1: 85,
    pressure2: 82,
    status: 'normal',
    lastUpdated: new Date().toISOString(),
    location: 'Sector A-1'
  },
  {
    id: '2',
    area: 'Downtown Residential',
    type: 'domestic',
    pressure1: 95,
    pressure2: 75,
    status: 'critical',
    lastUpdated: new Date().toISOString(),
    location: 'Block D-5'
  },
  {
    id: '3',
    area: 'Business District',
    type: 'commercial',
    pressure1: 88,
    pressure2: 78,
    status: 'warning',
    lastUpdated: new Date().toISOString(),
    location: 'Commercial Hub'
  }
];

export const pressureHistoryData = {
  '1': generatePressureHistory(85, 82),
  '2': generatePressureHistory(95, 75),
  '3': generatePressureHistory(88, 78),
};
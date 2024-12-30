import { PressureHistory } from '../types';

export const generatePressureHistory = (
  baseP1: number,
  baseP2: number,
  hours: number = 24
): PressureHistory[] => {
  const data: PressureHistory[] = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const variance1 = Math.sin(i * 0.5) * 3;
    const variance2 = Math.cos(i * 0.5) * 3;

    data.push({
      timestamp: time.toISOString(),
      pressure1: Math.round((baseP1 + variance1) * 10) / 10,
      pressure2: Math.round((baseP2 + variance2) * 10) / 10,
    });
  }

  return data;
};
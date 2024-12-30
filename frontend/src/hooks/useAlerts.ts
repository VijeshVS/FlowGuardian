import { useState, useEffect } from 'react';
import { AlertData, PipelineData } from '../types';

export const useAlerts = (pipelineData: PipelineData[]) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    // Generate alerts based on pipeline data
    const newAlerts = pipelineData
      .filter(pipeline => pipeline.status !== 'normal')
      .map(pipeline => ({
        id: `alert-${pipeline.id}`,
        pipelineId: pipeline.id,
        severity: pipeline.status as 'warning' | 'critical',
        message: getAlertMessage(pipeline),
        timestamp: new Date().toISOString()
      }));

    setAlerts(newAlerts);
  }, [pipelineData]);

  const dismissAlert = (alertId: string) => {
    setAlerts(current => current.filter(alert => alert.id !== alertId));
  };

  return { alerts, dismissAlert };
};

const getAlertMessage = (pipeline: PipelineData): string => {
  const pressureDiff = Math.abs(pipeline.pressure1 - pipeline.pressure2);
  
  if (pipeline.status === 'critical') {
    return `Critical pressure difference of ${pressureDiff} PSI detected in ${pipeline.area}`;
  }
  return `Warning: Unusual pressure variation in ${pipeline.area}`;
};
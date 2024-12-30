import React from 'react';
import { Activity, AlertTriangle, Gauge } from 'lucide-react';
import { PipelineData } from '../types';

interface QuickStatsProps {
  data: PipelineData[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ data }) => {
  const stats = {
    critical: data.filter(p => p.status === 'critical').length,
    warning: data.filter(p => p.status === 'warning').length,
    avgPressure: data.reduce((acc, p) => acc + (p.pressure1 + p.pressure2) / 2, 0) / data.length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Critical Alerts</p>
            <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Warning Alerts</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
          </div>
          <Activity className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Average Pressure</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(stats.avgPressure)} PSI
            </p>
          </div>
          <Gauge className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  );
};
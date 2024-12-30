import React from 'react';
import { AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';
import { PipelineData, PressureHistory } from '../types';
import { PressureGraph } from './PressureGraph';

interface StatusCardProps {
  pipeline: PipelineData;
  pressureHistory: PressureHistory[];
}

export const StatusCard: React.FC<StatusCardProps> = ({ pipeline, pressureHistory }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const pressureDiff = Math.abs(pipeline.pressure1 - pipeline.pressure2);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{pipeline.area}</h3>
          <p className="text-sm text-gray-600">{pipeline.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(pipeline.status)}`}>
          {getStatusIcon(pipeline.status)}
          {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Pressure 1</p>
          <p className="text-lg font-semibold">{pipeline.pressure1} PSI</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Pressure 2</p>
          <p className="text-lg font-semibold">{pipeline.pressure2} PSI</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Pressure Difference</p>
          <p className={`text-lg font-bold ${pressureDiff > 15 ? 'text-red-600' : 'text-gray-900'}`}>
            {pressureDiff} PSI
          </p>
        </div>
      </div>

      <PressureGraph data={pressureHistory} />

      <p className="text-xs text-gray-500 mt-4">
        Last updated: {new Date(pipeline.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};
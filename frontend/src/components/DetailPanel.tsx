import React from 'react';
import { Settings, AlertCircle, Droplets } from 'lucide-react';
import { PipelineData } from '../types';
import { calculatePressureDifference } from '../utils/pressureUtils';

interface DetailPanelProps {
  data: PipelineData;
}

export function DetailPanel({ data }: DetailPanelProps) {
  const pressureDiff = calculatePressureDifference(data.pressure1, data.pressure2);
  const isHighPressure = pressureDiff > 30;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">System Details</h3>
        <Settings className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Flow Rate</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-700">
            {(Math.random() * 100).toFixed(1)} L/s
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Temperature</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-700">
            {(20 + Math.random() * 10).toFixed(1)}°C
          </p>
        </div>
      </div>

      {isHighPressure && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="font-medium text-red-900">High Pressure Difference Detected</span>
          </div>
          <p className="mt-2 text-sm text-red-700">
            The pressure difference of {pressureDiff.toFixed(1)} PSI exceeds recommended limits. 
            Maintenance check recommended.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Last Maintenance</p>
          <p className="font-medium">2 days ago</p>
        </div>
        <div>
          <p className="text-gray-500">Next Inspection</p>
          <p className="font-medium">In 5 days</p>
        </div>
      </div>
    </div>
  );
}
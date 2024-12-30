import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { PressureHistory } from '../types';

interface PressureGraphProps {
  data: PressureHistory[];
}

export const PressureGraph: React.FC<PressureGraphProps> = ({ data }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-[200px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip
            labelFormatter={(label) => formatTime(label as string)}
            formatter={(value: number) => [`${value} PSI`]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="pressure1"
            stroke="#3b82f6"
            name="Pressure 1"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pressure2"
            stroke="#10b981"
            name="Pressure 2"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
import { PressureHistory } from '../types';

interface PressureGraphProps {
  data: PressureHistory[];
  height?: number;
}

export function PressureGraph({ data, height = 120 }: PressureGraphProps) {
  if (data.length < 2) return null;

  const maxPressure = Math.max(
    ...data.flatMap(d => [d.pressure1, d.pressure2])
  );
  const minPressure = Math.min(
    ...data.flatMap(d => [d.pressure1, d.pressure2])
  );
  const range = maxPressure - minPressure;
  const padding = range * 0.1; // Add 10% padding to the top and bottom
  
  const normalize = (value: number) => 
    ((value - (minPressure - padding)) / ((range + 2 * padding) || 1)) * (height - 20);

  const points1 = data.map((d, i) => 
    `${(i / (data.length - 1)) * 100},${height - 10 - normalize(d.pressure1)}`
  ).join(' ');
  
  const points2 = data.map((d, i) => 
    `${(i / (data.length - 1)) * 100},${height - 10 - normalize(d.pressure2)}`
  ).join(' ');

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 right-0 flex items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          FlowRate 1
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          FlowRate 2
        </div>
      </div>
      
      <svg width="100%" height={height} className="mt-6">
        {/* Grid lines */}
        <line x1="0" y1={height - 10} x2="100%" y2={height - 10} 
              stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
        <line x1="0" y1={(height - 10) / 2} x2="100%" y2={(height - 10) / 2} 
              stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
        
        {/* Pressure lines */}
        <polyline
          points={points1}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={points2}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
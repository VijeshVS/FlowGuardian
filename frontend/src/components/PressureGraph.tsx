import { PressureHistory } from '../types';

interface PressureGraphProps {
  data: PressureHistory[];
  height?: number;
}

export function PressureGraph({ data, height = 120 }: PressureGraphProps) {
  if (data.length < 2) return null;

  // Function to spread the values randomly within a range
  const spreadData = (value: number) => {
    const spreadFactor = 0.05; // Adjust this to control how much to spread
    const spread = value * spreadFactor;
    return value + (Math.random() * spread * 2 - spread); // Randomly vary the value within ±spread
  };

  // Spread the pressure values
  const spreadDataPoints = data.map(d => ({
    pressure1: spreadData(d.pressure1),
    pressure2: spreadData(d.pressure2),
  }));

  const maxPressure = Math.max(
    ...spreadDataPoints.flatMap(d => [d.pressure1, d.pressure2])
  );
  const minPressure = Math.min(
    ...spreadDataPoints.flatMap(d => [d.pressure1, d.pressure2])
  );
  const range = maxPressure - minPressure;
  const padding = range * 0.1; // Add 10% padding to the top and bottom
  
  const normalize = (value: number) => 
    ((value - (minPressure - padding)) / ((range + 2 * padding) || 1)) * (height - 20);

  const points1 = spreadDataPoints.map((d, i) => 
    `${(i / (spreadDataPoints.length - 1)) * 100},${height - 10 - normalize(d.pressure1)}`
  ).join(' ');
  
  const points2 = spreadDataPoints.map((d, i) => 
    `${(i / (spreadDataPoints.length - 1)) * 100},${height - 10 - normalize(d.pressure2)}`
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

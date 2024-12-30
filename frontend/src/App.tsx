import React from 'react';
import { Header } from './components/Header';
import { StatusCard } from './components/StatusCard';
import { DetailPanel } from './components/DetailPanel';
import { mockPipelineData } from './data';
import { useDataUpdates } from './hooks/useDataUpdates';

export function App() {
  const [pipelineData, setPipelineData] = React.useState([mockPipelineData[0]]);
  useDataUpdates(setPipelineData);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Pipeline Monitoring Dashboard</h2>
          <p className="text-gray-600 mt-2">Real-time pressure monitoring for North Industrial Zone</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StatusCard data={pipelineData[0]} />
          </div>
          <div>
            <DetailPanel data={pipelineData[0]} />
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { Activity, Factory, Home, Building2 } from 'lucide-react';
import { StatusCard } from './StatusCard';
import { QuickStats } from './QuickStats';
import { FilterBar } from './FilterBar';
import { AlertBanner } from './AlertBanner';
import { pipelineData, pressureHistoryData } from '../data/mockData';
import { useAlerts } from '../hooks/useAlerts';

export const Dashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { alerts, dismissAlert } = useAlerts(pipelineData);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'industrial':
        return <Factory className="w-5 h-5" />;
      case 'domestic':
        return <Home className="w-5 h-5" />;
      case 'commercial':
        return <Building2 className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const filteredData = pipelineData.filter(pipeline => {
    const matchesSearch = pipeline.area.toLowerCase().includes(search.toLowerCase()) ||
                         pipeline.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || pipeline.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">FlowGuardian</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                System Online
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alerts.map(alert => (
          <AlertBanner
            key={alert.id}
            alert={alert}
            onDismiss={dismissAlert}
          />
        ))}

        <QuickStats data={pipelineData} />
        
        <FilterBar
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((pipeline) => (
            <div key={pipeline.id}>
              <div className="mb-2 flex items-center">
                {getTypeIcon(pipeline.type)}
                <span className="ml-2 text-sm font-medium text-gray-600 capitalize">
                  {pipeline.type} Zone
                </span>
              </div>
              <StatusCard 
                pipeline={pipeline}
                pressureHistory={pressureHistoryData[pipeline.id]}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
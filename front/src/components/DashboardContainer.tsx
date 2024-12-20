// DashboardContainer.tsx
import React, { useState, useEffect } from 'react';
import Ventas from './Ventas';
import Comisiones from './Comisiones';


interface DashboardContainerProps {
  startDate: string;
  endDate: string;
  selectedUser: string;
  fetchMetricsData: (metric: string, start: string, end: string, userId?: string) => void;
  metricsData: any;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ startDate, endDate, selectedUser, fetchMetricsData, metricsData }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('ventas');

  return (
    <div className="w-full md:w-3/4 bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedMetric('ventas')}
          className={`w-full p-2 text-left rounded-md ${selectedMetric === 'ventas' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Ventas
        </button>
        <button
          onClick={() => setSelectedMetric('comisiones')}
          className={`w-full p-2 text-left rounded-md ${selectedMetric === 'comisiones' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Comisiones
        </button>
      </div>

      {/* Renderizar el componente correspondiente */}
      {selectedMetric === 'ventas' && <Ventas startDate={startDate} endDate={endDate} selectedUser={selectedUser} fetchMetricsData={fetchMetricsData} />}
      {selectedMetric === 'comisiones' && <Comisiones startDate={startDate} endDate={endDate} selectedUser={selectedUser} fetchMetricsData={fetchMetricsData} metricsData={metricsData} />}
    </div>
  );
};

export default DashboardContainer;

import React from 'react';
import Ventas from './Ventas';
import Comisiones from './Comisiones';

interface DashboardContainerProps {
  startDate: string;
  endDate: string;
  selectedUser: string;
  fetchMetricsData: (metric: string, start: string, end: string, userId?: string) => void;
  metricsData: any;
  selectedMetric: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  startDate,
  endDate,
  selectedUser,
  fetchMetricsData,
  metricsData,
  selectedMetric,
}) => {
  return (
    <div className="w-full md:w-3/4 bg-gray-800 shadow-md rounded-lg p-6">
      {/* Renderizar el componente correspondiente */}
      {selectedMetric === 'ventas' && (
        <Ventas startDate={startDate} endDate={endDate} selectedUser={selectedUser} fetchMetricsData={fetchMetricsData} />
      )}
      {selectedMetric === 'comisiones' && (
        <Comisiones startDate={startDate} endDate={endDate} selectedUser={selectedUser} fetchMetricsData={fetchMetricsData} metricsData={metricsData} />
      )}
    </div>
  );
};

export default DashboardContainer;

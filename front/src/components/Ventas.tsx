// Ventas.tsx
import React, { useState, useEffect } from 'react';

interface VentasProps {
  startDate: string;
  endDate: string;
  selectedUser: string;
  fetchMetricsData: (metric: string, start: string, end: string, userId?: string) => void;
}

const Ventas: React.FC<VentasProps> = ({ startDate, endDate, selectedUser, fetchMetricsData }) => {
  useEffect(() => {
    if (startDate && endDate) {
      fetchMetricsData('ventas', startDate, endDate, selectedUser);
    }
  }, [startDate, endDate, selectedUser, fetchMetricsData]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Métricas de Ventas</h2>
      {/* Aquí se mostrarían los datos de ventas */}
      <div className="bg-gray-700 p-4 rounded-md">
        <p>Datos de ventas estarán aquí...</p>
      </div>
    </div>
  );
};

export default Ventas;

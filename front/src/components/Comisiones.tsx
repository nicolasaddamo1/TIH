// Comisiones.tsx
import React, { useState, useEffect } from 'react';

interface ComisionesProps {
  startDate: string;
  endDate: string;
  selectedUser: string;
  fetchMetricsData: (metric: string, start: string, end: string, userId?: string) => void;
  metricsData: any; // Define el tipo adecuado para metricsData si es posible
}

const Comisiones: React.FC<ComisionesProps> = ({ startDate, endDate, selectedUser, fetchMetricsData, metricsData }) => {
  // Aquí puedes usar las propiedades
  useEffect(() => {
    if (startDate && endDate) {
      fetchMetricsData('comisiones', startDate, endDate, selectedUser);
    }
  }, [startDate, endDate, selectedUser, fetchMetricsData]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Métricas de Comisiones</h2>
      {/* Mostrar los datos de las comisiones */}
      <div className="bg-gray-700 p-4 rounded-md">
        {metricsData ? (
          <pre>{JSON.stringify(metricsData, null, 2)}</pre> // Muestra los datos en formato JSON para pruebas
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Comisiones;

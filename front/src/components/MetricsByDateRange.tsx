import React, { useState, useEffect } from 'react';

// Interfaces
interface Caja {
  id: string;
  fecha: string;
  total: number;
  detalles?: string;
}

const MetricsByDateRange: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCajasByDateRange = async () => {
    if (!startDate || !endDate) {
      alert('Selecciona un rango de fechas válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/caja/by-date-range?startDate=${startDate}&endDate=${endDate}`
      );
      if (response.ok) {
        const data: Caja[] = await response.json();
        setCajas(data);
      } else {
        alert('Error al obtener las métricas.');
      }
    } catch (error) {
      console.error('Error al obtener las métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Métricas por Rango de Fechas</h2>
        <form className="space-y-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />
          <button
            type="button"
            onClick={fetchCajasByDateRange}
            className="w-full p-3 rounded-md bg-blue-500 text-white"
          >
            Obtener Métricas
          </button>
        </form>

        {loading && <p className="text-white mt-4 text-center">Cargando...</p>}

        <div className="mt-6">
          <h3 className="text-xl text-white mb-2">Resultados</h3>
          {cajas.length === 0 ? (
            <p className="text-sm text-gray-400">No hay datos para el rango seleccionado.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1">
              {cajas.map((caja) => (
                <div
                  key={caja.id}
                  className="bg-gray-700 p-4 rounded-md text-white shadow-md"
                >
                  <p><strong>Fecha:</strong> {new Date(caja.fecha).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${caja.total.toFixed(2)}</p>
                  {caja.detalles && <p><strong>Detalles:</strong> {caja.detalles}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsByDateRange;

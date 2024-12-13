import React, { useState } from 'react';

interface Caja {
  id: string;
  fecha: string;
  precioTotal: number;
  cliente: string;
  medioPago: string;
  observaciones: string;
  productos: any[] | null; // Se ajustó para reflejar la estructura del backend
}

const MetricsByDateRange: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCajasByDateRange = async () => {
    if (!startDate || !endDate) {
      alert('Selecciona un rango de fechas válido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/caja/by-date-range?startDate=${startDate}&endDate=${endDate}`
      );
      if (response.ok) {
        const data: Caja[] = await response.json();
        setCajas(data);
      } else {
        const errorMsg = await response.text();
        setError(`Error del servidor: ${errorMsg}`);
      }
    } catch (err) {
      setError('Error al conectarse al servidor. Por favor, inténtalo de nuevo más tarde.');
      console.error('Error al obtener las métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-center text-2xl font-semibold text-white mb-4">
          Métricas por Rango de Fechas
        </h2>

        <form className="space-y-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={fetchCajasByDateRange}
            className="w-full p-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            Obtener Métricas
          </button>
        </form>

        {loading && <p className="text-white mt-4 text-center">Cargando...</p>}

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}

        <div className="mt-6">
          <h3 className="text-xl text-white mb-2">Resultados</h3>
          {cajas.length === 0 ? (
            <p className="text-sm text-gray-400">No hay datos para el rango seleccionado.</p>
          ) : (
            <div className="grid gap-4">
              {cajas.map((caja) => (
                <div
                  key={caja.id}
                  className="bg-gray-700 p-4 rounded-md text-white shadow-md"
                >
                  <p><strong>Fecha:</strong> {new Date(caja.fecha).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${caja.precioTotal? caja.precioTotal.toFixed(2) : 'N/A'}</p>
                  <p><strong>Cliente:</strong> {caja.cliente}</p>
                  <p><strong>Medio de Pago:</strong> {caja.medioPago}</p>
                  <p><strong>Observaciones:</strong> {caja.observaciones || 'N/A'}</p>
                  {caja.productos && caja.productos.length > 0 && (
                    <div>
                      <strong>Productos:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {caja.productos.map((producto, index) => (
                          <li key={index}>{producto.nombre || 'Producto sin nombre'}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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

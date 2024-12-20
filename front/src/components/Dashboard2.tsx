import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('ventas');
  const [metricsData, setMetricsData] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');  // Fecha de inicio
  const [endDate, setEndDate] = useState<string>('');  // Fecha de fin
  const navigate = useNavigate();

  // Función para obtener los datos según la métrica seleccionada
  const fetchMetricsData = async (metric: string, start: string, end: string) => {
    try {
        let response: Response | undefined;
        const token = localStorage.getItem('accessToken');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        switch (metric) {
            case 'ventas':
                console.log("start: ", start, "end: ", end);
                response = await fetch(`${import.meta.env.VITE_API_URL}/caja/by-date-range?startDate=${start}&endDate=${end}`, { headers });

                if (!response) {
                    throw new Error("No se recibió respuesta del servidor.");
                }

                if (!response.ok) {
                    const errorText = await response.text(); // Intenta obtener el mensaje de error del servidor
                    throw new Error(`Error en la respuesta: ${response.status} - ${errorText || 'Error desconocido'}`);
                }
                //Clonamos la respuesta para poder leerla mas de una vez
                const responseClone = response.clone();
                const data = await responseClone.json();
                console.log("data: ", data);
                setMetricsData(data);
                break;

            case 'comisiones':
                response = await fetch(`${import.meta.env.VITE_API_URL}/caja/comisiones?startDate=${start}&endDate=${end}`, { headers });
                if (!response) {
                    throw new Error("No se recibió respuesta del servidor.");
                }

                if (!response.ok) {
                    const errorText = await response.text(); // Intenta obtener el mensaje de error del servidor
                    throw new Error(`Error en la respuesta: ${response.status} - ${errorText || 'Error desconocido'}`);
                }
                const responseCloneComisiones = response.clone();
                const dataComisiones = await responseCloneComisiones.json();
                setMetricsData(dataComisiones);
                break;
            case 'pagos':
                response = await fetch(`${import.meta.env.VITE_API_URL}/caja/tipo-de-pago?startDate=${start}&endDate=${end}`, { headers });
                if (!response) {
                    throw new Error("No se recibió respuesta del servidor.");
                }

                if (!response.ok) {
                    const errorText = await response.text(); // Intenta obtener el mensaje de error del servidor
                    throw new Error(`Error en la respuesta: ${response.status} - ${errorText || 'Error desconocido'}`);
                }
                const responseClonePagos = response.clone();
                const dataPagos = await responseClonePagos.json();
                setMetricsData(dataPagos);
                break;
            default:
                break;
        }

    } catch (error) {
        console.error('Error al obtener las métricas:', error);
        alert(`Error al obtener las métricas: ${error}`); // Muestra un mensaje de alerta con el error
        setMetricsData(null);
    }
};

  // Función para manejar el envío de datos
  const handleSubmit = () => {
    if (startDate && endDate) {
      fetchMetricsData(selectedMetric, startDate, endDate);  // Llamada a la API con las fechas
    } else {
      alert('Por favor, ingresa ambas fechas.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-gray-800 p-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="text-white bg-red-600 px-4 py-2 rounded-md"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar de navegación */}
        <div className="w-full md:w-1/4 bg-gray-800 shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Métricas</h2>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setSelectedMetric('ventas')}
                className={`w-full p-2 text-left rounded-md ${selectedMetric === 'ventas' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Ventas
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedMetric('comisiones')}
                className={`w-full p-2 text-left rounded-md ${selectedMetric === 'comisiones' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Comisiones
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedMetric('pagos')}
                className={`w-full p-2 text-left rounded-md ${selectedMetric === 'pagos' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Pagos
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido de las métricas */}
        <div className="w-full md:w-3/4 bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {selectedMetric === 'ventas' && 'Métricas de Ventas'}
            {selectedMetric === 'comisiones' && 'Métricas de Comisiones'}
            {selectedMetric === 'pagos' && 'Métricas de Pagos'}
          </h2>

          {/* Filtros de fechas */}
          {selectedMetric === 'ventas' && (
            <div className="mb-4">
              <label className="block mb-2">Desde:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
              />
              <label className="block mt-4 mb-2">Hasta:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
              />
            </div>
          )}

          {/* Botón para enviar datos */}
          <div className="mb-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white p-2 rounded-md w-full"
            >
              Obtener Métricas
            </button>
          </div>

          {/* Mostrar datos de la métrica seleccionada */}
{metricsData ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {metricsData.map((item: any, index: number) => (
      <div key={index} className="bg-gray-700 p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-2">Detalle #{index + 1}</h3>
          <p><strong>Precio Total:</strong> {item.precioTotal}</p>
        <p><strong>Medio de Pago:</strong> {item.medioDePago}</p>
        <p><strong>Fecha:</strong> {item.fecha}</p>
        <p><strong>Observaciones:</strong> {item.observaciones || 'N/A'}</p>
        <p><strong>Comisión:</strong> {item.comision || 'N/A'}</p>
      </div>
    ))}
  </div>
) : (
  <p>Cargando métricas...</p>
)}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

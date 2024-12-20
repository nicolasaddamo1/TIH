import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Comisiones from './Comisiones';  // Asegúrate de que este import sea correcto
import MetodoDePago from './MetodoDePago';


interface Vendedor {
  id: string;
  nombre: string;
}

interface VendedoresState {
  [key: string]: string;
}

const Dashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('ventas');
  const [metricsData, setMetricsData] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [vendedoresNombres, setVendedoresNombres] = useState<VendedoresState>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (metricsData && Array.isArray(metricsData)) {
      const fetchVendedores = async () => {
        const nombresObj: VendedoresState = {};
        for (const item of metricsData) {
          if (!vendedoresNombres[item.vendedorId]) {
            // const nombre = await getVendedorNombre(item.vendedorId);
            // nombresObj[item.vendedorId] = nombre;
          }
        }
        setVendedoresNombres(prev => ({ ...prev, ...nombresObj }));
      };

      fetchVendedores();
    }
  }, [metricsData]);
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error al obtener usuarios: ${response.statusText}`);
        }
  
        const data = await response.json();
        setUsuarios(data); // Suponiendo que `data` es un array con usuarios que tienen `id` y `nombre`.
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        alert('Hubo un problema al cargar los usuarios.');
      }
    };
  
    fetchUsuarios();
  }, []);
  
  const fetchMetricsData = async (metric: string, start: string, end: string, userId?: string) => {
    try {
      let url = '';
      const token = localStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      switch (metric) {
        case 'comisiones':
          if (!userId) {
            alert('Por favor selecciona un usuario.');
            return;
          }
          url = `${import.meta.env.VITE_API_URL}/caja/comisiones?startDate=${start}&endDate=${end}&vendedorId=${userId}`;
          break;
        case 'ventas':
          url = `${import.meta.env.VITE_API_URL}/caja/by-date-range?startDate=${start}&endDate=${end}`;
          break;
        default:
          return;
      }
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta: ${response.status} - ${errorText || 'Error desconocido'}`);
      }

      const data = await response.json();
      
      setMetricsData(data);
    } catch (error) {
      console.error('Error al obtener las métricas:', error);
      alert(`Error al obtener las métricas: ${error}`);
      setMetricsData(null);
    }
  };

  
  const handleSubmit = () => {
    if (startDate && endDate) {
      fetchMetricsData(selectedMetric, startDate, endDate, selectedUser);
    } else {
      alert('Por favor, ingresa ambas fechas.');
    }
  };

const renderComisiones = () => {
  if (!metricsData || !Array.isArray(metricsData)) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricsData.map((item: any, index: number) => (
        <div key={index} className="bg-gray-700 p-4 rounded-md shadow-md">
          <p><strong>Total Comisión:</strong> {item.totalComision}</p>
          <h4 className="mt-4">Detalles:</h4>
          {item.ventas && item.ventas.map((venta: any) => (
            <div key={venta.id} className="mt-2 p-2 bg-gray-800 rounded-md">
              <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleDateString()}</p>
              <p><strong>Comisión:</strong> {venta.comision}</p>
              <p><strong>Tipo:</strong> {venta.tipoComision}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Luego el return principal
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
                onClick={() => setSelectedMetric('metodoDePago')}
                className={`w-full p-2 text-left rounded-md ${selectedMetric === 'metodoDePago' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Método de Pago
              </button>
          </li>
        </ul>
      </div>

      {/* Contenido de las métricas */}
      <div className="w-full md:w-3/4 bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {selectedMetric === 'ventas' && 'Métricas de Ventas'}
          {selectedMetric === 'comisiones' && 'Métricas de Comisiones'}
          {selectedMetric === 'metodoDePago' && 'Método de Pago'}
        </h2>

        {selectedMetric === 'comisiones' && (
          <div className="mb-4">
            {/* Selector de usuarios */}
            <label className="block mb-2">Seleccionar Usuario:</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md mb-4"
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>

            {/* Filtros de fecha */}
            <label className="block mb-2">Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md mb-4"
            />
            <label className="block mb-2">Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
            />
          </div>
        )}

        {/* Botón para enviar datos */}
        {selectedMetric === 'comisiones' && (
          <div className="mb-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white p-2 rounded-md w-full"
            >
              Obtener Comisiones
            </button>
          </div>
        )}

        {/* Renderizado de comisiones usando la función */}
        {selectedMetric === 'comisiones' && metricsData && renderComisiones()}

        {/* Para Ventas */}
        {selectedMetric === 'ventas' && (
          <div className="mb-4">
            {/* Filtros de fecha */}
            <label className="block mb-2">Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md mb-4"
            />
            <label className="block mb-2">Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
            />
          </div>
        )}

        {/* Botón para enviar datos de ventas */}
        {selectedMetric === 'ventas' && (
          <div className="mb-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white p-2 rounded-md w-full"
            >
              Obtener Ventas
            </button>
          </div>
        )}

        {/* Mostrar datos de ventas */}
        {selectedMetric === 'ventas' && metricsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricsData.map((venta: any, index: number) => (
              <div key={venta.id} className="bg-gray-700 p-4 rounded-md shadow-md">
                <p><strong>Precio Total:</strong> {venta.precioTotal}</p>
                <p><strong>Medio de Pago:</strong> {venta.medioDePago}</p>
                <p><strong>Fecha:</strong> {venta.fecha}</p>
                <p><strong>Observaciones:</strong> {venta.observaciones || 'Ninguna'}</p>
              </div>
            ))}
          </div>
        )}

        {selectedMetric === 'metodoDePago' && (
            <MetodoDePago startDate={startDate} endDate={endDate} />
          )}

      </div>
    </div>
  </div>
);}
export default Dashboard;

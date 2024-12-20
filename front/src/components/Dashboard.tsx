// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardContainer from './DashboardContainer';

const Dashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('ventas');
  const [metricsData, setMetricsData] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener usuarios para el selector
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
          throw new Error('Error al obtener la lista de usuarios.');
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
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
          </ul>
        </div>

        {/* Contenido de las métricas */}
        <DashboardContainer 
          startDate={startDate} 
          endDate={endDate} 
          selectedUser={selectedUser} 
          fetchMetricsData={fetchMetricsData} 
          metricsData={metricsData} 
        />
      </div>
    </div>
  );
};

export default Dashboard;

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

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    setMetricsData(null); // Limpia los datos para evitar conflictos
  };

  const renderVentasTable = () => {
    if (!metricsData || !Array.isArray(metricsData)) return null;

    const calcularTotal = () => {
      return metricsData.reduce((acc, venta) => acc + venta.precioTotal, 0);
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white">
          <thead className="text-xs text-white uppercase bg-gray-700">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Precio Total</th>
              <th className="px-6 py-3">Medio de Pago</th>
              <th className="px-6 py-3">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {metricsData.map((venta: any) => (
              <tr key={venta.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4">{new Date(venta.fecha).toLocaleDateString()}</td>
                <td className="px-6 py-4">${venta.precioTotal.toLocaleString()}</td>
                <td className="px-6 py-4">{venta.medioDePago}</td>
                <td className="px-6 py-4">{venta.observaciones || '-'}</td>
              </tr>
            ))}
            <tr className="bg-gray-700 font-bold">
              <td className="px-6 py-4">TOTAL</td>
              <td className="px-6 py-4">${calcularTotal().toLocaleString()}</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderComisionesTable = () => {
    if (!metricsData || !Array.isArray(metricsData)) return null;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white">
          <thead className="text-xs text-white uppercase bg-gray-700">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Comisión</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {metricsData.map((item: any) => (
              <>
                {item.ventas.map((venta: any) => (
                  <tr key={venta.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                    <td className="px-6 py-4">{new Date(venta.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4">${venta.comision.toLocaleString()}</td>
                    <td className="px-6 py-4">{venta.tipoComision}</td>
                    <td className="px-6 py-4">${item.totalComision.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-700 font-bold">
                  <td className="px-6 py-4">TOTAL COMISIÓN</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">${item.totalComision.toLocaleString()}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    );
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
        <div className="flex-shrink-0 w-64 bg-gray-800 shadow-md rounded-lg p-4">
        {/* <div className="w-full md:w-1/4 bg-gray-800 shadow-md rounded-lg p-4"> */}
          <h2 className="text-lg font-semibold mb-4">Métricas</h2>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => handleMetricChange('ventas')}
                className={`w-full p-2 text-left rounded-md ${selectedMetric === 'ventas' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Ventas
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMetricChange('comisiones')}
                className={`w-full p-2 text-left rounded-md ${selectedMetric === 'comisiones' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Comisiones
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMetricChange('metodoDePago')}
                className={`w-full p-2 text-left rounded-md ${selectedMetric === 'metodoDePago' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Método de Pago
              </button>
            </li>
          </ul>
        </div>
  
        {/* Contenido de las métricas */}
        <div className="flex-grow bg-gray-800 shadow-md rounded-lg p-6">
        {/* <div className="w-full md:w-3/4 bg-gray-800 shadow-md rounded-lg p-6"> */}
          <h2 className="text-2xl font-semibold mb-6">
            {selectedMetric === 'ventas' && 'Métricas de Ventas'}
            {selectedMetric === 'comisiones' && 'Métricas de Comisiones'}
            {selectedMetric === 'metodoDePago' && 'Método de Pago'}
          </h2>
  
          {/* Filtros y controles */}
          <div className="mb-6">
            {selectedMetric === 'comisiones' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2">Seleccionar Usuario:</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded-md"
                  >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Fecha</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
  
            {selectedMetric === 'ventas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Fecha</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
  
            {(selectedMetric === 'ventas' || selectedMetric === 'comisiones') && (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white p-2 rounded-md w-full mt-4"
              >
                {`Obtener ${selectedMetric === 'ventas' ? 'Ventas' : 'Comisiones'}`}
              </button>
            )}
          </div>
  
          {/* Tablas de datos */}
          {selectedMetric === 'ventas' && metricsData && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-gray-700">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Precio Total</th>
                    <th className="px-4 py-3">Medio de Pago</th>
                    <th className="px-4 py-3">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsData.map((venta: any, index: number) => (
                    <tr key={venta.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                      <td className="px-4 py-3">{new Date(venta.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-3">${venta.precioTotal.toLocaleString()}</td>
                      <td className="px-4 py-3">{venta.medioDePago}</td>
                      <td className="px-4 py-3">{venta.observaciones || '-'}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-700 font-bold">
                    <td className="px-4 py-3 bg-gray-600">Total</td>
                    <td className="px-4 py-3 bg-gray-600">
                      ${metricsData.reduce((acc: number, curr: any) => acc + curr.precioTotal, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 bg-gray-600"></td>
                    <td className="px-4 py-3 bg-gray-600"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
  
          {selectedMetric === 'comisiones' && metricsData && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-gray-700">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Comisión</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsData.map((item: any) => (
                    <>
                      {item.ventas.map((venta: any, index: number) => (
                        <tr key={venta.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}>
                          <td className="px-4 py-3">{new Date(venta.fecha).toLocaleDateString()}</td>
                          <td className="px-4 py-3">${venta.comision.toLocaleString()}</td>
                          <td className="px-4 py-3">{venta.tipoComision}</td>
                          <td className="px-4 py-3">${item.totalComision.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-700 font-bold">
                        <td className="px-4 py-3 bg-gray-600">Total Comisión</td>
                        <td className="px-4 py-3 bg-gray-600"></td>
                        <td className="px-4 py-3 bg-gray-600"></td>
                        <td className="px-4 py-3 bg-gray-600">${item.totalComision.toLocaleString()}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
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

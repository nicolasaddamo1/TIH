import React, { useState, useEffect } from 'react';

interface MetodoDePagoProps {
  startDate: string;
  endDate: string;
}

const MetodoDePagoTabla: React.FC<MetodoDePagoProps> = ({ startDate, endDate }) => {
  const [medioDePago, setMedioDePago] = useState<string>('');
  const [ventasData, setVentasData] = useState<any[]>([]);
  const [totalPrecio, setTotalPrecio] = useState<number>(0);
  const [localStartDate, setLocalStartDate] = useState<string>(startDate);
  const [localEndDate, setLocalEndDate] = useState<string>(endDate);

  useEffect(() => {
    if (localStartDate && localEndDate && medioDePago) {
      fetchVentasData(localStartDate, localEndDate, medioDePago);
    }
  }, [localStartDate, localEndDate, medioDePago]);

  const fetchVentasData = async (startDate: string, endDate: string, medioDePago: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/caja/tipo-de-pago?startDate=${startDate}&endDate=${endDate}&medioDePago=${medioDePago}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener ventas: ${response.statusText}`);
      }

      const data = await response.json();
      setVentasData(data);

      // Calcular la sumatoria de los precios
      const total = data.reduce((sum: number, venta: any) => sum + venta.precioTotal, 0);
      setTotalPrecio(total);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
      alert('Hubo un problema al cargar los datos de ventas.');
    }
  };

  const handleSubmit = () => {
    if (localStartDate && localEndDate && medioDePago) {
      fetchVentasData(localStartDate, localEndDate, medioDePago);
    } else {
      alert('Por favor, ingresa todas las fechas y selecciona el método de pago.');
    }
  };

  return (
    <div>
      <div className="w-full md:w-3/4 ">
        <label className="block mb-2">Seleccionar Método de Pago:</label>
        <select
          value={medioDePago}
          onChange={(e) => setMedioDePago(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-md"
        >
          <option value="">Seleccione un método de pago</option>
          <option value="MercadoPago">MercadoPago</option>
          <option value="CuentaDNI">CuentaDNI</option>
          <option value="Laura">Laura</option>
          <option value="Efectivo">Efectivo</option>
        </select>
      </div>

      {/* Filtros de fecha */}
      <label className="block mb-2">Desde:</label>
      <input
        type="date"
        value={localStartDate}
        onChange={(e) => setLocalStartDate(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded-md mb-4"
      />
      <label className="block mb-2">Hasta:</label>
      <input
        type="date"
        value={localEndDate}
        onChange={(e) => setLocalEndDate(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded-md mb-4"
      />

      {/* Botón para enviar datos */}
      <div className="mb-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 rounded-md w-full"
        >
          Obtener Ventas
        </button>
      </div>

      {/* Mostrar el total de los precios */}
      {ventasData && ventasData.length > 0 && (
        <div className="mt-6 bg-gray-800 p-4 rounded-md">
          <p className="text-xl font-semibold">Total Precio: {totalPrecio}</p>
        </div>
      )}

      {/* Mostrar datos en tabla */}
      {ventasData && ventasData.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full bg-gray-800 text-white border border-gray-600 rounded-md">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Precio Total</th>
                <th className="px-4 py-2">Medio de Pago</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasData.map((venta: any, index: number) => (
                <tr key={venta.id} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}>
                  <td className="px-4 py-2 text-center">{venta.id}</td>
                  <td className="px-4 py-2 text-center">{venta.precioTotal}</td>
                  <td className="px-4 py-2 text-center">{venta.medioDePago}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(venta.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {venta.observaciones || 'Ninguna'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MetodoDePagoTabla;

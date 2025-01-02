import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

interface Service {
  usuario: string; 
  descripcion: string;
  precioTotal: number;
  clienteId: string;
}

interface ClienteData {
  dni: string;
  nombre: string;
  apellido: string;
  direccion: string;
  nroTelefono: string;
  clienteId?: string;
}

const ServiceForm: React.FC = () => {
  const [service, setService] = useState<Service>({
    usuario: '',
    descripcion: '',
    precioTotal: 0,
    clienteId: '',
  });

  const [clienteDni, setClienteDni] = useState('');
  const [isNuevoCliente, setIsNuevoCliente] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [clienteData, setClienteData] = useState<ClienteData>({
    dni: '',
    nombre: '',
    apellido: '',
    direccion: '',
    nroTelefono: '',
  });

  // Obtener usuario desde el token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken: { sub: string } = jwtDecode(token);
        setService((prevService) => ({
          ...prevService,
          usuario: decodedToken.sub, // ID del usuario autenticado
        }));
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: name === 'precioTotal' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleClienteSearch = async () => {
    if (clienteDni) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/clientes/${clienteDni}`);
        if (response.data) {
          setClienteData(response.data);
          setService((prev) => ({ ...prev, clienteId: response.data.id }));
          alert('Cliente encontrado');
        }
      } catch (error) {
        console.error('Error buscando cliente:', error);
        alert('Cliente no encontrado');
      }
    }
  };

  const handleNuevoCliente = async () => {
    if (clienteData.dni && clienteData.nombre && clienteData.apellido) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/clientes`, clienteData);
        setClienteData(response.data);
        setService((prev) => ({ ...prev, clienteId: response.data.id }));
        alert('Cliente creado con éxito');
      } catch (error) {
        console.error('Error al crear el cliente:', error);
        alert('Error al crear el cliente');
      }
    } else {
      alert('Por favor complete todos los campos del cliente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service.descripcion || service.precioTotal <= 0 || !service.clienteId) {
      setMessage('Por favor, complete todos los campos requeridos.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setMessage('Error: No se encontró el token de autenticación.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        setMessage('Servicio registrado correctamente');
        setService((prevService) => ({
          usuario: prevService.usuario, // Mantén el usuario autenticado
          descripcion: '',
          precioTotal: 0,
          clienteId: '',
        }));
      } else {
        const errorResponse = await response.json();
        setMessage(`Error al registrar el servicio: ${errorResponse.message || response.statusText}`);
      }
    } catch (error) {
      setMessage('Error al registrar el servicio');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="col-span-1 p-4 bg-gray-900 rounded-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Información del Cliente</h2>
          <select
            onChange={(e) => setIsNuevoCliente(e.target.value === 'Nuevo')}
            className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
          >
            <option value="Registrado">Cliente ya Registrado</option>
            <option value="Nuevo">Cliente Nuevo</option>
          </select>

          {isNuevoCliente ? (
            <>
              <input
              type="text"
              placeholder="DNI"
              value={clienteData.dni}
              onChange={(e) => setClienteData({ ...clienteData, dni: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
            />
            <input
              type="text"
              placeholder="Nombre"
              value={clienteData.nombre}
              onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={clienteData.apellido}
              onChange={(e) => setClienteData({ ...clienteData, apellido: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={clienteData.direccion}
              onChange={(e) => setClienteData({ ...clienteData, direccion: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={clienteData.nroTelefono}
              onChange={(e) => setClienteData({ ...clienteData, nroTelefono: e.target.value })}
              className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
            />
              <button
                onClick={handleNuevoCliente}
                className="bg-green-500 w-full px-3 py-2 rounded-md text-white"
              >
                Crear Cliente
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Buscar Cliente por DNI"
                value={clienteDni}
                onChange={(e) => setClienteDni(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
              />
              <button
                onClick={handleClienteSearch}
                className="bg-blue-500 w-full px-3 py-2 rounded-md text-white"
              >
                Buscar Cliente
              </button>
            </>
          )}
        </div>

        <h2 className="text-center text-2xl font-semibold mb-4">Registrar Servicio</h2>
        {message && <p className="text-center text-lg text-red-500">{message}</p>}

        <form onSubmit={handleSubmit}>
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={service.descripcion}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />
          <input
            type="number"
            name="precioTotal"
            placeholder="Precio"
            value={service.precioTotal || ''}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />
          <button type="submit" className="bg-blue-500 w-full p-3 rounded-md text-white">
            Registrar Servicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;

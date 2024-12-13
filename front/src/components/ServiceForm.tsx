import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface Service {
  usuario: string;
  descripcion: string;
  precio: number;
}

const ServiceForm: React.FC = () => {
  const [service, setService] = useState<Service>({
    usuario: '',
    descripcion: '',
    precio: 0,
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Usa un nombre consistente
    console.log('Token:', token);
    if (token) {
      try {
        // Decodifica el token para obtener el usuario
        const decodedToken: { sub: string } = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        setService((prevService) => ({
          ...prevService,
          usuario: decodedToken.sub, // Ajusta según la estructura de tu token
        }));
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.warn('No se encontró un token válido.');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: name === 'precio' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setMessage('Error: No se encontró el token de autenticación.');
        return;
      }
      const decodedToken: { sub: string } = jwtDecode(token);

      console.log('Service to be sent:', service);  // Agrega un log para ver qué datos estás enviando
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(service),  // Aquí se está enviando el objeto `service`
      });
  
      if (response.ok) {
        setMessage('Servicio creado correctamente');
        setService({
          usuario: decodedToken.sub,  // Resetea el usuarioId en caso de ser necesario
          descripcion: '',
          precio: 0,
        });
      } else {
        const errorResponse = await response.json();
        setMessage(`Error al crear el servicio: ${errorResponse.message || response.statusText}`);
        console.error('Error:', errorResponse);
      }
    } catch (error) {
      setMessage('Error al crear el servicio');
      console.error(error);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Crear Servicio de Reparación</h2>
        {message && (
          <p className="text-center text-lg font-medium mb-4">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={service.descripcion}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={service.precio}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <button type="submit" className="w-full p-3 rounded-md bg-blue-500 text-white">
            Crear Servicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;

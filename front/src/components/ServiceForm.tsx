// src/components/ServiceForm.tsx
import React, { useState } from 'react';

interface Service {
  name: string;
  description: string;
  price: string;
  estimatedTime: string;
}

const ServiceForm: React.FC = () => {
  const [service, setService] = useState<Service>({
    name: '',
    description: '',
    price: '',
    estimatedTime: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService((prevService) => ({ ...prevService, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        setMessage('Servicio creado correctamente');
        setService({ name: '', description: '', price: '', estimatedTime: '' });
      } else {
        setMessage('Error al crear el servicio');
        console.error('Error:', response.statusText);
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
          <input
            type="text"
            name="name"
            placeholder="Nombre del servicio"
            value={service.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={service.description}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={service.price}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <input
            type="text"
            name="estimatedTime"
            placeholder="Tiempo estimado"
            value={service.estimatedTime}
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

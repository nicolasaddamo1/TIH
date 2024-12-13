import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que ambos campos estén completos
    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error en el inicio de sesión');
        return;
      }

      const data = await response.json();
      setSuccess(data.success || 'Inicio de sesión exitoso');

      // Guardar el token en localStorage
      const token = data.accessToken;
      localStorage.setItem('accessToken', token);

      // Decodificar el payload del token (opcional)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload del token:', payload);

      // Redirigir a la página de ventas
      navigate('/service');
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Inicio de Sesión</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-50 text-gray-800"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-50 text-gray-800"
          />
          <button type="submit" className="w-full p-3 rounded-md bg-blue-500 text-white">
            Iniciar Sesión
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default LoginForm;

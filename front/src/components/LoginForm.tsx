import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
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

      // Decodificar el payload del token (opcional, usando una librería como jwt-decode)
      const token = data.accessToken;
      const payload = JSON.parse(atob(token.split('.')[1]));

      console.log('Payload del token:', payload);
      // Extraer información del payload según lo necesario
      console.log('Nombre:', payload.nombre);
      console.log('Roles:', payload.roles);
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

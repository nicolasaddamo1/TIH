// src/components/LoginForm.tsx
import React from 'react';

const LoginForm: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Inicio de Sesión</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            className="w-full p-3 rounded-md bg-gray-50 text-gray-800"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-md bg-gray-50 text-gray-800"
          />
          <button type="submit" className="w-full p-3 rounded-md bg-blue-500 text-white">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

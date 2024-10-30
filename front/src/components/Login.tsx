"use client"; // Asegúrate de incluir esta línea para usar hooks en un componente de cliente

import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="glass p-8 w-full max-w-md rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6 text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 bg-white bg-opacity-70"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 bg-white bg-opacity-70"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

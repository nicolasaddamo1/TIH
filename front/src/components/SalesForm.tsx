import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Interfaces
interface Product {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen?: string;
}

interface JwtPayload {
  sub: string;
}

// Enums (copiados de tu descripción)
enum MedioDePago {
  EFECTIVO = 'Efectivo',
  MERCADOPAGO = 'MercadoPago',
  LAURA = 'Laura',
  CUENTADNI = 'CuentaDNI'
}

enum Comision {
  VENTA = 'Venta',
  SERVICIO = 'Servicio',
  CELULAR = 'Celular'
}

// Componente principal
const SalesForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [category, setCategory] = useState<'accesorios' | 'celulares'>('accesorios');

  // Nuevos estados para Caja
  const [medioDePago, setMedioDePago] = useState<MedioDePago>(MedioDePago.EFECTIVO);
  const [comision, setComision] = useState<Comision>(Comision.VENTA);
  const [clientType, setClientType] = useState<'nuevo' | 'agendado'>('agendado');
  const [clientDni, setClientDni] = useState<string>('');
  const [clientId, setClientId] = useState<string | null>(null);
  const [newClientData, setNewClientData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: ''
  });
  const [observaciones, setObservaciones] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Decodificar el JWT y obtener el userId
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setUserId(decoded.sub);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  // Obtener productos según la categoría seleccionada
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          category === 'accesorios'
            ? `${import.meta.env.VITE_API_URL}/producto`
            : `${import.meta.env.VITE_API_URL}/producto/celulares`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();
  }, [category]);

  // Buscar cliente por DNI
  const handleSearchClient = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clientes/${clientDni}`);
      if (response.ok) {
        const cliente = await response.json();
        alert('Cliente encontrado');
        setClientId(cliente.id);
      } else {
        alert('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
    }
  };

  // Crear nuevo cliente
  const handleCreateClient = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newClientData,
          dni: clientDni
        })
      });
      if (response.ok) {
        const cliente = await response.json().catch(()=>response);
        setClientId(cliente.id);
        alert('Cliente creado exitosamente');
      } else {
        alert('Error al crear cliente');
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  // Resto de funciones anteriores (handleProductSelect, handleAddToCart, etc.) se mantienen igual

  const handleSale = async () => {
    if (!userId || !clientId || cart.length === 0) {
      alert('Debes agregar productos al carrito, seleccionar un cliente y estar autenticado.');
      return;
    }
    try {
      // Preparar datos para crear Caja
      const cajaData = {
        precioTotal: calculateTotalPrice(),
        productos: cart.map(item => item.product.id),
        medioDePago,
        cliente: clientId,
        vendedor: userId,
        comision,
        observaciones,
        description
      };

      // Primero realizar la venta
      const ventaResponse = await fetch(`${import.meta.env.VITE_API_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      // Luego crear el registro de Caja
      const cajaResponse = await fetch(`${import.meta.env.VITE_API_URL}/caja`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cajaData),
      });

      if (ventaResponse.ok && cajaResponse.ok) {
        alert('Venta y registro de caja realizados exitosamente.');
        // Resetear estados
        setCart([]);
        setClientId(null);
        setClientDni('');
        setObservaciones('');
        setDescription('');
      } else {
        alert('Hubo un problema al realizar la venta o registrar la caja.');
      }
    } catch (error) {
      console.error('Error al realizar la venta:', error);
    }
  };
  const calculateTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Venta de Productos</h2>
        
        {/* Selector de categoría de productos */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as 'accesorios' | 'celulares')}
          className="w-full p-3 rounded-md bg-gray-800 mb-4"
        >
          <option value="accesorios">Accesorios</option>
          <option value="celulares">Celulares</option>
        </select>

        {/* Selector de medio de pago */}
        <select
          value={medioDePago}
          onChange={(e) => setMedioDePago(e.target.value as MedioDePago)}
          className="w-full p-3 rounded-md bg-gray-800 mb-4"
        >
          {Object.values(MedioDePago).map(medio => (
            <option key={medio} value={medio}>{medio}</option>
          ))}
        </select>

        {/* Selector de tipo de cliente */}
        <select
          value={clientType}
          onChange={(e) => setClientType(e.target.value as 'nuevo' | 'agendado')}
          className="w-full p-3 rounded-md bg-gray-800 mb-4"
        >
          <option value="agendado">Cliente Agendado</option>
          <option value="nuevo">Nuevo Cliente</option>
        </select>

        {/* Búsqueda de cliente existente */}
        {clientType === 'agendado' && (
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Ingrese DNI del cliente"
              value={clientDni}
              onChange={(e) => setClientDni(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-800 mr-2"
            />
            <button 
              onClick={handleSearchClient}
              className="bg-blue-500 p-3 rounded-md text-white"
            >
              Buscar
            </button>
          </div>
        )}

        {/* Formulario para nuevo cliente */}
        {clientType === 'nuevo' && (
          <div className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="DNI"
              value={clientDni}
              onChange={(e) => setClientDni(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-800"
            />
            <input
              type="text"
              placeholder="Nombre"
              value={newClientData.nombre}
              onChange={(e) => setNewClientData({...newClientData, nombre: e.target.value})}
              className="w-full p-3 rounded-md bg-gray-800"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={newClientData.apellido}
              onChange={(e) => setNewClientData({...newClientData, apellido: e.target.value})}
              className="w-full p-3 rounded-md bg-gray-800"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={newClientData.telefono}
              onChange={(e) => setNewClientData({...newClientData, telefono: e.target.value})}
              className="w-full p-3 rounded-md bg-gray-800"
            />
            <input
              type="email"
              placeholder="Email"
              value={newClientData.email}
              onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
              className="w-full p-3 rounded-md bg-gray-800"
            />
            <button 
              onClick={handleCreateClient}
              className="w-full p-3 rounded-md bg-green-500 text-white"
            >
              Crear Cliente
            </button>
          </div>
        )}

        {/* Selector de comisión */}
        <select
          value={comision}
          onChange={(e) => setComision(e.target.value as Comision)}
          className="w-full p-3 rounded-md bg-gray-800 mb-4"
        >
          {Object.values(Comision).map(com => (
            <option key={com} value={com}>{com}</option>
          ))}
        </select>

        {/* Campos de observaciones y descripción */}
        <input
          type="text"
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 mb-4"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 mb-4"
        />

        {/* Resto del código de selección de productos y carrito (se mantiene igual) */}
        {/* ... (código anterior de selección de productos, carrito, etc.) ... */}

        <button
          type="button"
          onClick={handleSale}
          className="w-full p-3 mt-4 rounded-md bg-green-500 text-white"
          disabled={!clientId || cart.length === 0}
        >
          Realizar Venta
        </button>
      </div>
    </div>
  );
};

export default SalesForm;
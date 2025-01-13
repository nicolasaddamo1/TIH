import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Interfaces
interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria?: string;
  imagen?: string;
}

// Enums
enum Categoria {
  ACCESORIOS = 'accesorios',
  CELULARES = 'celulares',
}

// Componente principal
const SalesForm: React.FC = () => {
  const [clienteDni, setClienteDni] = useState('');
  const [cliente, setCliente] = useState(null);
  const [isNuevoCliente, setIsNuevoCliente] = useState(false);
  const [clienteData, setClienteData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    direccion: '',
    nroTelefono: '',
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [category, setCategory] = useState<Categoria>(Categoria.ACCESORIOS);
  const [cart, setCart] = useState<{ product: Producto; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>(''); 
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [medioDePago, setMedioDePago] = useState('MercadoPago');
  const [observaciones, setObservaciones] = useState('');
  const [vendedorId, setVendedorId] = useState('');
  const [imei, setImei] = useState('');
  const [productoPorImei, setProductoPorImei] = useState<Producto | null>(null);


  


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          category === Categoria.ACCESORIOS
            ? `${import.meta.env.VITE_API_URL}/producto`
            : `${import.meta.env.VITE_API_URL}/producto/celulares`
        );
        const data = await response.json();
        setProductos(data);
        setSelectedProduct(data.length > 0 ? data[0].id : '');
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.sub && typeof decoded.sub === 'string') {
          setVendedorId(decoded.sub);
        } else {
          console.error('El token no contiene un sub válido');
        }
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    }
  }, []);

  const handleAddToCart = () => {
    const product = productos.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: selectedQuantity }]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const calculateTotalPrice = () => {

    const precioTotal = cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);
    return precioTotal
  };
  const handleClienteSearch = () => {
    if (clienteDni) {
      axios.get(`${import.meta.env.VITE_API_URL}/clientes/${clienteDni}`)
        .then((response) => {
          if (response.data) {
            setCliente(response.data.id);
            setClienteData(response.data);
            alert('Cliente encontrado');
          }
        })
        .catch(error => {
          console.error("Error buscando cliente:", error);
          alert('Cliente no encontrado');
        });
    }
  };
  
    const handleChangeMedioDePago = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMedioDePago(e.target.value); 
    };

    const handleSearchByImei = async () => {
      if (!imei) {
        alert('Por favor, ingrese un IMEI.');
        return;
      }
      try {

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/producto/celulares/imei`, { params: { imei } });
        if (response.data) {
          setProductoPorImei(response.data);
          alert('Celular encontrado');
          setCart([...cart, { product: response.data, quantity: 1 }]);

        } else {
          setProductoPorImei(null);
          alert('Celular no encontrado');
        }
      } catch (error) {
        console.error('Error al buscar por IMEI:', error);
        alert('Error al buscar producto por IMEI.');
      }
    };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isNuevoCliente && clienteData.dni && clienteData.nombre && clienteData.apellido) {
      try {
        const newCliente = await axios.post('/clientes', clienteData);
        setCliente(newCliente.data);
      } catch (error) {
        console.error('Error al crear el cliente:', error);
        alert('Error al crear el cliente');
        return;
      }
    }
    // Determinar la comisión basado en la categoría seleccionada
    const tipoComision = category === Categoria.ACCESORIOS ? 'Venta' : 'Celular';
    
    const cajaData = {
      productos: cart.map((item) => item.product.id),
      comision: tipoComision, // Comision basada en la categoría seleccionada
      precioTotal: calculateTotalPrice(),
      medioDePago,
      cliente,
      observaciones,
      vendedor: vendedorId,
    };
  
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/caja`, cajaData);
      alert('Venta registrada con éxito');
      
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      alert('Hubo un problema al registrar la venta');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 p-6 h-screen bg-gray-800">
      {/* Columna izquierda - Cliente */}
      <div className="col-span-1 p-4 bg-gray-900 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Información del Cliente</h2>
        <label>
          <span className="text-white">Cliente:</span>
          <select
            onChange={(e) => setIsNuevoCliente(e.target.value === 'Nuevo')}
            className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
          >
            <option value="Registrado">Cliente ya Registrado</option>
            <option value="Nuevo">Cliente Nuevo</option>
          </select>
        </label>
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
              type="button"
              onClick={async () => {
                if (clienteData.dni && clienteData.nombre && clienteData.apellido) {
                  try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/clientes`, clienteData);
                    setCliente(response.data);
                    alert('Cliente creado con éxito');
                  } catch (error) {
                    console.error('Error al crear el cliente:', error);
                    alert('Error al crear el cliente');
                  }
                } else {
                  alert('Por favor complete todos los campos del cliente.');
                }
              }}
              className="bg-green-500 w-full px-3 py-2 rounded-md text-white hover:bg-green-600"
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
              type="button"
              onClick={handleClienteSearch}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
            >
              Buscar Cliente
            </button>
          </>
        )}
      </div>
  
      {/* Columna central - Productos y carrito */}
      <div className="col-span-1 p-4 bg-gray-900 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Venta de Productos</h2>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Categoria)}
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
        >
          <option value={Categoria.ACCESORIOS}>Accesorios</option>
          <option value={Categoria.CELULARES}>Celulares</option>
        </select>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
        >
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre} - ${producto.precio} (Stock: {producto.stock})
            </option>
          ))}
        </select>
        <label htmlFor="quantity" className="block text-white mb-1">Cantidad:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          max={productos.find((p) => p.id === selectedProduct)?.stock || 1}
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(Number(e.target.value))}
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
        />

        <h2 className="text-xl font-semibold mb-4 text-white">Buscar por Celular por IMEI</h2>
        <input
          type="text"
          placeholder="Ingrese IMEI"
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
        />

        <button 
          type="button"
          onClick={handleSearchByImei}
          className="bg-green-500 w-full px-3 py-2 rounded-md text-white hover:bg-green-600 hover:text-black"
        >
          Buscar Celular
        </button>
          <br />
          <br />
        <button
          type="button"
          onClick={handleAddToCart}
          className="bg-blue-500 w-full px-3 py-2 rounded-md text-white hover:bg-blue-600 mb-4"
        >
          Agregar al carrito
        </button>
        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Carrito</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-300">No hay productos en el carrito.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.product.id} className="flex justify-between items-center text-white">
                  <span>{item.product.nombre} (x{item.quantity})</span>
                  <p className="text-sm">${item.product.precio * item.quantity}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="bg-red-500 px-2 py-1 rounded-md text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-semibold text-white">Total: ${calculateTotalPrice()}</p>
        </div>
      </div>
  
      {/* Columna derecha - Pago */}
      <div className="col-span-1 p-4 bg-gray-900 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Pago y Observaciones</h2>
        <label className="block text-white mb-2">Medio de Pago:</label>
        <select
          value={medioDePago}
          onChange={handleChangeMedioDePago}
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
        >
          <option value="">Seleccione un medio de pago</option>
          <option value="MercadoPago">MercadoPago</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Laura">Laura</option>
          <option value="CuentaDNI">CuentaDNI</option>
        </select>
        <label className="block text-white mb-2">Observaciones:</label>
        <input
          type="text"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-4"
        />
        <button type="submit" className="bg-green-500 w-full px-3 py-2 rounded-md text-white hover:bg-green-600">
          Registrar Venta
        </button>
      </div>
    </form>
  );
  
};

export default SalesForm;

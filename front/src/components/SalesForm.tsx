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
  const [descripcion, setDescripcion] = useState('');
  const [vendedorId, setVendedorId] = useState('');

  // Obtener productos según la categoría seleccionada
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
        setSelectedProduct(data.length > 0 ? data[0].id : ''); // Seleccionar el primer producto si existen
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();
  }, [category]);

  // Obtener ID del vendedor desde el token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.sub && typeof decoded.sub === 'string') {
          setVendedorId(decoded.sub); // Asegúrate que este es un UUID válido
        } else {
          console.error('El token no contiene un sub válido');
        }
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    }
  }, []);

  // Manejar la adición al carrito
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

  // Manejar eliminación de productos del carrito
  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  // Calcular el precio total del carrito
  const calculateTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);
  };
  console.log("Cliente state: ", cliente)
  // Manejar búsqueda de cliente
  const handleClienteSearch = () => {
    if (clienteDni) {
      axios.get(`${import.meta.env.VITE_API_URL}/clientes/${clienteDni}`)
        .then((response) => {
          if (response.data) {
            console.log("Cliente encontrado:", response.data);
            setCliente(response.data.id);
            setClienteData(response.data); // Opcional: si quieres mostrar los datos
            alert('Cliente encontrado');
          }
        })
        .catch(error => {
          console.error("Error buscando cliente:", error);
          alert('Cliente no encontrado');
        });
    }
  };

  // Manejar el envío del formulario (Registrar Venta)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si el cliente es nuevo, enviar los datos para crear el cliente
    if (isNuevoCliente && clienteData.dni && clienteData.nombre && clienteData.apellido) {
      try {
        const newCliente = await axios.post('/clientes', clienteData);
        setCliente(newCliente.data);  // Establecer cliente recién creado
      } catch (error) {
        console.error('Error al crear el cliente:', error);
        alert('Error al crear el cliente');
        return;
      }
    }

    const cajaData = {
      precioTotal,
      productos: cart.map((item) => item.product.id), // Productos en el carrito
      medioDePago,
      cliente,
      observaciones,
      descripcion,
      vendedor: vendedorId,
    };

    axios.post(`${import.meta.env.VITE_API_URL}/caja`, cajaData).then(() => {
      alert('Venta registrada con éxito');
    }).catch((error) => {
      console.error('Error al registrar la venta:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Venta de Productos</h2>

        {/* Selección de cliente */}
        <div>
          <label>
            Cliente:
            <select
              onChange={(e) => setIsNuevoCliente(e.target.value === 'Nuevo')}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            >
              <option value="Registrado">Cliente ya Registrado</option>
              <option value="Nuevo">Cliente Nuevo</option>
            </select>
          </label>
        </div>

        {isNuevoCliente ? (
          <div>
            <input
              type="text"
              placeholder="DNI"
              value={clienteData.dni}
              onChange={(e) => setClienteData({ ...clienteData, dni: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
            <input
              type="text"
              placeholder="Nombre"
              value={clienteData.nombre}
              onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={clienteData.apellido}
              onChange={(e) => setClienteData({ ...clienteData, apellido: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={clienteData.direccion}
              onChange={(e) => setClienteData({ ...clienteData, direccion: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={clienteData.nroTelefono}
              onChange={(e) => setClienteData({ ...clienteData, nroTelefono: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
            {isNuevoCliente && (
            <button
                type="button"
                onClick={async () => {
                if (clienteData.dni && clienteData.nombre && clienteData.apellido) {
                    try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/clientes`, clienteData);
                    setCliente(response.data);  // Establecer cliente recién creado
                    alert('Cliente creado con éxito');
                    } catch (error) {
                    console.error('Error al crear el cliente:', error);
                    alert('Error al crear el cliente');
                    }
                } else {
                    alert('Por favor complete todos los campos del cliente.');
                }
                }}
                className="bg-green-500 w-full px-3 py-2 rounded-md text-white hover:bg-green-600 mb-4"
            >
                Crear Cliente
            </button>
            )}
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Buscar Cliente por DNI"
              value={clienteDni}
              onChange={(e) => setClienteDni(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
            <button
              type="button"
              onClick={handleClienteSearch}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 mb-4"
            >
              Buscar Cliente
            </button>
          </div>
        )}

        {/* Selección de categoría y productos */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Categoria)}
          className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
        >
          <option value={Categoria.ACCESORIOS}>Accesorios</option>
          <option value={Categoria.CELULARES}>Celulares</option>
        </select>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
        >
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre} - ${producto.precio} (Stock: {producto.stock})
            </option>
          ))}
        </select>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-white mb-1">
            Cantidad:
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={productos.find((p) => p.id === selectedProduct)?.stock || 1}
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
            className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
          />
        </div>

        <button
            type="button" // Cambia el tipo de botón a "button" para que no envíe el formulario
            onClick={(e) => {
              e.preventDefault(); // Previene el envío del formulario
              handleAddToCart();  // Llama a la función de agregar al carrito
            }}
            className="bg-blue-500 w-full px-3 py-2 rounded-md text-white hover:bg-blue-600 mb-4"
          >
          Agregar al carrito
        </button>


        {/* Resumen del carrito */}
        <div className="bg-gray-900 p-4 rounded-md text-white">
          <h3 className="text-lg font-semibold mb-2">Carrito</h3>
          {cart.length === 0 ? (
            <p className="text-sm">No hay productos en el carrito.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.product.id} className="flex justify-between items-center">
                  <div>
                    <span>{item.product.nombre} (x{item.quantity})</span>
                    <p className="text-sm">${item.product.precio * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="bg-red-500 px-3 py-1 rounded-md text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-semibold">Total: ${calculateTotalPrice()}</p>
        </div>

        {/* Observaciones y descripción */}
        <div>
          <label>
            Observaciones:
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
          </label>
        </div>
        <div>
          <label>
            Descripción:
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
            />
          </label>
        </div>

        <button type="submit" className="bg-green-500 w-full px-3 py-2 rounded-md text-white hover:bg-green-600">
          Registrar Venta
        </button>
      </div>
    </form>
  );
};

export default SalesForm;

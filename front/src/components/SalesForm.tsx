import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

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

// Componente principal
const SalesForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [_total, setTotal] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);

  
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
  console.log(import.meta.env.VITE_API_URL)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/producto`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();
  }, []);
  
  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
    if (product) {
      setTotal(product.precio * quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value);
    setQuantity(qty);
    if (selectedProduct) {
      setTotal(selectedProduct.precio * qty);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct && quantity > 0) {
      const existingItem = cart.find((item) => item.product.id === selectedProduct.id);
      if (existingItem) {
        alert('Este producto ya está en el carrito. Modifica la cantidad si es necesario.');
      } else {
        setCart([...cart, { product: selectedProduct, quantity }]);
        setSelectedProduct(null);
        setQuantity(1);
        setTotal(0);
      }
    } else {
      alert('Selecciona un producto y una cantidad válida.');
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const calculateTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);
  };

  const handleSale = async () => {
    if (!userId || cart.length === 0) {
      alert('Debes agregar productos al carrito o estar autenticado.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/ventas`, {
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
      if (response.ok) {
        alert('Venta realizada exitosamente.');
        setCart([]);
      } else {
        alert('Hubo un problema al realizar la venta.');
      }
    } catch (error) {
      console.error('Error al realizar la venta:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Venta de Productos</h2>
        {userId && <p className="text-sm text-gray-400 text-center">ID Usuario: {userId}</p>}
        <form className="space-y-4">
          <select onChange={handleProductSelect} className="w-full p-3 rounded-md bg-gray-800">
            <option value="">Seleccione un producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nombre} - ${product.precio} (Stock: {product.stock})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Cantidad"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full p-3 rounded-md bg-blue-500 text-white"
          >
            Agregar al Carrito
          </button>
        </form>
        <div className="mt-6">
          <h3 className="text-xl text-white mb-2">Carrito</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-400">El carrito está vacío.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li
                  key={item.product.id}
                  className="bg-gray-700 p-2 rounded-md text-white flex justify-between items-center"
                >
                  <span>
                    {item.product.nombre}     Cantidad: {item.quantity}      Precio ${item.product.precio * item.quantity}
                  </span>
                  <button
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    className="bg-red-500 p-2 rounded text-white"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="text-white mt-4">
            <strong>Total: ${calculateTotalPrice()}</strong>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSale}
          className="w-full p-3 mt-4 rounded-md bg-green-500 text-white"
        >
          Realizar Venta
        </button>
      </div>
    </div>
  );
};

export default SalesForm;

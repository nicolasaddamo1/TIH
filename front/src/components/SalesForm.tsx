// src/components/SalesForm.tsx
import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const productsFromDb: Product[] = [
  { id: 1, name: 'Producto A', price: 100, stock: 10 },
  { id: 2, name: 'Producto B', price: 150, stock: 5 },
  // Más productos de ejemplo
];

const SalesForm: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = parseInt(e.target.value);
    const product = productsFromDb.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
    if (product) {
      setTotal(product.price * quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseInt(e.target.value);
    setQuantity(qty);
    if (selectedProduct) {
      setTotal(selectedProduct.price * qty);
    }
  };

  const handleSale = () => {
    if (selectedProduct && quantity <= selectedProduct.stock) {
      const updatedStock = selectedProduct.stock - quantity;
      alert(`Venta realizada. Quedan ${updatedStock} unidades de ${selectedProduct.name}.`);
      // Aquí actualizarías el stock en la base de datos
      setSelectedProduct(null);
      setQuantity(1);
      setTotal(0);
    } else {
      alert('Stock insuficiente');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Venta de Productos</h2>
        <form className="space-y-4">
          <select onChange={handleProductSelect} className="w-full p-3 rounded-md bg-gray-50">
            <option value="">Seleccione un producto</option>
            {productsFromDb.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price} (Stock: {product.stock})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Cantidad"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <p>Total: ${total}</p>
          <button type="button" onClick={handleSale} className="w-full p-3 rounded-md bg-green-500 text-white">
            Realizar Venta
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalesForm;

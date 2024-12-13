//src/components/ProductForm.tsx
import React, { useState } from 'react';

interface Product {
  name: string;
  price: string;
  stock: string;
  image: File | null;
}

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({ name: '', price: '', stock: '', image: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { // Verificación añadida
    //   setProduct((prevProduct) => ({ ...prevProduct, image: e.target.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Producto cargado correctamente');
    // Aquí envías los datos del producto a la base de datos
    setProduct({ name: '', price: '', stock: '', image: null });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Carga de Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={product.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={product.price}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full p-3 rounded-md bg-gray-50"
          />
          <button type="submit" className="w-full p-3 rounded-md bg-blue-500 text-white">
            Cargar Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

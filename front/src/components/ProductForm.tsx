//src/components/ProductForm.tsx
import React, { useState } from 'react';

interface Product {
  nombre: string;
  precio: string;
  stock: string;
  imagen: File | null;
  categoria: string;
}

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    nombre: '',
    precio: '',
    stock: '',
    imagen: null,
    categoria:'' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { // Verificación añadida
    //   setProduct((prevProduct) => ({ ...prevProduct, image: e.target.files[0] }));
    }
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/producto`;
    
    // Asegúrate de que `cellphone` tenga los datos correctos antes de enviar.
    const productData = {
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      imagen: product.imagen, // Esto debe ser manejado correctamente si es un archivo.
      categoria: product.categoria,
    };
  
    try {
       const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const result = await response.json();
      alert('Producto cargado correctamente');
      
      // Reseteamos el formulario después de enviar los datos.
      setProduct({
        nombre: '',
        precio: '',
        stock: '',
        imagen: null,
        categoria: '',
      });
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Hubo un error al cargar el producto');
    }
  
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center text-2xl font-semibold mb-4">Carga de Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={product.nombre}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={product.precio}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
            <input
              type="text"
              name="categoria"
              placeholder="categoria"
              value={product.categoria}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-800"
            />
          <input
            type="file"
            name="imagen"
            onChange={handleImageChange}
            className="w-full p-3 rounded-md bg-gray-800"
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

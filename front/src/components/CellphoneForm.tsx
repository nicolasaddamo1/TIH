//src/components/ProductForm.tsx
import React, { useState } from 'react';

interface Cellphone {
  nombre: string;
  precio: string;
  stock: string;
  imagen: File | null;
  categoria:string;
  estado:string;
  descripcionEstado:string;
  }

const CellphoneForm: React.FC = () => {
  const [cellphone, setCellphone] = useState<Cellphone>({
     nombre: '',
     precio: '',
     stock: '',
     imagen: null,
     categoria:'',
     estado:'',
     descripcionEstado:''
     });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCellphone((prevCell) => ({ ...prevCell, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { // Verificación añadida
    //   setProduct((prevProduct) => ({ ...prevProduct, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const url = `${import.meta.env.VITE_API_URL}/producto/celulares`;
    
    // Asegúrate de que `cellphone` tenga los datos correctos antes de enviar.
    const cellphoneData = {
      nombre: cellphone.nombre,
      precio: cellphone.precio,
      stock: cellphone.stock,
      imagen: cellphone.imagen, // Esto debe ser manejado correctamente si es un archivo.
      categoria: cellphone.categoria,
      estado: cellphone.estado,
      descripcionEstado: cellphone.descripcionEstado,
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cellphoneData),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const result = await response.json();
      alert('Producto cargado correctamente');
      
      // Reseteamos el formulario después de enviar los datos.
      setCellphone({
        nombre: '',
        precio: '',
        stock: '',
        imagen: null,
        categoria: '',
        estado: '',
        descripcionEstado: '',
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
            value={cellphone.nombre}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={cellphone.precio}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={cellphone.stock}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={cellphone.categoria}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />

          <input
            type="text"
            name="estado"
            placeholder="estado"
            value={cellphone.estado}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-gray-800"
          />
          <input
            type="text"
            name="descripcionEstado"
            placeholder="Describir el estado"
            value={cellphone.descripcionEstado}
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

export default CellphoneForm;

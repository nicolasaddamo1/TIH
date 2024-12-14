// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { jwtDecode, JwtPayload } from 'jwt-decode';

// // export interface Producto {
// //   id: string;
// //   nombre: string;
// //   precio: number;
// //   stock: number;
// //   imagen?: string;
// //   categoria?: string;
// // }

// // const SalesForm = () => {
// //   const [clienteDni, setClienteDni] = useState('');
// //   const [cliente, setCliente] = useState(null);
// //   const [isNuevoCliente, setIsNuevoCliente] = useState(false);
// //   const [clienteData, setClienteData] = useState({
// //     dni: '',
// //     nombre: '',
// //     apellido: '',
// //     direccion: '',
// //     nroTelefono: '',
// //   });
// //   const [productos, setProductos] = useState([]);
// //   const [selectedProducto, setSelectedProducto] = useState('');
// //   const [precioTotal, setPrecioTotal] = useState(0);
// //   const [medioDePago, setMedioDePago] = useState('MERCADOPAGO');
// //   const [observaciones, setObservaciones] = useState('');
// //   const [descripcion, setDescripcion] = useState('');
// //   const [comision, setComision] = useState('VENTA');
// //   const [vendedorId, setVendedorId] = useState('');

// //   // Obtener productos dependiendo de la comisión seleccionada
// //   const getProductos = (comision: string) => {
// //     const url = comision === 'CELULAR' ? `${import.meta.env.VITE_API_URL}/producto/celulares` : `${import.meta.env.VITE_API_URL}/producto`; // Si es "CELULAR", obtenemos solo celulares, sino todos los productos
// //     axios.get(url).then((response) => setProductos(response.data));
// //   };

// //   useEffect(() => {
// //     // Obtener ID del vendedor desde el token
// //     const token = localStorage.getItem('accessToken');
// //     if (token) {
// //       const decoded = jwtDecode<JwtPayload>(token);
// //       if (decoded.sub) {
// //         setVendedorId(decoded.sub);
// //       } else {
// //         console.error("El token no contiene 'sub'");
// //       }
// //     }

// //     // Inicializar los productos al cargar la página
// //     getProductos(comision);
// //   }, [comision]); // Cada vez que cambie la comisión, se recargan los productos

// //   const handleClienteSearch = () => {
// //     if (clienteDni) {
// //       axios.get(`/clientes/${clienteDni}`).then((response) => {
// //         if (response.data) {
// //           setCliente(response.data);
// //           alert('Cliente encontrado');
// //         } else {
// //           alert('Cliente no encontrado');
// //         }
// //       });
// //     }
// //   };

// //   const handleClienteSubmit = () => {
// //     if (isNuevoCliente) {
// //       axios.post('/clientes', clienteData).then((response) => {
// //         setCliente(response.data);
// //         alert('Cliente creado con éxito');
// //       });
// //     }
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     const cajaData = {
// //       precioTotal,
// //       productos: [selectedProducto], // Producto seleccionado para la venta
// //       medioDePago,
// //       cliente,
// //       observaciones,
// //       descripcion,
// //       comision,
// //       vendedor: vendedorId,
// //     };

// //     axios.post('/caja', cajaData).then((response) => {
// //       alert('Venta registrada con éxito');
// //     }).catch((error) => {
// //       console.error('Error al registrar la venta:', error);
// //     });
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <div>
// //         <label>
// //           Cliente:
// //           <select onChange={(e) => setIsNuevoCliente(e.target.value === 'Nuevo')}>
// //             <option value="Registrado">Cliente ya Registrado</option>
// //             <option value="Nuevo">Cliente Nuevo</option>
// //           </select>
// //         </label>
// //       </div>

// //       {isNuevoCliente ? (
// //         <div>
// //           <input
// //             type="text"
// //             placeholder="DNI"
// //             value={clienteData.dni}
// //             onChange={(e) => setClienteData({ ...clienteData, dni: e.target.value })}
// //           />
// //           <input
// //             type="text"
// //             placeholder="Nombre"
// //             value={clienteData.nombre}
// //             onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
// //           />
// //           <input
// //             type="text"
// //             placeholder="Apellido"
// //             value={clienteData.apellido}
// //             onChange={(e) => setClienteData({ ...clienteData, apellido: e.target.value })}
// //           />
// //           <input
// //             type="text"
// //             placeholder="Dirección"
// //             value={clienteData.direccion}
// //             onChange={(e) => setClienteData({ ...clienteData, direccion: e.target.value })}
// //           />
// //           <input
// //             type="text"
// //             placeholder="Teléfono"
// //             value={clienteData.nroTelefono}
// //             onChange={(e) => setClienteData({ ...clienteData, nroTelefono: e.target.value })}
// //           />
// //           <button type="button" onClick={handleClienteSubmit}>Guardar Cliente</button>
// //         </div>
// //       ) : (
// //         <div>
// //           <input
// //             type="text"
// //             placeholder="Buscar Cliente por DNI"
// //             value={clienteDni}
// //             onChange={(e) => setClienteDni(e.target.value)}
// //           />
// //           <button type="button" onClick={handleClienteSearch}>Buscar Cliente</button>
// //         </div>
// //       )}

// //       <div>
// //         <label>
// //           Producto:
// //           <select onChange={(e) => setSelectedProducto(e.target.value)}>
// //             {productos.map((producto:Producto) => (
// //               <option key={producto.id} value={producto.id}>{producto.nombre}</option>
// //             ))}
// //           </select>
// //         </label>
// //       </div>

// //       <div>
// //         <label>
// //           Precio Total:
// //           <input
// //             type="number"
// //             value={precioTotal}
// //             onChange={(e) => setPrecioTotal(Number(e.target.value))}
// //           />
// //         </label>
// //       </div>

// //       <div>
// //         <label>
// //           Medio de Pago:
// //           <select onChange={(e) => setMedioDePago(e.target.value)}>
// //             <option value="EFECTIVO">Efectivo</option>
// //             <option value="MERCADOPAGO">MercadoPago</option>
// //             <option value="LAURA">Laura</option>
// //             <option value="CUENTADNI">CuentaDNI</option>
// //           </select>
// //         </label>
// //       </div>

// //       <div>
// //         <label>
// //           Observaciones:
// //           <input
// //             type="text"
// //             value={observaciones}
// //             onChange={(e) => setObservaciones(e.target.value)}
// //           />
// //         </label>
// //       </div>

// //       <div>
// //         <label>
// //           Descripción:
// //           <input
// //             type="text"
// //             value={descripcion}
// //             onChange={(e) => setDescripcion(e.target.value)}
// //           />
// //         </label>
// //       </div>

// //       <div>
// //         <label>
// //           Comisión:
// //           <select onChange={(e) => setComision(e.target.value)}>
// //             <option value="VENTA">Venta</option>
// //             <option value="SERVICIO">Servicio</option>
// //             <option value="CELULAR">Celular</option>
// //             <option value="ACCESORIO">Accesorio</option>
// //           </select>
// //         </label>
// //       </div>

// //       <button type="submit">Registrar Venta</button>
// //     </form>
// //   );
// // };

// // export default SalesForm;
// import React, { useState, useEffect } from 'react';

// // Interfaces
// interface Product {
//   id: string;
//   nombre: string;
//   precio: number;
//   stock: number;
//   categoria?: string;
//   imagen?: string;
// }

// // Enums
// enum Categoria {
//   ACCESORIOS = 'accesorios',
//   CELULARES = 'celulares'
// }

// // Componente principal
// const SalesForm: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [category, setCategory] = useState<Categoria>(Categoria.ACCESORIOS);
//   const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<string>('');
//   const [selectedQuantity, setSelectedQuantity] = useState(1);

//   // Obtener productos según la categoría seleccionada
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(
//           category === Categoria.ACCESORIOS
//             ? `${import.meta.env.VITE_API_URL}/producto`
//             : `${import.meta.env.VITE_API_URL}/producto/celulares`
//         );
//         const data = await response.json();
//         setProducts(data);
//         setSelectedProduct(data.length > 0 ? data[0].id : ''); // Seleccionar el primer producto si existen
//       } catch (error) {
//         console.error('Error al obtener productos:', error);
//       }
//     };
//     fetchProducts();
//   }, [category]);

//   // Manejar la adición al carrito
//   const handleAddToCart = () => {
//     const product = products.find((p) => p.id === selectedProduct);
//     if (!product) return;

//     const existingItem = cart.find((item) => item.product.id === product.id);
//     if (existingItem) {
//       setCart(
//         cart.map((item) =>
//           item.product.id === product.id
//             ? { ...item, quantity: item.quantity + selectedQuantity }
//             : item
//         )
//       );
//     } else {
//       setCart([...cart, { product, quantity: selectedQuantity }]);
//     }
//   };

//   // Manejar eliminación de productos del carrito
//   const handleRemoveFromCart = (productId: string) => {
//     setCart(cart.filter((item) => item.product.id !== productId));
//   };

//   // Calcular el precio total del carrito
//   const calculateTotalPrice = () => {
//     return cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-800">
//       <div className="backdrop-blur-md bg-white/30 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-center text-2xl font-semibold mb-4">Venta de Productos</h2>

//         {/* Selector de categoría de productos */}
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value as Categoria)}
//           className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
//         >
//           <option value={Categoria.ACCESORIOS}>Accesorios</option>
//           <option value={Categoria.CELULARES}>Celulares</option>
//         </select>

//         {/* Selector de productos */}
//         <select
//           value={selectedProduct}
//           onChange={(e) => setSelectedProduct(e.target.value)}
//           className="w-full p-3 rounded-md bg-gray-800 mb-4 text-white"
//         >
//           {products.map((product) => (
//             <option key={product.id} value={product.id}>
//               {product.nombre} - ${product.precio} (Stock: {product.stock})
//             </option>
//           ))}
//         </select>

//         {/* Cantidad a agregar */}
//         <div className="mb-4">
//           <label htmlFor="quantity" className="block text-white mb-1">
//             Cantidad:
//           </label>
//           <input
//             id="quantity"
//             type="number"
//             min="1"
//             max={products.find((p) => p.id === selectedProduct)?.stock || 1}
//             value={selectedQuantity}
//             onChange={(e) => setSelectedQuantity(Number(e.target.value))}
//             className="w-full p-2 rounded-md bg-gray-800 text-white"
//           />
//         </div>

//         <button
//           onClick={handleAddToCart}
//           className="bg-blue-500 w-full px-3 py-2 rounded-md text-white hover:bg-blue-600 mb-4"
//         >
//           Agregar al carrito
//         </button>

//         {/* Resumen del carrito */}
//         <div className="bg-gray-900 p-4 rounded-md text-white">
//           <h3 className="text-lg font-semibold mb-2">Carrito</h3>
//           {cart.length === 0 ? (
//             <p className="text-sm">No hay productos en el carrito.</p>
//           ) : (
//             <ul className="space-y-2">
//               {cart.map((item) => (
//                 <li key={item.product.id} className="flex justify-between items-center">
//                   <div>
//                     <span>{item.product.nombre} (x{item.quantity})</span>
//                     <p className="text-sm">${item.product.precio * item.quantity}</p>
//                   </div>
//                   <button
//                     onClick={() => handleRemoveFromCart(item.product.id)}
//                     className="bg-red-500 px-3 py-1 rounded-md text-white hover:bg-red-600"
//                   >
//                     Eliminar
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <p className="mt-2 font-semibold">Total: ${calculateTotalPrice()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesForm;

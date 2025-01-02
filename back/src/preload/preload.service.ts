import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import preloadData from './data.json';
import { Usuario } from 'src/Entity/usuario.entity';
import { Caja } from 'src/Entity/caja.entity';
import { Producto, Cellphone } from 'src/Entity/producto.entity'; 
import { Factura } from 'src/Entity/factura.entity';
import { Role } from 'src/enum/roles.enum';
import * as bcrypt from 'bcrypt';
import { Cliente } from 'src/Entity/cliente.entity';
import { MedioDePago } from 'src/enum/medioDePago.enum';
import { Comision } from 'src/enum/comision.enum';

@Injectable()
export class PreloadService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Caja) private readonly cajaRepository: Repository<Caja>,
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>, // Añadir repositorio de Producto
    @InjectRepository(Factura) private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(Cellphone) private readonly cellphoneRepository: Repository<Cellphone>, // Añadir repositorio de Cellphone
    @InjectRepository(Cliente) private readonly clienteRepository: Repository<Cliente> // Añadir repositorio de Cellphone
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.preloadUsuarios();
      await this.preloadClientes();
      await this.preloadCajas();
      await this.preloadProductos();
      await this.preloadCellphones(); // Llamar a la función de precarga de celulares
      await this.preloadFacturas();
      console.log('Preload completado exitosamente.');
    } catch (error) {
      console.error('Error en el preload:', error);
    }
  }

  private async preloadUsuarios() {
    console.log('Cargando usuarios...');
    for (const usuario of preloadData.usuarios) {
      try {
        const exists = await this.usuarioRepository.findOne({ where: { email: usuario.email } });
        if (!exists) {
          const role = Role[usuario.role as keyof typeof Role];
  
          const salt = await bcrypt.genSalt(10); // Genera un salt
          const hashedPassword = await bcrypt.hash(usuario.password, salt);
  
          const nuevoUsuario = this.usuarioRepository.create({
            ...usuario,
            role,
            password: hashedPassword, // Guarda la contraseña encriptada
          });
  
          await this.usuarioRepository.save(nuevoUsuario);
          console.log(`Usuario ${usuario.nombre} ${usuario.apellido} guardado con éxito.`);
        } else {
          console.log(`Usuario con email ${usuario.email} ya existe, omitiendo.`);
        }
      } catch (error) {
        console.error(`Error al cargar el usuario ${usuario.email}:`, error);
      }
    }
  }
  
  private async preloadProductos() {
    console.log('Cargando productos...');
    for (const producto of preloadData.productos) {
      try {
        // Verificar si el producto ya existe por nombre
        const exists = await this.productoRepository.findOne({ where: { nombre: producto.nombre } });
  
        if (!exists) {
          let nuevoProducto;
          
          if (producto.tipo === 'Cellphone') {
            // Si el producto es un celular, lo creamos como una instancia de Cellphone
            const nuevoCellphone = this.cellphoneRepository.create({
              ...producto,
            });
            nuevoProducto = nuevoCellphone;  // Aquí asignamos correctamente el celular
          } else {
            // De lo contrario, lo tratamos como un Producto común
            nuevoProducto = this.productoRepository.create({
              ...producto,
            });
          }
  
          await this.productoRepository.save(nuevoProducto);
          console.log(`Producto ${producto.nombre} guardado con éxito.`);
        } else {
          console.log(`Producto ${producto.nombre} ya existe, omitiendo.`);
        }
      } catch (error) {
        console.error(`Error al cargar el producto ${producto.nombre}:`, error);
      }
    }
  }
  
  private async preloadCajas() {
    console.log('Cargando cajas...');
    for (const caja of preloadData.cajas) {
      try {
        // Obtener el vendedor, que es una relación
        const vendedor = await this.usuarioRepository.findOne({ where: { id: caja.vendedor } });
        const cliente = await this.clienteRepository.findOne({ where: { id: caja.cliente } });
  
        // Obtener los productos, que es una relación (asumimos que los productos están en un arreglo de IDs)
        const productos = await this.productoRepository.find({
          where: {
            id: In(caja.productos), // Usando In para buscar los productos por sus IDs
          },
        });
  
        // Si tanto el vendedor como los productos existen
        if (vendedor && productos.length > 0) {
          // Verificar que 'medioDePago' esté correctamente asignado como enum
          let medioDePago = null;
          if (caja.medioDePago) {
            medioDePago = caja.medioDePago as MedioDePago; // Asegurándote de que sea del tipo enum esperado
          }
          let comision = null;
          if (caja.comision) {
            medioDePago = caja.comision as Comision; // Asegurándote de que sea del tipo enum esperado
          }
  
          // Crear la nueva caja usando los datos cargados
          const nuevaCaja = this.cajaRepository.create({
            ...caja,              // Incluyendo las propiedades de 'caja' (sin los IDs como strings)
            productos,            // Asignar el array de productos completos
            cliente,              // Asignar el objeto cliente completo
            medioDePago,          // Asignar el enum medioDePago
            comision,
            vendedor,             // Asignar el objeto completo de vendedor
          });
  
          // Guardar la nueva caja
          await this.cajaRepository.save(nuevaCaja);
          console.log(`Caja para el vendedor ${vendedor.nombre} ${vendedor.apellido} guardada.`);
        } else {
          if (!vendedor) {
            console.log(`Vendedor con ID ${caja.vendedor} no encontrado, omitiendo caja.`);
          }
          if (productos.length === 0) {
            console.log(`Productos no encontrados para la caja con ID , omitiendo.`);
          }
        }
      } catch (error) {
        console.error(`Error al cargar la caja para vendedor ID ${caja.vendedor}:`, error);
      }
    }
  }
  
  

  private async preloadFacturas() {
    console.log('Cargando facturas...');
    for (const factura of preloadData.facturas) {
      try {
        const usuario = await this.usuarioRepository.findOne({ where: { id: factura.usuarioId } });
        if (usuario) {
          await this.facturaRepository.save(this.facturaRepository.create({ ...factura, usuario }));
          console.log(`Factura para el usuario ${usuario.nombre} ${usuario.apellido} guardada.`);
        } else {
          console.log(`Usuario con ID ${factura.usuarioId} no encontrado, omitiendo factura.`);
        }
      } catch (error) {
        console.error(`Error al cargar la factura para usuario ID ${factura.usuarioId}:`, error);
      }
    }
  }

  // Nueva función de precarga de celulares
  private async preloadCellphones() {
    console.log('Cargando celulares...');
    for (const cellphone of preloadData.cellphones) {
      try {
        const exists = await this.cellphoneRepository.findOne({ where: { nombre: cellphone.nombre } });
        if (!exists) {
          const nuevoCellphone = this.cellphoneRepository.create({
            ...cellphone,
          });
  
          await this.cellphoneRepository.save(nuevoCellphone);
          console.log(`Celular ${cellphone.nombre} guardado con éxito.`);
        } else {
          console.log(`Celular ${cellphone.nombre} ya existe, omitiendo.`);
        }
      } catch (error) {
        console.error(`Error al cargar el celular ${cellphone.nombre}:`, error);
      }
    }
  }
  private async preloadClientes(): Promise<void> {
    console.log('Cargando clientes...');
    for (const cliente of preloadData.clientes) {
      try {
        // Verificar si el cliente ya existe en la base de datos por su DNI
        const exists = await this.clienteRepository.findOne({ where: { dni: cliente.dni } });
        if (!exists) {
          // Crear un nuevo cliente basado en el archivo de datos
          const nuevoCliente = this.clienteRepository.create({
            ...cliente,
          });

          // Guardar el cliente en la base de datos
          await this.clienteRepository.save(nuevoCliente);
          console.log(`Cliente con DNI ${cliente.dni} guardado con éxito.`);
        } else {
          console.log(`Cliente con DNI ${cliente.dni} ya existe, omitiendo.`);
        }
      } catch (error) {
        console.error(`Error al cargar el cliente con DNI ${cliente.dni}:`, error);
      }
    }
  }
}

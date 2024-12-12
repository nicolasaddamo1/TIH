import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import preloadData from './data.json';
import { Usuario } from 'src/Entity/usuario.entity';
import { Caja } from 'src/Entity/caja.entity';
import { Producto } from 'src/Entity/producto.entity';  // Asegúrate de importar Producto
import { Service } from 'src/Entity/service.entity';
import { Factura } from 'src/Entity/factura.entity';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class PreloadService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Caja) private readonly cajaRepository: Repository<Caja>,
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>, // Añadir repositorio de Producto
    @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Factura) private readonly facturaRepository: Repository<Factura>,
  ) {}

  async onApplicationBootstrap() {
    try {
      // await this.preloadUsuarios();
      // await this.preloadServicios();
      await this.preloadCajas();
      await this.preloadProductos(); // Llamar al método de productos
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
          const nuevoUsuario = this.usuarioRepository.create({
            ...usuario,
            role,
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
        const exists = await this.productoRepository.findOne({ where: { nombre: producto.nombre } });
        if (!exists) {
          const nuevoProducto = this.productoRepository.create({
            ...producto,
          });

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

  private async preloadServicios() {
    console.log('Cargando servicios...');
    for (const service of preloadData.services) {
      try {
        const usuario = await this.usuarioRepository.findOne({ where: { id: service.usuarioId } });
        if (usuario) {
          await this.serviceRepository.save(this.serviceRepository.create({ ...service, usuario }));
          console.log(`Servicio para el usuario ${usuario.nombre} ${usuario.apellido} guardado.`);
        } else {
          console.log(`Usuario con ID ${service.usuarioId} no encontrado, omitiendo servicio.`);
        }
      } catch (error) {
        console.error(`Error al cargar el servicio para usuario ID ${service.usuarioId}:`, error);
      }
    }
  }

  private async preloadCajas() {
    console.log('Cargando cajas...');
    for (const caja of preloadData.cajas) {
      try {
        const vendedor = await this.usuarioRepository.findOne({ where: { id: caja.vendedorId } });
        if (vendedor) {
          await this.cajaRepository.save(this.cajaRepository.create({ ...caja, vendedor }));
          console.log(`Caja para el vendedor ${vendedor.nombre} ${vendedor.apellido} guardada.`);
        } else {
          console.log(`Vendedor con ID ${caja.vendedorId} no encontrado, omitiendo caja.`);
        }
      } catch (error) {
        console.error(`Error al cargar la caja para vendedor ID ${caja.vendedorId}:`, error);
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
}

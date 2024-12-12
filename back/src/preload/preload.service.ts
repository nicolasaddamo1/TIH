import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Producto } from 'src/Entity/producto.entity';
import { Caja } from 'src/Entity/caja.entity';
import { Service } from 'src/Entity/service.entity';
import { DetalleVenta, Venta } from 'src/Entity/venta.entity';
import data from './data.json';
import { Role } from 'src/enum/roles.enum';
import { Comision } from 'src/enum/comision.enum';
import { MedioDePago } from 'src/enum/medioDePago.enum';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PreloadService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  private mapRoleToEnum(role: string): Role {
    switch (role.toLowerCase()) {
      case 'administrador':
        return Role.ADMIN;
      case 'cliente':
        return Role.CLIENT;
      case 'usuario':
        return Role.USER;
      default:
        return Role.USER;
    }
  }

  async preloadUsuarios() {
    const usuarios = data.usuarios;

    for (const usuario of usuarios) {
      console.log('Procesando usuario:', usuario);
      const dni = Number(usuario.dni);

      const existingUsuario = await this.usuarioRepository.findOneBy({ dni });
      if (!existingUsuario) {
        console.log('Usuario no encontrado, creando uno nuevo:', usuario);
        const mappedRole = this.mapRoleToEnum(usuario.role);
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUsuario = this.usuarioRepository.create({
          ...usuario,
          dni,
          role: mappedRole,
          id: usuario.id || uuidv4(), // Usar ID del JSON si existe
          password: hashedPassword,
        });

        await this.usuarioRepository.save(newUsuario);
      } else {
        console.log('Usuario ya existe en la base de datos:', existingUsuario);
      }
    }
  }

  async preloadProductos() {
    const productos = data.productos;

    for (const producto of productos) {
      console.log('Procesando producto:', producto);
      const existingProducto = await this.productoRepository.findOneBy({ nombre: producto.nombre });
      if (!existingProducto) {
        console.log('Producto no encontrado, creando uno nuevo:', producto);
        const newProducto = this.productoRepository.create({
          ...producto,
          id: producto.id || uuidv4(), // Usar ID del JSON si existe
          categoria: producto.categoria || 'Sin Categoría',
        });
        await this.productoRepository.save(newProducto);
      } else {
        console.log('Producto ya existe en la base de datos:', existingProducto);
      }
    }
  }

  normalizeName(name: string): string {
    return name ? name.trim().toLowerCase() : '';
  }
  
  async preloadCajas() {
    const cajas = data.cajas;

    for (const caja of cajas) {
      console.log('Procesando caja:', caja);
      
      // Búsqueda más flexible del vendedor
      const vendedor = await this.usuarioRepository.findOne({
        where: [
          // Intentar coincidir nombre completo exacto
          { 
            nombre: this.normalizeName(caja.vendedor.split(' ')[0]),
            apellido: this.normalizeName(caja.vendedor.split(' ')[1]) 
          },
          // Buscar por coincidencia parcial
          { 
            nombre: Like(`%${this.normalizeName(caja.vendedor.split(' ')[0])}%`),
            apellido: Like(`%${this.normalizeName(caja.vendedor.split(' ')[1])}%`)
          }
        ]
      });

      if (!vendedor) {
        console.warn(`Vendedor con nombre ${caja.vendedor} no encontrado, saltando esta caja.`);
        continue;
      }

      // Manejar productos como array o string único
      const productosNombres = Array.isArray(caja.productos)
        ? caja.productos
        : [caja.productos];

      // Buscar productos de manera más flexible
      const productos = await Promise.all(
        productosNombres.map(async (productoNombre) => {
          console.log('Buscando producto:', productoNombre);
          const producto = await this.productoRepository.findOne({
            where: [
              { nombre: productoNombre },
              { nombre: Like(`%${productoNombre}%`) }
            ]
          });
          if (!producto) {
            console.warn(`Producto con nombre ${productoNombre} no encontrado, omitiendo este producto.`);
            return null;
          }
          return producto;
        }),
      ).then((results) => results.filter((p) => p));

      console.log('Creando nueva caja con los datos:', { vendedor, productos });

      const newCaja = this.cajaRepository.create({
        medioDePago: MedioDePago[caja.medioDePago.toUpperCase()],
        comision: Comision[caja.comision.toUpperCase()],
        precioTotal: caja.precioTotal,
        observaciones: caja.observaciones,
        description: caja.description,
        vendedor,
        productos,
      });

      await this.cajaRepository.save(newCaja);
    }
  }

  async preloadServices() {
    const services = data.services;

    for (const service of services) {
      console.log('Procesando servicio:', service);
      
      // Búsqueda más flexible del usuario
      const usuario = await this.usuarioRepository.findOne({
        where: [
          { id: service.usuarioId },
          { 
            nombre: Like(`%${this.normalizeName(service.nombre)}%`),
          }
        ]
      });

      if (!usuario) {
        console.warn(`Usuario para servicio no encontrado, omitiendo: ${JSON.stringify(service)}`);
        continue;
      }

      const newService = this.serviceRepository.create({
        ...service,
        id: service.id || uuidv4(), // Usar ID del JSON si existe
        usuario,
      });

      await this.serviceRepository.save(newService);
    }
  }

  async preloadVentas() {
    const ventas = data.ventas;

    for (const venta of ventas) {
      console.log('Procesando venta:', venta);
      
      // Búsqueda más flexible del usuario
      const usuario = await this.usuarioRepository.findOne({
        where: [
          { id: venta.usuarioId },
          
        ]
      });

      if (!usuario) {
        console.warn(`Usuario para venta no encontrado, omitiendo: ${JSON.stringify(venta)}`);
        continue;
      }

      const detalles = await Promise.all(
        venta.detalles.map(async (detalle) => {
          console.log('Procesando detalle de venta:', detalle);
          
          // Búsqueda más flexible del producto
          const producto = await this.productoRepository.findOne({
            where: [
              { id: detalle.productoId },
            ]
          });

          if (!producto) {
            console.warn(`Producto para detalle de venta no encontrado, omitiendo: ${JSON.stringify(detalle)}`);
            return null;
          }
          
          return this.detalleVentaRepository.create({
            ...detalle,
            producto,
          });
        }),
      ).then((results) => results.filter((d) => d));

      console.log('Creando nueva venta con los datos:', { usuario, detalles });

      const newVenta = this.ventaRepository.create({
        usuario,
        detalles,
      });

      await this.ventaRepository.save(newVenta);
    }
  }

  async preloadAll() {
    console.log('Iniciando precarga de datos...');
    await this.preloadUsuarios();
    await this.preloadProductos();
    await this.preloadCajas();
    await this.preloadServices();
    await this.preloadVentas();
    console.log('Base de datos inicializada con datos.');
  }
}
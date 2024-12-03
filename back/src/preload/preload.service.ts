import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  // Método para mapear roles
  private mapRoleToEnum(role: string): Role {
    switch (role.toLowerCase()) {
      case 'administrador':
        return Role.ADMIN;
      case 'cliente':
        return Role.CLIENT;
      case 'usuario':
        return Role.USER;
      default:
        throw new Error(`Role no válido: ${role}`);
    }
  }

  async preloadUsuarios() {
    const usuarios = data.usuarios;

    for (const usuario of usuarios) {
      const dni = Number(usuario.dni);

      const existingUsuario = await this.usuarioRepository.findOneBy({ dni });
      if (!existingUsuario) {
        const mappedRole = this.mapRoleToEnum(usuario.role || 'Administrador');
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUsuario = this.usuarioRepository.create({
          ...usuario,
          dni,
          role: mappedRole,
          id: uuidv4(),
          password: hashedPassword,
        });

        await this.usuarioRepository.save(newUsuario);
      }
    }
  }

  async preloadProductos() {
    const productos = data.productos;

    for (const producto of productos) {
      const existingProducto = await this.productoRepository.findOneBy({ nombre: producto.nombre });
      if (!existingProducto) {
        const newProducto = this.productoRepository.create(producto);
        await this.productoRepository.save(newProducto);
      }
    }
  }

  async preloadCajas() {
    const cajas = data.cajas;

    for (const caja of cajas) {
      const newCaja = this.cajaRepository.create({
        ...caja,
        id: uuidv4(),
        fecha: new Date(),
        medioDePago: MedioDePago[caja.medioDePago.toUpperCase()],
        comision: Comision[caja.comision.toUpperCase()],
      });

      await this.cajaRepository.save(newCaja);
    }
  }

  async preloadServices() {
    const services = data.services;

    for (const service of services) {
      const usuario = await this.usuarioRepository.findOneBy({ id: service.usuarioId });
      if (usuario) {
        const newService = this.serviceRepository.create({
          ...service,
          id: uuidv4(),
          usuario,
        });

        await this.serviceRepository.save(newService);
      }
    }
  }

  async preloadVentas() {
    const ventas = data.ventas;

    for (const venta of ventas) {
      const usuario = await this.usuarioRepository.findOneBy({ id: venta.usuarioId });
      if (usuario) {
        const detalles = venta.detalles.map((detalle) =>
          this.detalleVentaRepository.create({
            ...detalle,
            producto: { id: detalle.productoId },
          }),
        );

        const newVenta = this.ventaRepository.create({
          usuario,
          detalles,
        });

        await this.ventaRepository.save(newVenta);
      }
    }
  }

  async preloadAll() {
    await this.preloadUsuarios();
    await this.preloadProductos();
    await this.preloadCajas();
    await this.preloadServices();
    await this.preloadVentas();
    console.log('Base de datos inicializada con datos.');
  }
}

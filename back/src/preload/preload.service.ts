import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Producto } from 'src/Entity/producto.entity';
import { DetalleVenta, Venta } from 'src/Entity/venta.entity';
import data from './data.json';
import { Role } from 'src/enum/roles.enum';
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
      const dni = Number(usuario.dni); // Conversión a número
  
      const existingUsuario = await this.usuarioRepository.findOneBy({ dni });
      if (!existingUsuario) {
        const mappedRole = this.mapRoleToEnum(usuario.role || 'Administrador');
  
        // Generar una contraseña predeterminada
        const password = 'password123'; // Contraseña predeterminada
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Agregar manualmente la contraseña al objeto
        const newUsuario = this.usuarioRepository.create({
          ...usuario,
          dni, // Asignar el dni ya convertido
          role: mappedRole, // Asegurar que role es del tipo correcto
          id: uuidv4(), // Generar un UUID
          password: hashedPassword, // Agregar la contraseña generada
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
    await this.preloadVentas();
    console.log('Base de datos inicializada con datos.');
  }
}

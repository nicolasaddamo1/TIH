import { Injectable } from '@nestjs/common';
import { Caja } from 'src/Entity/caja.entity';
import { Repository } from 'typeorm';
import { UpdateCajaDto } from './dto/updateCaja.dto';
import { CreateCajaDto } from './dto/createCaja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Producto } from 'src/Entity/producto.entity';
import { Cliente } from 'src/Entity/cliente.entity';

@Injectable()
export class CajaService {
    constructor(
        // private cajaRepository: Repository<Caja>,
        @InjectRepository(Caja) private cajaRepository: Repository<Caja>, 
        @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Producto) private productoRepository: Repository<Producto>,
        @InjectRepository(Cliente) private clientenRepository: Repository<Cliente>
    ) {}

    async getAllCajas(limit: number) {
        return this.cajaRepository.find({take: limit});
    }

    async getCajasByDateRange(startDate: string, endDate: string): Promise<Caja[]> {
      const queryBuilder = this.cajaRepository.createQueryBuilder('caja');
  
      return queryBuilder
          .where('caja.fecha >= :startDate', { startDate })
          .andWhere('caja.fecha <= :endDate', { endDate })
          .getMany();
  }
  

  async updateCaja(id: string, data: UpdateCajaDto): Promise<void> {
    let vendedor = null;

    // Si se proporciona un vendedor, buscarlo
    if (data.vendedor) {
        vendedor = await this.usuarioRepository.findOne({ where: { id: data.vendedor } });
        if (!vendedor) {
            throw new Error('El vendedor especificado no existe.');
        }
    }

    let productos = null;
    // Si se proporcionan productos, buscar sus objetos completos
    if (data.productos && data.productos.length > 0) {
        productos = await this.productoRepository.find({
            where: data.productos.map((id) => ({ id })),
        });

        if (productos.length !== data.productos.length) {
            throw new Error('Algunos productos especificados no existen.');
        }
    }

    let cliente = null;
    // Si se proporciona un cliente, buscar el objeto completo
    if (data.cliente) {
        cliente = await this.clientenRepository.findOne({ where: { id: data.cliente } });
        if (!cliente) {
            throw new Error('El cliente especificado no existe.');
        }
    }

    // Realizar la actualización de la caja
    await this.cajaRepository.update(id, {
        ...data,
        vendedor,       // Asignar el objeto completo de vendedor
        productos,      // Asignar el array de productos completos
        cliente,        // Asignar el objeto completo de cliente
    });
}
      async createCaja(data: CreateCajaDto): Promise<Caja> {
        // Buscar el vendedor
        const vendedor = await this.usuarioRepository.findOne({ where: { id: data.vendedor } });
        if (!vendedor) {
            throw new Error('El vendedor especificado no existe.');
        }

        const cliente = await this.clientenRepository.findOne({ where: { id: data.cliente } }); // Ajustado a cliente
        if (!cliente) {
            throw new Error('El cliente especificado no existe.');
        }
    
        // Buscar productos
        const productos = await this.productoRepository.findByIds(data.productos);
        console.log("productos:", productos)
        if (productos.length !== data.productos.length) {
            throw new Error('Algunos productos especificados no existen.');
        }
    
        // Crear la nueva caja con los datos completos
        const nuevaCaja = this.cajaRepository.create({
            ...data,
            vendedor,              // Asignar el objeto completo de vendedor
            productos,             // Asignar el array de productos completos
            cliente,               // Asignar el objeto completo de cliente
            medioDePago: data.medioDePago,  // Asignar el valor de medioDePago
        });
        console.log(nuevaCaja)
        // Guardar la caja en la base de datoss
        return this.cajaRepository.save(nuevaCaja);
    }
    
    
    async deleteCaja(id: string) {
        return this.cajaRepository.delete(id);
    }
}

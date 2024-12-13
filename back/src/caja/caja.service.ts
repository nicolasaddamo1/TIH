import { Injectable } from '@nestjs/common';
import { Caja } from 'src/Entity/caja.entity';
import { Repository } from 'typeorm';
import { UpdateCajaDto } from './dto/updateCaja.dto';
import { CreateCajaDto } from './dto/createCaja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Producto } from 'src/Entity/producto.entity';

@Injectable()
export class CajaService {
    constructor(
        // private cajaRepository: Repository<Caja>,
        @InjectRepository(Caja) private cajaRepository: Repository<Caja>, 
        @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Producto) private productoRepository: Repository<Producto>,
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
      
        if (data.vendedor) {
          vendedor = await this.usuarioRepository.findOne({ where: { id: data.vendedor } });
          if (!vendedor) {
            throw new Error('El vendedor especificado no existe.');
          }
        }
      
        let productos = null;
        if (data.productos && data.productos.length > 0) {
          productos = await this.productoRepository.find({
            where: data.productos.map((id) => ({ id })),
          });
      
          if (productos.length !== data.productos.length) {
            throw new Error('Algunos productos especificados no existen.');
          }
        }
      
        await this.cajaRepository.update(id, {
          ...data,
          vendedor, 
          productos, 
        });
      }
      
      

      async createCaja(data: CreateCajaDto): Promise<Caja> {
        const vendedor = await this.usuarioRepository.findOne({ where: { id: data.vendedor } });
        if (!vendedor) {
          throw new Error('El vendedor especificado no existe.');
        }
    
        const productos = JSON.stringify(data.productos);
    
        const nuevaCaja = this.cajaRepository.create({
          ...data,
          vendedor,
          productos: data.productos,
        });
    
        return this.cajaRepository.save(nuevaCaja);
      }
    async deleteCaja(id: string) {
        return this.cajaRepository.delete(id);
    }
}

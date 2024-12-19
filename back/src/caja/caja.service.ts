import { Injectable } from '@nestjs/common';
import { Caja } from 'src/Entity/caja.entity';
import { Between, Repository } from 'typeorm';
import { UpdateCajaDto } from './dto/updateCaja.dto';
import { CreateCajaDto } from './dto/createCaja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Producto, Cellphone } from 'src/Entity/producto.entity';
import { Cliente } from 'src/Entity/cliente.entity';

@Injectable()
export class CajaService {
    constructor(
        // private cajaRepository: Repository<Caja>,
        @InjectRepository(Caja) private cajaRepository: Repository<Caja>, 
        @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Producto) private productoRepository: Repository<Producto>,
        @InjectRepository(Cellphone) private cellphoneRepository: Repository<Cellphone>,
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
        vendedor,       
        productos,      
        cliente,        
    });
    }
    async createCaja(data: CreateCajaDto): Promise<Caja> {
        const vendedor = await this.usuarioRepository.findOne({ where: { id: data.vendedor } });
        if (!vendedor) throw new Error('Vendedor no existe');
    
        const cliente = await this.clientenRepository.findOne({ where: { id: data.cliente } });
        if (!cliente) throw new Error('Cliente no existe');

        const productos = [];
        for (const id of data.productos) {
            const cell = await this.cellphoneRepository.findOne({ where: { id } });
            const acc = await this.productoRepository.findOne({ where: { id } });
            if (cell) {
                productos.push(cell.id);
            } else if (acc) {
                productos.push(acc.id);
            } else {
                console.warn(`Producto no encontrado en la tabla producto: ${id}`);
            }
        }

        if (productos.length !== data.productos.length) {
            throw new Error('Algunos productos especificados no existen.');
        }
    
        const nuevaCaja = this.cajaRepository.create({
            ...data,
            vendedor,
            productos,
            cliente,
        });
    
        return this.cajaRepository.save(nuevaCaja);
    }
  
    async deleteCaja(id: string) {
        return this.cajaRepository.delete(id);
    }
    async getVentasYComisionesByVendedor(
        startDate: string,
        endDate: string,
        vendedorId?: string
    ): Promise<{
        vendedorId: string;
        ventas: {
            id: string;
            fecha: string;
            comision: number;
            tipoComision: string;
        }[];
        totalComision: number;
    }[]> {
        // Definir las variables para los valores de comisión
        const comisionVentaAccesorio = 100; // Monto fijo para ventas de accesorios
        const comisionVentaCelular = 2000; // Monto fijo para ventas de celulares
    
        const queryBuilder = this.cajaRepository.createQueryBuilder('caja')
            .select('caja.vendedorId', 'vendedorId')
            .addSelect('caja.id', 'ventaId')
            .addSelect('caja.fecha', 'fecha')
            .addSelect('caja.comision', 'comision')
            .addSelect('caja.comision', 'tipoComision') // Asegúrate de ajustar esta columna si tienes diferentes tipos de comisiones
            .where('caja.fecha >= :startDate', { startDate })
            .andWhere('caja.fecha <= :endDate', { endDate });
    
        // Si se proporciona vendedorId, agregar al filtro
        if (vendedorId) {
            queryBuilder.andWhere('caja.vendedorId = :vendedorId', { vendedorId });
        }
    
        queryBuilder.addOrderBy('caja.vendedorId', vendedorId ? undefined : 'ASC')
            .addOrderBy('caja.comision', 'DESC')
            .addOrderBy('caja.fecha', 'ASC');
    
        const rawResults = await queryBuilder.getRawMany();
    
        if (vendedorId && rawResults.length === 0) {
            throw new Error(`No se encontraron ventas para el vendedor con ID: ${vendedorId}`);
        }
    
        // Definir el tipo del objeto agrupado
        type GroupedResults = {
            [key: string]: {
                vendedorId: string;
                ventas: {
                    id: string;
                    fecha: string;
                    comision: number;
                    tipoComision: string;
                }[];
                totalComision: number;
            };
        };
    
        const groupedResults: GroupedResults = rawResults.reduce((acc, row) => {
            const vendedorId = row.vendedorId;
            if (!acc[vendedorId]) {
                acc[vendedorId] = {
                    vendedorId,
                    ventas: [],
                    totalComision: 0,
                };
            }
    
            // Determinar la comisión dependiendo del tipo
            let comision = 0;
            if (row.tipoComision === 'Venta') {
                comision = comisionVentaAccesorio;
            } else if (row.tipoComision === 'Celular') {
                comision = comisionVentaCelular;
            }
    
            acc[vendedorId].ventas.push({
                id: row.ventaId,
                fecha: row.fecha,
                comision,
                tipoComision: row.tipoComision,
            });
            acc[vendedorId].totalComision += comision;
            return acc;
        }, {} as GroupedResults);
    
        // Convertir el objeto agrupado en un array
        return Object.values(groupedResults).map((group) => ({
            vendedorId: group.vendedorId,
            ventas: group.ventas.sort((a, b) => {
                if (a.tipoComision === b.tipoComision) {
                    return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
                }
                return a.tipoComision.localeCompare(b.tipoComision);
            }),
            totalComision: group.totalComision,
        }));
    }
       
}

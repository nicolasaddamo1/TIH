import { Injectable } from '@nestjs/common';
import { Caja } from 'src/Entity/caja.entity';
import { Repository } from 'typeorm';
import { UpdateCajaDto } from './dto/updateCaja.dto';
import { CreateCajaDto } from './dto/createCaja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Producto, Cellphone } from 'src/Entity/producto.entity';
import { Cliente } from 'src/Entity/cliente.entity';
import { MedioDePago } from 'src/enum/medioDePago.enum';

@Injectable()
export class CajaService {
  constructor(
    // private cajaRepository: Repository<Caja>,
    @InjectRepository(Caja) private cajaRepository: Repository<Caja>,
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Cellphone)
    private cellphoneRepository: Repository<Cellphone>,
    @InjectRepository(Cliente) private clientenRepository: Repository<Cliente>,
  ) {}

  async getAllCajas(limit: number) {
    return this.cajaRepository.find({ take: limit });
  }

  //metrica de ventas por fechas
  async getCajasByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Caja[]> {
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
      vendedor = await this.usuarioRepository.findOne({
        where: { id: data.vendedor },
      });
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
      cliente = await this.clientenRepository.findOne({
        where: { id: data.cliente },
      });
      if (!cliente) {
        throw new Error('El cliente especificado no existe.');
      }
    }

    // Realizar la actualización de la caja
    await this.cajaRepository.update(id, {
      ...data,
      vendedorId: data.vendedor,
      productos,
      clienteId: data.cliente,
    });
  }
  //   async createCaja(data: CreateCajaDto): Promise<Caja> {
  //     const vendedor = await this.usuarioRepository.findOne({
  //       where: { id: data.vendedor },
  //     });
  //     if (!vendedor) throw new Error('Vendedor no existe');

  //     // Validar que se haya seleccionado un cliente
  //     if (!data.cliente) {
  //       throw new Error('Debe seleccionar un cliente para crear la venta.');
  //     }

  //         const cliente = await this.clientenRepository.findOne({ where: { id: data.cliente } });
  //         if (!cliente) throw new Error('Cliente no existe');

  //         // Validar que se hayan seleccionado productos
  //         if (!data.productos || data.productos.length === 0) {
  //             throw new Error('Debe seleccionar al menos un producto para crear la venta.');
  //         }

  //         // Buscar productos en ambas tablas (producto y cellphone)
  //         console.log('Buscando productos con IDs:', data.productos);

  //         const productos = await this.productoRepository.find({
  //             where: data.productos.map((id) => ({ id })),
  //         });

  //         const celulares = await this.cellphoneRepository.find({
  //             where: data.productos.map((id) => ({ id })),
  //         });

  //         // Combinar productos y celulares
  //         const todosLosProductos = [...productos, ...celulares];
  //         console.log('Productos encontrados:', productos.map(p => ({ id: p.id, nombre: p.nombre, tipo: 'Producto' })));
  //         console.log('Celulares encontrados:', celulares.map(p => ({ id: p.id, nombre: p.nombre, tipo: 'Cellphone' })));
  //         console.log('Total productos encontrados:', todosLosProductos.length);

  //         if (todosLosProductos.length !== data.productos.length) {
  //             const productosEncontrados = todosLosProductos.map(p => p.id);
  //             const productosNoEncontrados = data.productos.filter(id => !productosEncontrados.includes(id));
  //             console.log('Productos no encontrados:', productosNoEncontrados);
  //             throw new Error(`Algunos productos especificados no existen: ${productosNoEncontrados.join(', ')}`);
  //         }

  //         // Actualizar fecha de venta para celulares
  //         if (celulares.length > 0) {
  //             celulares.forEach(cell => {
  //                 cell.fechaVenta = new Date();
  //             });
  //             await this.cellphoneRepository.save(celulares);
  //         }

  //         const nuevaCaja = this.cajaRepository.create({
  //             ...data,
  //             vendedorId: data.vendedor,
  //             productos: todosLosProductos,
  //             clienteId: data.cliente,
  //         });

  //         return this.cajaRepository.save(nuevaCaja);
  //     }
  async createCaja(data: CreateCajaDto): Promise<Caja> {
    const vendedor = await this.usuarioRepository.findOne({
      where: { id: data.vendedor },
    });
    if (!vendedor) throw new Error('Vendedor no existe');

    if (!data.cliente) {
      throw new Error('Debe seleccionar un cliente para crear la venta.');
    }

    const cliente = await this.clientenRepository.findOne({
      where: { id: data.cliente },
    });
    if (!cliente) throw new Error('Cliente no existe');

    if (!data.productos || data.productos.length === 0) {
      throw new Error(
        'Debe seleccionar al menos un producto para crear la venta.',
      );
    }

    console.log('Separando productos y celulares para IDs:', data.productos);

    // Buscar cuáles IDs son productos regulares y cuáles son celulares
    const productos = await this.productoRepository.find({
      where: data.productos.map((id) => ({ id })),
    });

    const celulares = await this.cellphoneRepository.find({
      where: data.productos.map((id) => ({ id })),
    });

    const productosEncontrados = [
      ...productos.map((p) => p.id),
      ...celulares.map((c) => c.id),
    ];
    const productosNoEncontrados = data.productos.filter(
      (id) => !productosEncontrados.includes(id),
    );

    if (productosNoEncontrados.length > 0) {
      console.log('Productos no encontrados:', productosNoEncontrados);
      throw new Error(
        `Algunos productos especificados no existen: ${productosNoEncontrados.join(', ')}`,
      );
    }

    console.log(
      `Encontrados ${productos.length} productos y ${celulares.length} celulares`,
    );

    // Actualizar fecha de venta para celulares
    if (celulares.length > 0) {
      celulares.forEach((cell) => {
        cell.fechaVenta = new Date();
      });
      await this.cellphoneRepository.save(celulares);
      console.log(
        'Fechas de venta actualizadas para celulares:',
        celulares.map((c) => c.id),
      );
    }

    // Crear la nueva caja con ambos tipos de productos
    const nuevaCaja = this.cajaRepository.create({
      ...data,
      vendedorId: data.vendedor,
      productos: productos.length > 0 ? productos : undefined,
      celulares: celulares.length > 0 ? celulares : undefined,
      clienteId: data.cliente,
    });

    return this.cajaRepository.save(nuevaCaja);
  }

  async deleteCaja(id: string) {
    return this.cajaRepository.delete(id);
  }
  //metrica de comisiones por vendedor
  async getVentasYComisionesByVendedor(
    startDate: string,
    endDate: string,
    vendedorId?: string,
  ): Promise<
    {
      vendedorId: string;
      ventas: {
        id: string;
        fecha: string;
        comision: number;
        tipoComision: string;
      }[];
      totalComision: number;
    }[]
  > {
    // Definir las variables para los valores de comisión
    const comisionVentaAccesorio = 100; // Monto fijo para ventas de accesorios
    const comisionVentaCelular = 2000; // Monto fijo para ventas de celulares

    const queryBuilder = this.cajaRepository
      .createQueryBuilder('caja')
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

    queryBuilder
      .addOrderBy('caja.vendedorId', vendedorId ? undefined : 'ASC')
      .addOrderBy('caja.comision', 'DESC')
      .addOrderBy('caja.fecha', 'ASC');

    const rawResults = await queryBuilder.getRawMany();

    if (vendedorId && rawResults.length === 0) {
      throw new Error(
        `No se encontraron ventas para el vendedor con ID: ${vendedorId}`,
      );
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
  //metrica de tipo de pago
  async getCajasByTypeOfPayment(
    startDate: string,
    endDate: string,
    medioDePago?: MedioDePago,
  ): Promise<Caja[]> {
    const queryBuilder = this.cajaRepository
      .createQueryBuilder('caja')
      .where('caja.fecha >= :startDate', { startDate })
      .andWhere('caja.fecha <= :endDate', { endDate });

    // Agregar filtro por medio de pago si se proporciona
    if (medioDePago) {
      queryBuilder.andWhere('caja.medioDePago = :medioDePago', { medioDePago });
    }

    return queryBuilder.getMany();
  }
}

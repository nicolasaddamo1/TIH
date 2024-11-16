import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/Entity/producto.entity';
import { DetalleVenta, Venta } from 'src/Entity/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async crearVenta(userId: string, items: { productId: string; quantity: number }[]): Promise<Venta> {
    const detalles: DetalleVenta[] = [];

    for (const item of items) {
      const producto = await this.productoRepository.findOne({ where: { id: item.productId } });

      if (!producto || producto.stock < item.quantity) {
        throw new NotFoundException(`Producto no encontrado o stock insuficiente: ${item.productId}`);
      }

      const detalle = this.detalleVentaRepository.create({
        producto,
        cantidad: item.quantity,
        precioUnitario: producto.precio,
        total: producto.precio * item.quantity,
      });

      detalles.push(detalle);

      // Actualizar stock del producto
      producto.stock -= item.quantity;
      await this.productoRepository.save(producto);
    }

    const venta = this.ventaRepository.create({
      usuario: { id: userId } as any,
      detalles,
    });

    return this.ventaRepository.save(venta);
  }
}

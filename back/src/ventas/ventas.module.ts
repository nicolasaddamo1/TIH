import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/Entity/producto.entity';
import { DetalleVenta, Venta } from 'src/Entity/venta.entity';
import { VentaController } from './ventas.controller';
import { VentaService } from './ventas.service';


@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, Producto])],
  controllers: [VentaController],
  providers: [VentaService],
})
export class VentaModule {}

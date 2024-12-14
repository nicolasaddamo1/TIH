import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/Entity/producto.entity';
import { Cellphone } from 'src/Entity/cellphone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Cellphone]), 
],
  controllers: [ProductoController],
  providers: [ProductoService]
})
export class ProductoModule {}

import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cellphone, Producto } from 'src/Entity/producto.entity';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Cellphone])],
  controllers: [ProductoController],
  providers: [ProductoService, FirebaseService],
})
export class ProductoModule {}

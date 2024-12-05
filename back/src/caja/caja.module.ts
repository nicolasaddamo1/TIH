import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from 'src/Entity/caja.entity';
import { Producto } from 'src/Entity/producto.entity';
import { Usuario } from 'src/Entity/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caja, Producto, Usuario])],
  providers: [CajaService],
  controllers: [CajaController],
  exports: [CajaService],
})
export class CajaModule {}

import { Module } from '@nestjs/common';
import { ReparacionService } from './reparacion.service';
import { ReparacionController } from './reparacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from 'src/Entity/caja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caja])],
  providers: [ReparacionService],
  controllers: [ReparacionController]
})
export class ReparacionModule {
  
}

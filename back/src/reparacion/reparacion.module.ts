import { Module } from '@nestjs/common';
import { ReparacionService } from './reparacion.service';
import { ReparacionController } from './reparacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/Entity/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [ReparacionService],
  controllers: [ReparacionController]
})
export class ReparacionModule {
  
}

import { Module } from '@nestjs/common';
import { ReparacionService } from './reparacion.service';
import { ReparacionController } from './reparacion.controller';

@Module({
  providers: [ReparacionService],
  controllers: [ReparacionController]
})
export class ReparacionModule {
  
}

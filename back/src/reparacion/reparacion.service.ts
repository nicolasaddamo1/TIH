import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateServiceDto } from './dto/updateService.dto';
import { CreateServiceDto } from './dto/createService.dto';
import { Caja } from 'src/Entity/caja.entity';
import * as comission from '../enum/comision.enum';

@Injectable()
export class ReparacionService {
    constructor(
   @InjectRepository(Caja) private cajaRepository: Repository<Caja>
   ) {}
   async getServices() {
      return this.cajaRepository.find();
    }

   async createService(data: CreateServiceDto) {
      const newService = this.cajaRepository.create(data);
      newService.comision = comission.Comision.SERVICIO;
      return this.cajaRepository.save(newService);
    }

   async updateService(id: string, data: UpdateServiceDto) {
      return this.cajaRepository.update(id, data);
   }
   async deleteService(id) {
      return this.cajaRepository.delete(id);
   }
}

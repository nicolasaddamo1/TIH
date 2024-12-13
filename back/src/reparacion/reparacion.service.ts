import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/Entity/service.entity';
import { Repository } from 'typeorm';
import { UpdateServiceDto } from './dto/updateService.dto';
import { CreateServiceDto } from './dto/createService.dto';

@Injectable()
export class ReparacionService {
    constructor(
        @InjectRepository(Service) private reparacionRepository: Repository<Service>,
    ) {}
   async getServices() {
      return this.reparacionRepository.find();
    }

   async createService(data: CreateServiceDto) {
        const newService = this.reparacionRepository.create(data);
        return this.reparacionRepository.save(newService);
    }

   async updateService(id: string, data: UpdateServiceDto) {
      return this.reparacionRepository.update(id, data);
   }
   async deleteService(id) {
      return this.reparacionRepository.delete(id);
   }
}

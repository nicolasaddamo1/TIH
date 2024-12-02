import { Injectable } from '@nestjs/common';
import { Caja } from 'src/Entity/caja.entity';
import { Repository } from 'typeorm';
import { UpdateCajaDto } from './dto/updateCaja.dto';
import { CreateCajaDto } from './dto/createCaja.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CajaService {
    constructor(
        // private cajaRepository: Repository<Caja>,
        @InjectRepository(Caja) private cajaRepository: Repository<Caja>, // Asegúrate de que esté bien inyectado

    ) {}

    async getAllCajas(limit: number) {
        return this.cajaRepository.find({take: limit});
    }

    async updateCaja(id: string, data: UpdateCajaDto) {

        return this.cajaRepository.update(id, data);
    }

    async createCaja(data: CreateCajaDto) {
        return this.cajaRepository.save(data);
    }

    async deleteCaja(id: string) {
        return this.cajaRepository.delete(id);
    }
}

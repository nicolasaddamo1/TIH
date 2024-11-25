import { Injectable } from '@nestjs/common';
import { Caja } from 'src/Entity/caja.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CajaService {
    constructor(
        private cajaRepository: Repository<Caja>,
    ) {}

    async getAllCajas(limit: number) {
        return this.cajaRepository.find({take: limit});
    }
}

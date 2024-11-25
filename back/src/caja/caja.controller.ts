import { Body, Controller, Get } from '@nestjs/common';
import { CajaService } from './caja.service';

@Controller('caja')
export class CajaController {
    constructor(
        private readonly cajaService: CajaService
    ) {}

    @Get()
    async getAllCajas(
        @Body('limit') limit:number
    ) {  
        return this.cajaService.getAllCajas(limit);
    }
}

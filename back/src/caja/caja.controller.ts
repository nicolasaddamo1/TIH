import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CajaService } from './caja.service';
import { UpdateCajaDto } from './dto/updateCaja.dto';

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

    @Put(':id')
    async updateCaja(
        @Param('id') id:string,
        @Body('data') data:UpdateCajaDto
    ) {
        return this.cajaService.updateCaja(id, data);
    }

}

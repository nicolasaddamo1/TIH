import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CajaService } from './caja.service';
import { UpdateCajaDto } from './dto/updateCaja.dto';
import { CreateCajaDto } from './dto/createCaja.dto';

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

    @Post()
    async createCaja(
        @Body('data') data:CreateCajaDto
    ) {
        return this.cajaService.createCaja(data);
    }

    @Put(':id')
    async updateCaja(
        @Param('id') id:string,
        @Body('data') data:UpdateCajaDto
    ) {
        return this.cajaService.updateCaja(id, data);
    }

    @Delete(':id')
    async deleteCaja(
        @Param('id') id:string
    ) {
        return this.cajaService.deleteCaja(id);
    }

}

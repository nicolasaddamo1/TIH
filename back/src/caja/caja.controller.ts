import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CajaService } from './caja.service';
import { UpdateCajaDto } from './dto/updateCaja.dto';
import { CreateCajaDto } from './dto/createCaja.dto';
import { Caja } from 'src/Entity/caja.entity';

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

    @Get('by-date-range')
    async getCajasByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<Caja[]> {
        return this.cajaService.getCajasByDateRange(startDate, endDate);
    }
    @Get('comisiones')
    async getComisionesByVendedor(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('vendedorId') vendedorId: string,
    ):  Promise<any> {
        return this.cajaService.getVentasYComisionesByVendedor(startDate, endDate, vendedorId);
    }

    @Post()
    async createCaja(
        @Body() data:CreateCajaDto
    ) {
        console.log("esto es lo que se recibe: ", data)
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

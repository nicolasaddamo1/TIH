import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReparacionService } from './reparacion.service';
import { UpdateServiceDto } from './dto/updateService.dto';
import { CreateServiceDto } from './dto/createService.dto';

@Controller('reparacion')
export class ReparacionController {
   constructor(
      private readonly reparacionService: ReparacionService
   ) {}
   @Get()
   async getServices() {
      return this.reparacionService.getServices();
   }

   @Post()
   async createService(
      @Body() data:CreateServiceDto
   ) {
      return this.reparacionService.createService(data);
   }

   @Put(':id')
   async updateService(
      @Param('id') id: string,
      @Body() data:UpdateServiceDto
   ) {
      return this.reparacionService.updateService(id, data);
   }

   @Delete(':id')
   async deleteService(
      @Param('id') id: string
   ) {
      return this.reparacionService.deleteService(id);
   }

}

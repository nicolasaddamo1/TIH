import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common'

@Controller('clientes')
export class ClienteController{
    constructor(
        private clientesService:ClientesService
    ){}

    @Get()
    async getAllClients(){
        return this.clientesService.getAllClients()
    }
    @Get(':dni')
    async getClients(
        @Param('dni') dni:number
    ){
        return this.clientesService.getAllClients(dni)
    }
    @Put(':id')
    async updateClients(
        @Param('id') id:string,
        @Body() data: any
    ){
        return this.clientesService.updateClients(id,data)
    }

    @Delete(':id')
    async deleteClient(
        @Param('id') id:string,
    ){
        return this.clientesService.deleteClient(id)
    }

}
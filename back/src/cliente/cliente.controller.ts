import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common'
import { ClienteService } from './cliente.service'

@Controller('clientes')
export class ClienteController{
    constructor(
        private clientesService: ClienteService
    ){}

    @Get()
    async getAllClients(){
        return this.clientesService.getAllClients()
    }
    @Get(':dni')
    async getClients(
        @Param('dni') dni:string
    ){
        const dni2 = parseInt(dni)
        console.log(dni2)
        return this.clientesService.getClients(dni2)
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
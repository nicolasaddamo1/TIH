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
        @Param('dni') dni:number
    ):Promise<string>{
        return this.clientesService.getClients(dni)
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
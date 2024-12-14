import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cliente } from "src/Entity/cliente.entity";
import { Repository } from "typeorm";



@Injectable()
export class ClienteService{
    constructor(
        @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>
    )
    {}
    
    async getAllClients(){
        return this.clienteRepository.find()
    }

    async getClients(dni:number):Promise<string>{
        const cliente = await this.clienteRepository.findOneBy({dni})
        return cliente.id
    }
    
    async updateClients(id:string, data){
        const foundedClient = await this.clienteRepository.findOneBy({id})
        if (!foundedClient){
            return "Cliente No encontrado"
        }
        
        foundedClient.apellido=data.apellido
        foundedClient.direccion=data.direccion
        foundedClient.dni=data.dni
        foundedClient.nombre=data.nombre
        foundedClient.nroTelefono=data.nroTelefono
        
        return await this.clienteRepository.update(id, foundedClient)
    }
    async deleteClient(id: string) {
        const foundedClient = await this.clienteRepository.findOneBy({id})
        if (!foundedClient){
            return "Cliente No encontrado"
        }
        
        return this.clienteRepository.delete(id)
    }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/Entity/cliente.entity';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/Cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>,
  ) {}
  async createCliente(data: CreateClienteDto) {
    try {
      const newClient = this.clienteRepository.create(data);
      return await this.clienteRepository.save(newClient);
    } catch (error: any) {
      if (error.code === '23505') {
        // PostgreSQL unique constraint violation
        throw new Error(`Ya existe un cliente con el DNI ${data.dni}`);
      }
      throw error;
    }
  }

  async getAllClients() {
    return this.clienteRepository.find();
  }

  async getClients(dni: number) {
    const cliente = await this.clienteRepository.findOneBy({ dni });
    console.log('este es el cliente encontrado:', cliente);

    if (!cliente) {
      throw new NotFoundException(`Cliente con DNI ${dni} no encontrado`);
    }

    return cliente;
  }

  async updateClients(id: string, data) {
    const foundedClient = await this.clienteRepository.findOneBy({ id });
    if (!foundedClient) {
      return 'Cliente No encontrado';
    }

    foundedClient.apellido = data.apellido;
    foundedClient.direccion = data.direccion;
    foundedClient.dni = data.dni;
    foundedClient.nombre = data.nombre;
    foundedClient.nroTelefono = data.nroTelefono;

    return await this.clienteRepository.update(id, foundedClient);
  }
  async deleteClient(id: string) {
    const foundedClient = await this.clienteRepository.findOneBy({ id });
    if (!foundedClient) {
      return 'Cliente No encontrado';
    }

    return this.clienteRepository.delete(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/Cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private clientesService: ClienteService) {}

  @Post()
  async createCliente(@Body() data: CreateClienteDto) {
    try {
      // Validar que el DNI sea numérico
      if (typeof data.dni === 'string' && !/^\d+$/.test(data.dni)) {
        throw new Error('El DNI debe contener solo números');
      }
      if (
        typeof data.nroTelefono === 'string' &&
        !/^\d+$/.test(data.nroTelefono)
      ) {
        throw new Error('El número de teléfono debe contener solo números');
      }

      return await this.clientesService.createCliente(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`Error al crear cliente: ${errorMessage}`);
    }
  }
  @Get()
  async getAllClients() {
    return this.clientesService.getAllClients();
  }
  @Get(':dni')
  async getClients(@Param('dni') dni: string) {
    // Validar que el DNI sea numérico
    if (!/^\d+$/.test(dni)) {
      throw new Error('El DNI debe contener solo números');
    }
    const dni2 = parseInt(dni);
    console.log(dni2);
    return this.clientesService.getClients(dni2);
  }
  @Put(':id')
  async updateClients(@Param('id') id: string, @Body() data: any) {
    return this.clientesService.updateClients(id, data);
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    return this.clientesService.deleteClient(id);
  }
}

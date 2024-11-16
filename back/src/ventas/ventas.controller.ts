import { Controller, Post, Body } from '@nestjs/common';
import { VentaService } from './ventas.service';

@Controller('ventas')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  async registrarVenta(@Body() body: { userId: string; items: { productId: string; quantity: number }[] }) {
    const { userId, items } = body;
    return this.ventaService.crearVenta(userId, items);
  }
}

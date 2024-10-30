import { Controller, Get } from '@nestjs/common';
import { get } from 'http';

@Controller('producto')
export class ProductoController {
    constructor(){}
    @Get()
    async getAllProducts(){}
}

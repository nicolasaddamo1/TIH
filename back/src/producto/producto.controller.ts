import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { get } from 'http';

@Controller('producto')
export class ProductoController {
    constructor(){}
    @Get()
    async getAllProducts(){
        return "hola"
    }
    
    @Get(':id')
    async getProductsById(){
        return "hola"
    }

    @Post()
    async createProducts(){
        return "hola"
    }

    @Put(':id')
    async updateProducts(){
        return "hola"
    }

    @Delete(':id')
    async deleteProducts(){
        return "hola"
    }

}

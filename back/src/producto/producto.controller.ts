import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductDto } from './dto/product.dto';

@Controller('producto')
export class ProductoController {
    constructor(
        private  productoService:ProductoService
    ){}
    
    @Get()
    async getAllProducts(){
        return this.productoService.getAllProducts()
    }
    
    @Get(':id')
    async getProductsById(
        @Param('id') id:string
    ){
        return this.productoService.getProductsById(id)
        }

    @Post()
    async createProducts(
        @Body()data:CreateProductDto
    ){
        return this.productoService.createProducts(data)
    }

    @Put(':id')
    async updateProducts(
        @Param('id') id:string,
        @Body()data:CreateProductDto
    ){
        return this.productoService.updateProducts(id, data)

    }

    @Delete(':id')
    async deleteProducts(
        @Param('id') id:string
    ){
        console.log(id)
        return this.productoService.deleteProductsService(id)
    }

}

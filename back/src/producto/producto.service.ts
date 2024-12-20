import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cellphone, Producto } from 'src/Entity/producto.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCellhponeDto, UpdateCellphoneDto } from './dto/cellphone.dto';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(Producto) private productoRepository: Repository<Producto>,
        @InjectRepository(Cellphone) private celularRepository: Repository<Cellphone>
    ) {}
    async getAllProducts(){
        return await this.productoRepository.find()
    }
    async getAllCelulares() {
        return await this.celularRepository.find()
    }
    async getProductsById(id){
        return await this.productoRepository.findOneBy({id})
    }

    async createProducts(data:CreateProductDto){

        const product = await this.productoRepository.create(data)
        return await this.productoRepository.save(product)
    
    }
    async createCellphone(data:CreateCellhponeDto){

        const cell = await this.celularRepository.create(data)
        return await this.celularRepository.save(cell)
    
    }

    async updateProducts(id:string, data:UpdateProductDto){

        const foundedProduct = await this.productoRepository.findOneBy({id})
        if (!foundedProduct) {
            throw new Error('Product not found')
        }

        foundedProduct.nombre = data.nombre
        foundedProduct.precio = data.precio
        foundedProduct.stock = data.stock
        foundedProduct.imagen = data.imagen
        foundedProduct.categoria = data.categoria

        return await this.productoRepository.update(id, foundedProduct)
    }
    async updateCellphone(id:string, data:UpdateCellphoneDto){

        const foundedProduct = await this.celularRepository.findOneBy({id})
        if (!foundedProduct) {
            throw new Error('Product not found')
        }
        foundedProduct.nombre = data.nombre
        foundedProduct.precio = data.precio
        foundedProduct.stock = data.stock
        foundedProduct.imagen = data.imagen
        foundedProduct.categoria = data.categoria
        foundedProduct.fechaCompra = data.fechaCompra
        foundedProduct.fechaVenta = data.fechaVenta
        foundedProduct.estado = data.estado
        foundedProduct.descripcionEstado = data.descripcionEstado

        return await this.celularRepository.update(id, foundedProduct)
    }

    async deleteProductsService(id:string){
        console.log(id);
        
        const foundedProduct = await this.productoRepository.findOneBy({id})
        if (!foundedProduct) {
            throw new Error('Product not found')
        }
    return await this.productoRepository.delete(id)
    }
}

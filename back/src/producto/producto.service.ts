import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/Entity/producto.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductoService {
constructor(
    @InjectRepository(Producto) private productoRepository: Repository<Producto>,
) {}
    async getAllProducts(){
        return await this.productoRepository.find()
    }
    
    async getProductsById(id){
        return await this.productoRepository.findOneBy({id})
    }


    async createProducts(data:CreateProductDto){

        const product = await this.productoRepository.create(data)
        return await this.productoRepository.save(product)
    
    }

    async updateProducts(id:string, data:UpdateProductDto){

        const foundedProduct = await this.productoRepository.findOneBy({id})
        if (!foundedProduct) {
            throw new Error('Product not found')
        }

        foundedProduct.precio = data.precio
        foundedProduct.stock = data.stock
        foundedProduct.imagen = data.imagen
        foundedProduct.categoria = data.categoria

        return await this.productoRepository.update(id, foundedProduct)
    }



    async deleteProducts(id:string){
    return await this.productoRepository.delete(id)
    }
}

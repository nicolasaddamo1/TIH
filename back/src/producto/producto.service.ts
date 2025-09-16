import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cellphone, Producto } from 'src/Entity/producto.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCellhponeDto, UpdateCellphoneDto } from './dto/cellphone.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Cellphone)
    private celularRepository: Repository<Cellphone>,
  ) {}
  async getAllProducts() {
    return await this.productoRepository.find();
  }
  async getAllCelulares() {
    return await this.celularRepository.find();
  }

  async getAllCelularesByImei(imei: string) {
    return await this.celularRepository.findOne({
      where: { imei },
    });
  }

  // Búsqueda de productos por marca, modelo o proveedor
  async searchProducts(searchTerm: string) {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.marca ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('producto.modelo ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('producto.proveedor ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }

  // Búsqueda de celulares por marca, modelo, proveedor o fecha de compra
  async searchCellphones(searchTerm: string) {
    return await this.celularRepository
      .createQueryBuilder('cellphone')
      .where('cellphone.marca ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('cellphone.modelo ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('cellphone.proveedor ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }
  async getProductsById(id) {
    return await this.productoRepository.findOneBy({ id });
  }

  async createProducts(data: CreateProductDto) {
    const product = await this.productoRepository.create(data);
    return await this.productoRepository.save(product);
  }
  async createCellphone(data: CreateCellhponeDto) {
    const cell = await this.celularRepository.create(data);
    return await this.celularRepository.save(cell);
  }

  async updateProducts(id: string, data: UpdateProductDto) {
    const foundedProduct = await this.productoRepository.findOneBy({ id });
    if (!foundedProduct) {
      throw new Error('Product not found');
    }

    if (data.marca) foundedProduct.marca = data.marca;
    if (data.modelo) foundedProduct.modelo = data.modelo;
    if (data.proveedor) foundedProduct.proveedor = data.proveedor;
    if (data.precio) foundedProduct.precio = data.precio;
    if (data.stock) foundedProduct.stock = data.stock;
    if (data.imagen) foundedProduct.imagen = data.imagen;
    if (data.category) {
      foundedProduct.category = data.category as any;
    }
    if (data.suplier) {
      foundedProduct.suplier = data.suplier as any;
    }

    return await this.productoRepository.update(id, foundedProduct);
  }
  async updateCellphone(id: string, data: UpdateCellphoneDto) {
    const foundedProduct = await this.celularRepository.findOneBy({ id });
    if (!foundedProduct) {
      throw new Error('Product not found');
    }
    if (data.marca) foundedProduct.marca = data.marca;
    if (data.modelo) foundedProduct.modelo = data.modelo;
    if (data.proveedor) foundedProduct.proveedor = data.proveedor;
    if (data.precio) foundedProduct.precio = data.precio;
    if (data.stock) foundedProduct.stock = data.stock;
    if (data.imagen) foundedProduct.imagen = data.imagen;
    if (data.categoria) foundedProduct.category = data.categoria as any;
    if (data.fechaCompra) foundedProduct.fechaCompra = data.fechaCompra;
    if (data.fechaVenta) foundedProduct.fechaVenta = data.fechaVenta;
    if (data.estado) foundedProduct.estado = data.estado;
    if (data.descripcionEstado)
      foundedProduct.descripcionEstado = data.descripcionEstado;
    if (data.imei) foundedProduct.imei = data.imei;

    return await this.celularRepository.update(id, foundedProduct);
  }

  async deleteProductsService(id: string) {
    console.log(id);

    const foundedProduct = await this.productoRepository.findOneBy({ id });
    if (!foundedProduct) {
      throw new Error('Product not found');
    }
    return await this.productoRepository.delete(id);
  }
}

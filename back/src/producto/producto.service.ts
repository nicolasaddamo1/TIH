import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cellphone, Producto } from 'src/Entity/producto.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateCellhponeDto, UpdateCellphoneDto } from './dto/cellphone.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Cellphone)
    private celularRepository: Repository<Cellphone>,
    private firebaseService: FirebaseService,
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

  async createProducts(data: CreateProductDto, imagen?: Express.Multer.File) {
    console.log('📦 Creating product with data:', data);
    console.log('🖼️ Image file received:', imagen ? 'YES' : 'NO');

    let imagenUrl = null;

    // Si hay imagen, subirla a Firebase
    if (imagen) {
      console.log('📁 Image details:', {
        originalname: imagen.originalname,
        mimetype: imagen.mimetype,
        size: imagen.size,
        path: imagen.path,
      });

      try {
        // Crear nombre único para el archivo
        const fileName = `productos/${Date.now()}_${imagen.originalname}`;
        console.log('📤 Uploading to Firebase with filename:', fileName);

        // Subir a Firebase usando buffer
        imagenUrl = await this.firebaseService.uploadFileBuffer(
          imagen.buffer,
          fileName,
          imagen.mimetype,
        );

        console.log('✅ Image uploaded successfully. URL:', imagenUrl);
      } catch (error) {
        console.error('❌ Error uploading image to Firebase:', error);
        console.error('❌ Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'Unknown',
        });
        // Continuar sin imagen si hay error
      }
    } else {
      console.log('⚠️ No image provided');
    }

    // Crear producto con URL de imagen
    const productData = {
      ...data,
      imagen: imagenUrl,
    };

    console.log('💾 Saving product with image URL:', imagenUrl);

    const product = await this.productoRepository.create(productData);
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

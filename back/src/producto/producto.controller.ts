import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductoService } from './producto.service';
import { CreateProductDto } from './dto/product.dto';
import { CreateCellhponeDto } from './dto/cellphone.dto';

@Controller('producto')
export class ProductoController {
  constructor(private productoService: ProductoService) {}

  @Get()
  async getAllProducts() {
    return this.productoService.getAllProducts();
  }
  @Get('celulares')
  async getAllCelulares() {
    return this.productoService.getAllCelulares();
  }
  @Get('celulares/imei')
  async getAllCelularesByImei(@Query('imei') imei: string) {
    return this.productoService.getAllCelularesByImei(imei);
  }

  @Get('search')
  async searchProducts(@Query('q') searchTerm: string) {
    return this.productoService.searchProducts(searchTerm);
  }

  @Get('celulares/search')
  async searchCellphones(@Query('q') searchTerm: string) {
    return this.productoService.searchCellphones(searchTerm);
  }

  @Get(':id')
  async getProductsById(@Param('id') id: string) {
    return this.productoService.getProductsById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async createProducts(
    @Body() data: CreateProductDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    console.log('🎯 Controller received request');
    console.log('📋 Body data:', data);
    console.log('📁 File received:', imagen ? 'YES' : 'NO');
    if (imagen) {
      console.log('📁 File details:', {
        fieldname: imagen.fieldname,
        originalname: imagen.originalname,
        mimetype: imagen.mimetype,
        size: imagen.size,
        path: imagen.path,
      });
    }
    return this.productoService.createProducts(data, imagen);
  }
  @Post('test-upload')
  @UseInterceptors(FileInterceptor('imagen'))
  async testUpload(
    @Body() data: any,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    console.log('🧪 Test upload endpoint');
    console.log('📋 Body data:', data);
    console.log('📁 File received:', imagen ? 'YES' : 'NO');
    if (imagen) {
      console.log('📁 File details:', {
        fieldname: imagen.fieldname,
        originalname: imagen.originalname,
        mimetype: imagen.mimetype,
        size: imagen.size,
        buffer: imagen.buffer
          ? `Buffer with ${imagen.buffer.length} bytes`
          : 'No buffer',
      });
    }
    return {
      message: 'Test upload successful',
      hasFile: !!imagen,
      fileInfo: imagen
        ? {
            name: imagen.originalname,
            size: imagen.size,
            type: imagen.mimetype,
            hasBuffer: !!imagen.buffer,
          }
        : null,
    };
  }

  @Post('celulares')
  async createCellphone(@Body() data: CreateCellhponeDto) {
    return this.productoService.createCellphone(data);
  }

  @Put(':id')
  async updateProducts(
    @Param('id') id: string,
    @Body() data: CreateProductDto,
  ) {
    return this.productoService.updateProducts(id, data);
  }

  @Delete(':id')
  async deleteProducts(@Param('id') id: string) {
    console.log(id);
    return this.productoService.deleteProductsService(id);
  }
}

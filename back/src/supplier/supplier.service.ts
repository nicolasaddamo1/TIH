import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suplier } from '../Entity/suplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Suplier)
    private readonly supplierRepository: Repository<Suplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Suplier> {
    // Check if supplier with same name already exists
    const existingSupplier = await this.supplierRepository.findOne({
      where: { nombre: createSupplierDto.nombre },
    });

    if (existingSupplier) {
      throw new ConflictException(`Supplier with name "${createSupplierDto.nombre}" already exists`);
    }

    const supplier = this.supplierRepository.create(createSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Suplier[]> {
    return await this.supplierRepository.find({
      relations: ['productos'],
    });
  }

  async findOne(id: string): Promise<Suplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['productos'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID "${id}" not found`);
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Suplier> {
    const supplier = await this.findOne(id);

    // Check if new name conflicts with existing supplier
    if (updateSupplierDto.nombre && updateSupplierDto.nombre !== supplier.nombre) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: { nombre: updateSupplierDto.nombre },
      });

      if (existingSupplier) {
        throw new ConflictException(`Supplier with name "${updateSupplierDto.nombre}" already exists`);
      }
    }

    Object.assign(supplier, updateSupplierDto);
    return await this.supplierRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    
    // Check if supplier has products
    if (supplier.productos && supplier.productos.length > 0) {
      throw new ConflictException(`Cannot delete supplier "${supplier.nombre}" because it has associated products`);
    }

    await this.supplierRepository.remove(supplier);
  }

  async findByName(nombre: string): Promise<Suplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { nombre },
      relations: ['productos'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with name "${nombre}" not found`);
    }

    return supplier;
  }
}


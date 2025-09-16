import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../Entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Normalizar el nombre a minúsculas y sin espacios extra
    const normalizedName = createCategoryDto.nombre.toLowerCase().trim();

    // Check if category with same name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { nombre: normalizedName },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${normalizedName}" already exists`,
      );
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      nombre: normalizedName,
    });
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['productos'],
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['productos'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // Normalizar el nombre si se está actualizando
    if (updateCategoryDto.nombre) {
      updateCategoryDto.nombre = updateCategoryDto.nombre.toLowerCase().trim();
    }

    // Check if new name conflicts with existing category
    if (
      updateCategoryDto.nombre &&
      updateCategoryDto.nombre !== category.nombre
    ) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { nombre: updateCategoryDto.nombre },
      });

      if (existingCategory) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.nombre}" already exists`,
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has products
    if (category.productos && category.productos.length > 0) {
      throw new ConflictException(
        `Cannot delete category "${category.nombre}" because it has associated products`,
      );
    }

    await this.categoryRepository.remove(category);
  }

  async findByName(nombre: string): Promise<Category> {
    // Normalizar el nombre para la búsqueda
    const normalizedName = nombre.toLowerCase().trim();

    const category = await this.categoryRepository.findOne({
      where: { nombre: normalizedName },
      relations: ['productos'],
    });

    if (!category) {
      throw new NotFoundException(
        `Category with name "${normalizedName}" not found`,
      );
    }

    return category;
  }
}

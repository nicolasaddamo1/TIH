import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Suplier } from './suplier.entity';
import { Category } from './category.entity';

@Entity('producto')
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } }) // Herencia basada en una columna
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  marca: string;

  @Column({ type: 'varchar', length: 50 })
  modelo: string;

  @Column({ type: 'varchar', length: 50 })
  proveedor: string;

  @Column({ type: 'int' })
  precio: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'decimal', nullable: false, default: 0 })
  costo: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagen?: string;

  @ManyToOne(() => Category, (category) => category.productos)
  category: Category;

  @ManyToOne(() => Suplier, (suplier) => suplier.productos)
  suplier: Suplier;
}

@Entity('cellphone')
export class Cellphone extends Producto {
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fechaCompra: Date;

  @Column({ type: 'date', nullable: true })
  fechaVenta?: Date;

  @Column({ type: 'varchar', length: 20 })
  estado: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  descripcionEstado?: string;

  @Column({ type: 'varchar', length: 50 })
  imei: string;
}

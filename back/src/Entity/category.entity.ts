import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from './producto.entity';
@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion?: string;

  @OneToMany(() => Producto, (producto) => producto.category)
  productos: Producto[];
}

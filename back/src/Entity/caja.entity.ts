import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MedioDePago } from 'src/enum/medioDePago.enum';
import { Producto, Cellphone } from './producto.entity';
import { Comision } from 'src/enum/comision.enum';

@Entity('caja')
export class Caja {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  precioTotal: number;

  @ManyToMany(() => Producto, { eager: true })
  @JoinTable({
    name: 'caja_productos_producto',
    joinColumn: { name: 'cajaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'productoId', referencedColumnName: 'id' },
  })
  productos?: Producto[];

  @ManyToMany(() => Cellphone, { eager: true })
  @JoinTable({
    name: 'caja_productos_cellphone',
    joinColumn: { name: 'cajaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'cellphoneId', referencedColumnName: 'id' },
  })
  celulares?: Cellphone[];

  @Column({ type: 'enum', enum: MedioDePago, default: MedioDePago.MERCADOPAGO })
  medioDePago: MedioDePago;

  @Column({ type: 'uuid' })
  clienteId: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observaciones: string;

  @Column({ type: 'enum', enum: Comision, default: Comision.VENTA })
  comision: Comision;

  @Column({ type: 'uuid' })
  vendedorId: string;
}

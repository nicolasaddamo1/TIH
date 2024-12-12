import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('caja')
export class Caja {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    precioTotal: number;

    @Column({ type: 'varchar', length: 500 })
    productos: string;

    @Column({ type: 'varchar', length: 50 })
    medioDePago: string;

    @Column({ type: 'varchar', length: 100 })
    cliente: string;

    @Column({ type: 'int' })
    nroTelefono: number;

    @Column({ type: 'varchar', length: 500 })
    observaciones: string;

    @Column({ type: 'varchar', length: 100 })
    description: string;

    @Column({ type: 'varchar', length: 50 })
    comision: string;

    @ManyToOne(() => Usuario, usuario => usuario.cajas, { cascade: true, onDelete: 'CASCADE' })
    vendedor: Usuario;
}
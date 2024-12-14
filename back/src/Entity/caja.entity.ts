import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './usuario.entity';
import { MedioDePago } from 'src/enum/medioDePago.enum';  // Importar el enum
import { Producto } from './producto.entity';
import { Cliente } from './cliente.entity';
import { Comision } from 'src/enum/comision.enum';

@Entity('caja')
export class Caja {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    precioTotal: number;

    @ManyToMany(() => Producto)  // Relaciona con los productos
    @JoinTable()  // Relación de muchos a muchos entre cajas y productos
    productos: Producto[];

    @Column({ type: 'enum', enum: MedioDePago })
    medioDePago: MedioDePago;

    @ManyToOne(() => Cliente, { eager: true })  // Relaciona con la entidad Cliente
    cliente: Cliente;

    @Column({ type: 'int' })
    nroTelefono: number;

    @Column({ type: 'date', default: () => "CURRENT_DATE" })
    fecha: Date;

    @Column({ type: 'varchar', length: 500, nullable: true })
    observaciones: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    description: string;

    @Column({ type: 'enum', enum: Comision })
    comision: Comision;

    @ManyToOne(() => Usuario, usuario => usuario.cajas, { cascade: true, onDelete: 'CASCADE' })
    vendedor: Usuario;  // El vendedor es el usuario que hace la transacción
}

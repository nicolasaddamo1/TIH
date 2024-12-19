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

    @ManyToMany(() => Producto, { eager: true })  // Relaciona con los productos
    @JoinTable({
        name: "caja_productos_producto",
        joinColumn: { name: "cajaId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "productoId", referencedColumnName: "id" }
    })  
    productos?: Producto[];

    @Column({ type: 'enum', enum: MedioDePago, default:MedioDePago.MERCADOPAGO })
    medioDePago: MedioDePago;

    @ManyToOne(() => Cliente, { eager: true }) 
    cliente: Cliente;

    @Column({ type: 'date', default: () => "CURRENT_DATE" })
    fecha: Date;

    @Column({ type: 'varchar', length: 500, nullable: true })
    observaciones: string;

    @Column({ type: 'enum', enum: Comision, default:Comision.VENTA })
    comision: Comision;

    @ManyToOne(() => Usuario, usuario => usuario.cajas, { cascade: true, onDelete: 'CASCADE' })
    vendedor: Usuario;  // El vendedor es el usuario que hace la transacción
}

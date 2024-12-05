import { Comision } from "src/enum/comision.enum";
import { MedioDePago } from "src/enum/medioDePago.enum";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";
import { Producto } from "./producto.entity";

@Entity('caja')
export class Caja {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type:"int"})
    precioTotal: number;
    
    @Column({type:"varchar", length:500})
    observaciones?: string;
    
    @Column({type:"varchar", length:500})
    description?: string;
    
    @Column({type:"enum", enum: Comision})
    comision: Comision;
    
    @CreateDateColumn({ type: 'timestamp' })
    fecha: Date;

    @Column({type:"enum", enum: MedioDePago})
    medioDePago: MedioDePago;

    @ManyToOne(() => Usuario, usuario => usuario.cajas, { eager: true })
    vendedor: Usuario;

    @ManyToMany(() => Producto, { cascade: true })
    @JoinTable()
    productos: Producto[];
}
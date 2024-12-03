import { Comision } from "src/enum/comision.enum";
import { MedioDePago } from "src/enum/medioDePago.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('caja')
export class Caja {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type:"int"})
    precioTotal: number;
    
    @Column()
    //@onetomany
    articulo: string;
    
    @Column({type:"enum", enum: MedioDePago})
    medioDePago: MedioDePago;
    
    @Column({type:"varchar", length:50})
    cliente: string;
    
    @Column({type:"int"})
    nroTelefono: number;
    
    @Column({type:"varchar", length:250})
    observaciones?: string;
    
    @Column({type:"varchar", length:500})
    description?: string;
    
    @Column({type:"enum", enum: Comision})
    comision: Comision;
    
    @CreateDateColumn({ type: 'timestamp' })
    fecha: Date;
    
    @Column({type:"varchar", length:50})
    //@onetomany
    vendedor: string;
}
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity('factura')
export class Factura {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:"varchar", length:50})
    fecha: string;
    
    @Column({type:"int"})
    total: number;
    
    @ManyToOne(type => Usuario, usuario => usuario.facturas)
    usuario:Usuario
}
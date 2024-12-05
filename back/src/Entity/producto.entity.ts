import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Caja } from "./caja.entity";

@Entity("producto")
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:"varchar", length:50})
    nombre: string;

    @Column({type:"int"})
    precio: number;

    @Column({type:"int"})
    stock: number;

    @Column({type:"varchar", length:50, nullable: true})
    imagen?: string;

    @Column({type:"varchar", length:50})
    categoria?: string;

    @ManyToMany(() => Caja, caja => caja.productos)
    cajas: Caja[];
}

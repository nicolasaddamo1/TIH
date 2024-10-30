import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("producto")
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type:"varchar", length:50})
    nombre: string

    @Column({type:"int"})
    precio: number

    @Column({type:"int"})
    stock: number

    @Column({type:"varchar", length:50, nullable: true})
    imagen?: string

    @Column({type:"varchar", length:50})
    categoria?: string
}

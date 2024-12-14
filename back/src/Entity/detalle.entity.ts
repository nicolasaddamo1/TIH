import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("detalle")
export class Detalle {
@PrimaryGeneratedColumn('uuid')
id: string

@Column({type:"int"})
cantidad: number

@Column({type:"int"})
precio: number

}
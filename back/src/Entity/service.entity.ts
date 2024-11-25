import { Column, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

export class Service {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type:"int", nullable: false})
    precio: number;

    @Column({type:"varchar", length:500, nullable: false})
    descripcion: string;
    
    @OneToOne(() => Usuario)
    usuario: Usuario
}

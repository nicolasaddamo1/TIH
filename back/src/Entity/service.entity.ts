import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity("service")
export class Service {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type:"int", nullable: false})
    precio: number;

    @Column({type:"varchar", length:500, nullable: false})
    descripcion: string;

    @OneToOne(() => Usuario, usuario => usuario.service, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    usuario: Usuario;
}
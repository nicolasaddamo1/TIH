import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity("service")
export class Service {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'date', default: () => "CURRENT_DATE" })
    fecha: Date;

    @Column({type:"int", nullable: false})
    precio: number;

    @Column({type:"varchar", length:500, nullable: false})
    descripcion: string;

    @ManyToOne(() => Usuario, usuario => usuario.service, { cascade: true, onDelete: 'CASCADE' })
    usuario: Usuario;
}
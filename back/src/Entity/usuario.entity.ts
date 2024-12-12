import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Factura } from "./factura.entity";
import { IsBoolean } from "class-validator";
import { Role } from "src/enum/roles.enum";
import { Service } from "./service.entity";
import { Caja } from "./caja.entity";

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:"int", unique:true})    
    dni: number;

    @Column({type:"varchar", length:50})    
    nombre: string;

    @Column({type:"varchar", length:50})    
    apellido: string;

    @Column({type:"varchar", length:100})    
    direccion: string;

    @Column({type:"varchar", length:50})    
    fechaNacimiento: string;

    @Column({type:"int", unique:true})    
    nroTelefono: number;

    @Column({type:"varchar", length:50, unique:true})    
    email: string;

    @Column({ type:'enum', enum: Role, default: Role.USER })
    role: Role;

    @Column({type:"varchar", length:250})    
    password?: string;

    @IsBoolean()
    @Column({type:"boolean"})    
    isAdmin: boolean;

    @OneToMany(() => Factura, factura => factura.usuario)
    facturas: Factura[];

    @OneToMany(() => Caja, caja => caja.vendedor)
    cajas: Caja[];

    @OneToOne(() => Service, service => service.usuario, { nullable: true, eager: true })
    @JoinColumn()
    service: Service | null;
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Factura } from "./factura.entity";

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:"int", unique:true})    
    dni:number;

    @Column({type:"varchar", length:50})    
    nombre: string;

    @Column({type:"varchar", length:50})    
    apellido:string;

    @Column({type:"varchar", length:100})    
    direccion: string;

    @Column({type:"varchar", length:50})    
    fechaNacimiento: string;

    @Column({type:"int", unique:true})    
    nroTelefono: number;

    @Column({type:"varchar", length:50, unique:true})    
    email: string;

    @OneToMany(type => Factura, factura => factura.usuario)
    facturas:Factura[]

}
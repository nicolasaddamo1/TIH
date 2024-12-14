import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cliente')
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "int", unique: true })
    dni: number;

    @Column({ type: "varchar", length: 50 })
    nombre: string;

    @Column({ type: "varchar", length: 50 })
    apellido: string;

    @Column({ type: "varchar", length: 100 })
    direccion: string;

    @Column({ type: "int" })
    nroTelefono: number;
}

import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity("producto")
@TableInheritance({ column: { type: "varchar", name: "tipo" } }) // Herencia basada en una columna
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 50 })
    nombre: string;

    @Column({ type: "int" })
    precio: number;

    @Column({ type: "int" })
    stock: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    imagen?: string;

    @Column({ type: "varchar", length: 50 })
    categoria?: string;
}

@Entity("cellphone")
export class Cellphone extends Producto {
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    fechaCompra: Date;

    @Column({ type: "date", nullable: true })
    fechaVenta?: Date;

    @Column({ type: "varchar", length: 20 })
    estado: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    descripcionEstado?: string;

    @Column({ type: "varchar", length: 50 })
    imei: string;
}

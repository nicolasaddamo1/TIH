import { Column, Entity } from "typeorm";
import { Producto } from "./producto.entity";

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
}

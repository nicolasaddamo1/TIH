import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class CreateCellhponeDto {

    @IsNotEmpty()
    @IsString()
    nombre: string
    
    @IsNotEmpty()
    @IsNumber()
    precio: number
    
    @IsNotEmpty()
    @IsNumber()
    stock: number
    
    @IsOptional()
    @IsString()
    imagen?: string
    
    @IsOptional()
    @IsString()
    categoria?: string

    @IsOptional()
    fechaCompra?: Date;
    
    @IsOptional()
    @IsString()
    fechaVenta?: Date;
    
    @IsNotEmpty()
    @IsString()
    estado: string;

    @IsNotEmpty()
    @IsString()
    imei: string;
    
    @IsString()
    @IsOptional()
    descripcionEstado?: string;

}
export class UpdateCellphoneDto {

    @IsOptional()
    @IsString()
    nombre?: string
    
    @IsOptional()
    @IsNumber()
    precio?: number
    
    @IsOptional()
    @IsNumber()
    stock?: number
    
    @IsOptional()
    @IsString()
    imagen?: string
    
    @IsOptional()
    @IsString()
    categoria?: string

    @IsOptional()
    fechaCompra?: Date;
    
    @IsOptional()
    @IsString()
    fechaVenta?: Date;
    
    @IsOptional()
    @IsString()
    estado?: string;
    
    @IsString()
    @IsOptional()
    descripcionEstado?: string;
    
    @IsString()
    @IsOptional()
    imei?

}
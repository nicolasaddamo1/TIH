import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    nombre: string
    
    @IsNotEmpty()
    @IsNumber()
    precio: number
    
    @IsNotEmpty()
    @IsNumber()
    stock: number
    
    @IsNotEmpty()
    @IsString()
    imagen: string
    
    @IsOptional()
    @IsString()
    categoria?: string

}
export class UpdateProductDto {

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

}
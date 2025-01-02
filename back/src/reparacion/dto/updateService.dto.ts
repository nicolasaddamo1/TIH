import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Usuario } from "src/Entity/usuario.entity";

export class UpdateServiceDto {

@IsString()
@IsOptional()
id: string;

@IsNumber()
@IsOptional()
precio?: number;

@IsString()
@IsOptional()
descripcion?: string;

@IsUUID('4')
@IsOptional()
usuario?: Usuario;
}
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { Usuario } from "src/Entity/usuario.entity";

export class CreateServiceDto {

@IsNumber()
@IsNotEmpty()
precio: number;

@IsOptional()
fecha?: Date;

@IsString()
descripcion: string;

@IsUUID('4')
usuario: Usuario;
}
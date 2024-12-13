import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { Usuario } from "src/Entity/usuario.entity";

export class CreateServiceDto {

@IsNumber()
@IsNotEmpty()
precio: number;

@IsString()
descripcion: string;

@IsUUID('4')
usuario: Usuario;
}
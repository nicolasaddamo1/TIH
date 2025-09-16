import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Max } from 'class-validator';
import { Comision } from 'src/enum/comision.enum';
import { MedioDePago } from 'src/enum/medioDePago.enum';

export class CreateClienteDto {
  @IsInt()
  dni: number;

  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MaxLength(50)
  apellido: string;

  
  @IsInt()
  @Max(2147483647,{message: 'El número de teléfono debe estar entre 0 y 2147483647'})
  nroTelefono: number;


  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @IsString()
  @MaxLength(50)
  localidad: string;

}

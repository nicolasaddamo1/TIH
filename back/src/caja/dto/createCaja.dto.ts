import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Comision } from 'src/enum/comision.enum';
import { MedioDePago } from 'src/enum/medioDePago.enum';

export class CreateCajaDto {
  @IsInt()
  precioTotal: number;

  @IsUUID('4', { each: true })
  productos: string[]; // Lista de IDs de productos

  @IsEnum(MedioDePago)
  medioDePago: MedioDePago;

  @IsString()
  @MaxLength(50)
  cliente: string;

  @IsInt()
  nroTelefono: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  observaciones?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsEnum(Comision)
  comision: Comision;
  
  @IsString()
  @MaxLength(50)
  vendedor: string; // ID del usuario
}


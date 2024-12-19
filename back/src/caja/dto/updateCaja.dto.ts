import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Comision } from 'src/enum/comision.enum';
import { MedioDePago } from 'src/enum/medioDePago.enum';

export class UpdateCajaDto {
  @IsOptional()
  @IsInt()
  precioTotal?: number;

  @IsOptional()
  @IsUUID('4', { each: true })
  productos?: string[]; // Lista de IDs de productos

  @IsOptional()
  @IsEnum(MedioDePago)
  medioDePago?: MedioDePago;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cliente?: string;

  @IsOptional()
  @IsInt()
  nroTelefono?: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  observaciones?: string;

  @IsOptional()
  @IsEnum(Comision)
  comision?: Comision;

  @IsOptional()
  @IsUUID()
  vendedor?: string; // ID del vendedor (usuario)
}

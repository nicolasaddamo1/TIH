import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { Comision } from 'src/enum/comision.enum';
import { MedioDePago } from 'src/enum/medioDePago.enum';

export class UpdateCajaDto {
  @IsOptional()
  @IsInt()
  precioTotal?: number;

  @IsOptional()
  @IsString({ each: true })
  articulo?: string[];

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
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(Comision)
  comision?: Comision;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  vendedor?: string;
}

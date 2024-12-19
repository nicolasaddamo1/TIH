import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Max } from 'class-validator';
import { Comision } from 'src/enum/comision.enum';
import { MedioDePago } from 'src/enum/medioDePago.enum';

export class CreateCajaDto {
  @IsInt()
  precioTotal: number;

  @IsUUID('4', { each: true, })
  productos: string[]; 

  @IsEnum(MedioDePago)
  medioDePago: MedioDePago;

  @IsString()
  @MaxLength(50)
  cliente: string;

  @IsOptional()
  fecha?: Date;
  
  @IsInt()
  @Max(2147483647,{message: 'El número de teléfono debe estar entre 0 y 2147483647'})
  nroTelefono: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  observaciones?: string;

  @IsEnum(Comision)
  comision: Comision;

  @IsUUID('4')
  vendedor: string; 
}

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}


import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FileUploadResponseDto {
  @IsNotEmpty()
  @IsString()
  ceremonia_url_location: string;

  @IsOptional()
  @IsString()
  recepcion_url_location?: string;

  @IsNotEmpty()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  logo_files: string[];
}

import { PickType } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Role } from "src/enum/roles.enum"
import { Column } from "typeorm"

export class CreateUserDto{
    @IsNumber()
    @IsNotEmpty()
    dni:number
    
    @IsString()
    @IsNotEmpty()
    nombre:string
    
    @IsString()
    @IsNotEmpty()
    apellido:string
    
    @IsString()
    @IsNotEmpty()
    direccion:string
    
    @IsString()
    @IsNotEmpty()
    fechaNacimiento:string
    
    @IsNumber()
    @IsNotEmpty()
    nroTelefono:number

    @IsNotEmpty()
    @IsString()
    email:string
    
    @IsString()
    @IsNotEmpty()
    password:string
    
    
    @IsEnum(Role)
    @IsNotEmpty()
    role:Role
    
    @IsBoolean()
    @IsOptional()
    isAdmin?:boolean
}
export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password']){}
export class UpdateUserDto{
    @IsNumber()
    @IsOptional()
    dni?:number
    
    @IsString()
    @IsOptional()
    nombre?:string
    
    @IsString()
    @IsOptional()
    apellido?:string
    
    @IsString()
    @IsOptional()
    direccion?:string
    
    @IsString()
    @IsOptional()
    fechaNacimiento?:string
    
    @IsNumber()
    @IsOptional()
    nroTelefono?:number

    @IsOptional()
    @IsString()
    email?:string
    
    @IsString()
    @IsOptional()
    password?:string
    
    @IsBoolean()
    @IsOptional()
    isAdmin?:boolean

    @IsEnum(Role)
    @IsNotEmpty()
    role?:Role


}
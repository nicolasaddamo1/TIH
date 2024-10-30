import { PickType } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class UserDto{
    @IsString()
    @IsNotEmpty()
    name:string
    
    @IsNotEmpty()
    @IsString()
    email:string
    
    @IsString()
    @IsNotEmpty()
    password:string
    
    @IsBoolean()
    @IsNotEmpty()
    isAdmin:boolean
}
export class LoginUserDto extends PickType(UserDto, ['email', 'password']){}
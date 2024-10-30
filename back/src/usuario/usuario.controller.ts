import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';


@Controller('usuarios')
export class AuthController {
constructor(
    private  usuarioService:UsuarioService
){}

@Get()
    async getUsers(){
        return this.usuarioService.getUserService()
    }

    @Post()
    async createUser(
        @Body()data:CreateUserDto
    ){
        return this.usuarioService.createUserService(data)
    }
    
    @Put(':id')
    async updateUser(
        @Param('id') id:string,
        @Body()data:UpdateUserDto
    ){
        return this.usuarioService.updateUserService(id, data)
    }

    @Delete(':id')
    async deleteUser(
        @Param('id') id:string
    ){
        return this.usuarioService.deleteUserService(id)
    }
    
}
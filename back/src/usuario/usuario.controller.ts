import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUserDto } from './user.dto';


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
    async updateUser(){
        return this.usuarioService.updateUserService()
    }

    @Delete(':id')
    async deleteUser(){
        return this.usuarioService.deleteUserService()
    }


}
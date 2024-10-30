import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>
    ){}

    async getUserService(){
        return await this.usuarioRepository.find()
        
    }

    async createUserService(
        data:CreateUserDto
    ){
        const user = await this.usuarioRepository.create(data)
        return await this.usuarioRepository.save(user)
    }
    
    async updateUserService(){
        return "hola"
    }

    async deleteUserService(){
        return "hola"
    }


}

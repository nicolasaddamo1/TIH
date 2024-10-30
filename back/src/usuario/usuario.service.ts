import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';

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
    
    async updateUserService(id:string, data:UpdateUserDto){
        const foundedUser = await this.usuarioRepository.findOneBy({id})
        if (!foundedUser) {
            throw new Error('User not found')
        }

        foundedUser.dni = data.dni
        foundedUser.email = data.email
        foundedUser.password = data.password
        foundedUser.isAdmin = data.isAdmin
        foundedUser.nroTelefono = data.nroTelefono
        foundedUser.apellido = data.apellido
        foundedUser.direccion = data.direccion
        foundedUser.nombre = data.nombre
        foundedUser.fechaNacimiento = data.fechaNacimiento

        return await this.usuarioRepository.update(id, foundedUser)
    }
       
    async deleteUserService(id:string){
        const foundedUser = await this.usuarioRepository.findOneBy({id})
        if (!foundedUser) {
            throw new Error('User not found')
        }
        return await this.usuarioRepository.delete(foundedUser)
    }


}

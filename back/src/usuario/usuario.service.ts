import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>
    ){}

    async getUserService(){
        return await this.usuarioRepository.find()
        
    }

    async createUserService(data: CreateUserDto) {
        // Validar que el email no exista
        const existingUserByEmail = await this.usuarioRepository.findOne({
            where: { email: data.email }
        });
        
        if (existingUserByEmail) {
            throw new ConflictException('El email ya está registrado');
        }

        // Validar que el DNI no exista
        const existingUserByDni = await this.usuarioRepository.findOne({
            where: { dni: data.dni }
        });
        
        if (existingUserByDni) {
            throw new ConflictException('El DNI ya está registrado');
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // Crear usuario con contraseña hasheada
        const userData = {
            ...data,
            password: hashedPassword
        };

        const user = this.usuarioRepository.create(userData);
        const savedUser = await this.usuarioRepository.save(user);
        
        // No devolver la contraseña en la respuesta
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
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
        try {
            const userDeleted =await this.usuarioRepository.delete(id)
            return userDeleted
        } catch (error) {
            console.log(error)
            return error
        }
    }


}

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    ){}
    async login (email: string, password: string) {

        const foundedUser = await this.usuarioRepository.findOneBy({email, password})
        if (!foundedUser) {
            throw new Error('User not found')
        }
        if (foundedUser.password !== password || foundedUser.email !== email) {
            throw new Error('ivalid credentials')
        }

        return "Login Success"
        
    }
}

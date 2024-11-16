import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/Entity/usuario.entity';
import { CreateUserDto } from 'src/usuario/user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/roles.enum';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
        private readonly jwtService: JwtService,

    ){}
    async login(email: string, password: string) {
        console.log(email, password);
        const user = await this.usuarioRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Credenciales inválidas.');
    
        if (!password) {
            throw new BadRequestException('Contraseña requerida.');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Credenciales inválidas.');
    
        const payload = { 
            nombre: user.nombre,
            apellido: user.apellido,
            direccion: user.direccion,
            fechaNacimiento: user.fechaNacimiento,
            dni: user.dni,
            email: user.email,
            nroTelefono: user.nroTelefono, 
            sub: user.id,
            roles: [user.role],
        };
        
        const accessToken = this.jwtService.sign(payload);
    
        return { success: 'Login exitoso.', accessToken };
    }
    
    async signUp(createUserDTO:CreateUserDto){
        console.log(createUserDTO);
        const { email, password } = createUserDTO;
    
        const existingUser = await this.usuarioRepository.findOne({ where: { email } });
        if (existingUser) throw new ConflictException('El usuario ya existe.');
    
        let newUser: Usuario;
    
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (!hashedPassword) throw new BadRequestException('Error encriptando contraseña.');
            newUser = await this.usuarioRepository.create({...createUserDTO, password: hashedPassword});
        } else {
            newUser = await this.usuarioRepository.create(createUserDTO);
        }
    
        newUser.role = Role.USER;
    

    
        return await this.usuarioRepository.save(newUser);  
    }
    
    
}

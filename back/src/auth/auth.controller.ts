import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/usuario/user.dto';
import { Usuario } from 'src/Entity/usuario.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('login')
    async logIn(
        @Body()user:LoginUserDto
    )
        {
        return this.authService.login(user.email, user.password)
    }

    @Post('signup')
    async signUp(
        @Body()user:CreateUserDto
    ):Promise<Usuario>{
        return this.authService.signUp(user)
    }

}

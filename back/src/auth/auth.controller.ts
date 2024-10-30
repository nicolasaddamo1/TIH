import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/usuario/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    async logIn(@Body()user:LoginUserDto):Promise<any>{
        return this.authService.login(user.email, user.password)
    }

}

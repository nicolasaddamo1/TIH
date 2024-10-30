import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Usuario } from 'src/Entity/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), 
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

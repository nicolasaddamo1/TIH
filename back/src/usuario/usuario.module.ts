// usuario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from 'src/Entity/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), 
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService], 
})
export class UsuarioModule {}

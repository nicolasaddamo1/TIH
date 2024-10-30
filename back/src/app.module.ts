import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProductoModule } from './producto/producto.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsuarioModule, ProductoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

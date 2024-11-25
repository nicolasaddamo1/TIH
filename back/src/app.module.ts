import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProductoModule } from './producto/producto.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { VentaModule } from './ventas/ventas.module';
import { ReparacionModule } from './reparacion/reparacion.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '2h'
      },
      secret: process.env.JWT_SECRET,
    }),
    UsuarioModule, ProductoModule, AuthModule, VentaModule, ReparacionModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProductoModule } from './producto/producto.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ReparacionModule } from './reparacion/reparacion.module';
import { MetricsModule } from './metrics/metrics.module';
import { CajaModule } from './caja/caja.module';
import { Usuario } from './Entity/usuario.entity';
import { Producto, Cellphone } from './Entity/producto.entity';
import { Caja } from './Entity/caja.entity';
import { Factura } from './Entity/factura.entity';
import { PreloadService } from './preload/preload.service';
import { Cliente } from './Entity/cliente.entity';
import { ClienteModule } from './cliente/cliente.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'user'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'your_database'),
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    TypeOrmModule.forFeature([Usuario, Producto,  Caja, Factura, Cellphone, Cliente]),
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '2h',
      },
      secret: process.env.JWT_SECRET,
    }),
    UsuarioModule,
    ProductoModule,
    AuthModule,
    ReparacionModule,
    MetricsModule,
    CajaModule,
    ClienteModule,
    ReparacionModule
    
  ],
  controllers: [AppController],
  providers: [AppService, PreloadService],
})
export class AppModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    
  }
}

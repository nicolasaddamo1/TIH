import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProductoModule } from './producto/producto.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { VentaModule } from './ventas/ventas.module';
import { ReparacionModule } from './reparacion/reparacion.module';
import { MetricsModule } from './metrics/metrics.module';
import { CajaModule } from './caja/caja.module';
import { Usuario } from './Entity/usuario.entity';
import { Producto } from './Entity/producto.entity';
import { DetalleVenta, Venta } from './Entity/venta.entity';
import { PreloadService } from './preload/preload.service';
import { Caja } from './Entity/caja.entity';
import { Factura } from './Entity/factura.entity';


@Module({
  imports: [
    // Configuración global para variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configuración de TypeORM
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
        synchronize: true, // Cambiar a `false` en producción
      }),
    }),
    // Configuración de TypeORM para entidades específicas
    TypeOrmModule.forFeature([Usuario, Producto, Venta, DetalleVenta, Caja,Factura]),
    // Configuración de JWT
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '2h',
      },
      secret: process.env.JWT_SECRET,
    }),
    // Otros módulos de la aplicación
    UsuarioModule,
    ProductoModule,
    AuthModule,
    VentaModule,
    ReparacionModule,
    MetricsModule,
    CajaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PreloadService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly preloadService: PreloadService) {}

  async onModuleInit() {
    // Llama al método de precarga al inicializar el módulo
    await this.preloadService.preloadAll();
  }
}

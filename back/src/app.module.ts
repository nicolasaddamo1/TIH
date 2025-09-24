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
import { Suplier } from './Entity/suplier.entity';
import { Category } from './Entity/category.entity';
import { SupplierModule } from './supplier/supplier.module';
import { CategoryModule } from './category/category.module';
import { FirebaseService } from './firebase/firebase.service';
import { ImagesModule } from './images/images.module';

//!SUPABASE
import { parse } from 'pg-connection-string';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //!LOCAL (config para Postgres local)
    /*
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
    */

    //!SUPABASE (usa la DATABASE_URL de Supabase con SSL y pooler IPv4)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const parsed = parse(dbUrl);

        return {
          type: 'postgres',
          host: parsed.host,
          port: Number(parsed.port),
          username: parsed.user,
          password: parsed.password,
          database: parsed.database,
          autoLoadEntities: true,
          synchronize: true, // ⚠️ solo en dev
          ssl: { rejectUnauthorized: false },
        };
      },
    }),

    TypeOrmModule.forFeature([
      Usuario,
      Producto,
      Caja,
      Factura,
      Cellphone,
      Cliente,
      Suplier,
      Category,
    ]),

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
    SupplierModule,
    CategoryModule,
    ReparacionModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PreloadService, FirebaseService],
  exports: [FirebaseService],
})
export class AppModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {}
}

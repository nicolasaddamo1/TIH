//!LOCAL
// // database.config.ts
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

// export const typeOrmConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => ({
//   type: 'postgres',
//   host: configService.get<string>('DB_HOST', 'localhost'),
//   port: configService.get<number>('DB_PORT', 5432),
//   username: configService.get<string>('DB_USERNAME', 'postgres'),
//   password: configService.get<string>('DB_PASSWORD', 'password'),
//   database: configService.get<string>('DB_NAME', 'nest_db'),
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   synchronize: configService.get<boolean>('DB_SYNC', true),
//   logging: configService.get<boolean>('DB_LOGGING', false),
//   dropSchema: configService.get<boolean>('DB_DROP_SCHEMA', true),
// });
//!FIREBASE
// database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { parse } from 'pg-connection-string';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Usar variables de entorno individuales si están disponibles
  const host = configService.get<string>('DATABASE_HOST');
  const port = configService.get<number>('DATABASE_PORT');
  const username = configService.get<string>('DATABASE_USER');
  const password = configService.get<string>('DATABASE_PASSWORD');
  const database = configService.get<string>('DATABASE_NAME');

  // Si hay una URL completa, usarla (para Supabase/Firebase)
  const dbUrl = configService.get<string>('DATABASE_URL');

  if (dbUrl) {
    const parsed = parse(dbUrl);
    return {
      type: 'postgres',
      host: parsed.host,
      port: Number(parsed.port),
      username: parsed.user,
      password: parsed.password,
      database: parsed.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: configService.get<boolean>('DB_SYNC', true),
      logging: configService.get<boolean>('DB_LOGGING', false),
      dropSchema: configService.get<boolean>('DB_DROP_SCHEMA', false),
      ssl: { rejectUnauthorized: false }, // importante para Supabase
    };
  }

  // Configuración para Docker local
  return {
    type: 'postgres',
    host: host || 'localhost',
    port: port || 5432,
    username: username || 'postgres',
    password: password || 'password',
    database: database || 'nest_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNC', true),
    logging: configService.get<boolean>('DB_LOGGING', false),
    dropSchema: configService.get<boolean>('DB_DROP_SCHEMA', false),
  };
};

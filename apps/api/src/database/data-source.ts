import 'dotenv/config';
import { register } from 'tsconfig-paths';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

// Register path aliases so the TypeORM CLI can resolve @pickup-game-manager/*
// imports in entity files when running outside the Nx compilation context.
register({
  baseUrl: resolve(__dirname, '../../../..'),
  paths: { '@pickup-game-manager/shared-types': ['libs/shared-types/src/index.ts'] },
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
  username: process.env['DB_USERNAME'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'pickup_game',
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env['NODE_ENV'] === 'development',
});

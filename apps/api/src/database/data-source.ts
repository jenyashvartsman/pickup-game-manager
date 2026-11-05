import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['POSTGRES_HOST'] ?? 'localhost',
  port: Number(process.env['POSTGRES_PORT'] ?? 5432),
  database: process.env['POSTGRES_DB'] ?? 'pickup_game',
  username: process.env['POSTGRES_USER'] ?? 'pguser',
  password: process.env['POSTGRES_PASSWORD'] ?? 'pgpassword',
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env['NODE_ENV'] === 'development',
});

import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

// process.cwd() is always the project root when running via nx/npx from root
const src = join(process.cwd(), 'apps/api/src');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['POSTGRES_HOST'] ?? 'localhost',
  port: Number(process.env['POSTGRES_PORT'] ?? 5432),
  database: process.env['POSTGRES_DB'] ?? 'pickup_game',
  username: process.env['POSTGRES_USER'] ?? 'pguser',
  password: process.env['POSTGRES_PASSWORD'] ?? 'pgpassword',
  entities: [join(src, 'modules/**/entities/*.entity{.ts,.js}')],
  migrations: [join(src, 'database/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: process.env['NODE_ENV'] === 'development',
});

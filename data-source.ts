import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { User } from 'src/common/entities/user.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/common/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});

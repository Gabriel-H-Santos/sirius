import { existsSync } from 'node:fs';
import { DataSource } from 'typeorm';
import { validateEnv } from '@config/env';

if (existsSync('.env')) {
  process.loadEnvFile();
}

const env = validateEnv(process.env);

export default new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  migrations: ['src/database/migrations/*.ts'],
});

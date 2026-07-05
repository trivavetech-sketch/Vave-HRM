import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedGlobalDatabase } from './database/seed';
import { Tenant } from './modules/tenant/entities/tenant.entity';

const dbUrl = process.env.DATABASE_URL;
const useSsl = process.env.DB_SSL === 'true' || !!dbUrl;
const dataSource = new DataSource({
  type: 'postgres',
  ...(dbUrl ? { url: dbUrl } : {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'vave_hrm',
  }),
  entities: [Tenant],
  synchronize: true,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

async function main() {
  await dataSource.initialize();
  await seedGlobalDatabase(dataSource);
  await dataSource.destroy();
}

main().catch(console.error);

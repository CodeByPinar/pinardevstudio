import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'projelerim_db',
      password: process.env.DB_PASSWORD || undefined,
      port: Number(process.env.DB_PORT || 5432),
    };

const pool = new Pool(poolConfig);

export default pool;
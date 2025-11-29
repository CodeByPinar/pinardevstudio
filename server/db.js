import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: 'postgres',
      host: 'localhost',
      database: 'projelerim_db',
      password: 'Piner842301.#',
      port: 5432,
    };

const pool = new Pool(poolConfig);

export default pool;
import pg from 'pg';
import dotenv from 'dotenv';
const { Client } = pg;

dotenv.config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_ADMIN_DATABASE || 'postgres', // Varsayılan veritabanı
  password: process.env.DB_PASSWORD || undefined,
  port: Number(process.env.DB_PORT || 5432),
});

async function test() {
  try {
    console.log('Postgres veritabanına bağlanılıyor...');
    await client.connect();
    console.log('Bağlantı başarılı!');
    
    // Hedef veritabanı var mı kontrol et
    const targetDb = process.env.DB_NAME || 'projelerim_db';
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [targetDb]);
    if (!/^[a-zA-Z0-9_]+$/.test(targetDb)) {
      throw new Error('DB_NAME sadece harf, rakam ve alt çizgi içerebilir.');
    }

    if (res.rows.length === 0) {
      console.log(`'${targetDb}' bulunamadı, oluşturuluyor...`);
      await client.query(`CREATE DATABASE ${targetDb}`);
      console.log(`'${targetDb}' başarıyla oluşturuldu.`);
    } else {
      console.log(`'${targetDb}' zaten mevcut.`);
    }

    await client.end();
  } catch (err) {
    console.error('Test bağlantı hatası:', err);
  }
}

test();

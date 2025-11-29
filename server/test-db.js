import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Varsayılan veritabanına bağlanmayı deniyoruz
  password: 'Piner842301.#',
  port: 5432,
});

async function test() {
  try {
    console.log('Postgres veritabanına bağlanılıyor...');
    await client.connect();
    console.log('Bağlantı başarılı!');
    
    // Hedef veritabanı var mı kontrol et
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'projelerim_db'");
    if (res.rows.length === 0) {
        console.log("'projelerim_db' bulunamadı, oluşturuluyor...");
        await client.query('CREATE DATABASE projelerim_db');
        console.log("'projelerim_db' başarıyla oluşturuldu.");
    } else {
        console.log("'projelerim_db' zaten mevcut.");
    }

    await client.end();
  } catch (err) {
    console.error('Test bağlantı hatası:', err);
  }
}

test();

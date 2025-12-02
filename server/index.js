import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary Konfigürasyonu
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// CORS Ayarları (Localhost ve Domain için)
app.use(cors({
  origin: ['http://localhost:5173', 'https://pinartechstudio.com', 'https://www.pinartechstudio.com', 'https://pinar-topuz-portfolio.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Multer Konfigürasyonu (Memory Storage - Cloudinary için)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary Upload Helper
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "pinar_portfolio"
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

// Veritabanı Tablolarını Oluştur
const initDb = async () => {
  try {
    // Admin Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Projeler Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        year VARCHAR(10),
        image TEXT,
        type VARCHAR(50),
        tags TEXT[],
        client VARCHAR(100),
        role VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Blog Yazıları Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        date VARCHAR(50),
        read_time VARCHAR(20),
        image TEXT,
        category VARCHAR(100),
        tags TEXT[],
        views INTEGER DEFAULT 0,
        author_name VARCHAR(100),
        author_role VARCHAR(100),
        author_avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Mesajlar/Teklifler Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        service VARCHAR(100),
        budget VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ziyaretler Tablosu
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Admin Kullanıcısı ve Şifre Güncelleme
    const targetPassword = 'Piner842301.#';
    const hashedPassword = await bcrypt.hash(targetPassword, 10);
    
    const userCheck = await pool.query("SELECT * FROM admin_users WHERE username = 'pinardev'");
    
    if (userCheck.rows.length === 0) {
      // Kullanıcı yoksa oluştur
      await pool.query(
        "INSERT INTO admin_users (username, password) VALUES ($1, $2)",
        ['pinardev', hashedPassword]
      );
      console.log('Admin kullanıcısı oluşturuldu.');
    } else {
      // Kullanıcı varsa şifresini güncelle (Her ihtimale karşı)
      await pool.query(
        "UPDATE admin_users SET password = $1 WHERE username = 'pinardev'",
        [hashedPassword]
      );
      console.log('Admin şifresi güncellendi/doğrulandı.');
    }

    console.log('Veritabanı tabloları hazır.');
  } catch (err) {
    console.error('Veritabanı başlatma hatası:', err);
  }
};

initDb();

// Login Endpoint (Bcrypt ile)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM admin_users WHERE username = $1",
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      
      if (match) {
        res.json({ success: true, user: { username: user.username, role: 'admin' } });
      } else {
        res.status(401).json({ success: false, message: 'Geçersiz şifre' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROJELER API ---

// Projeleri Getir
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proje Ekle (Resimli - Cloudinary)
app.post('/api/projects', upload.single('image'), async (req, res) => {
  try {
    const { title, category, year, type, tags, client, role, description } = req.body;
    let imagePath = req.body.image; // Eğer URL olarak geldiyse

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imagePath = result.secure_url;
    }

    // Tags string olarak gelebilir, array'e çevir
    const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

    const result = await pool.query(
      "INSERT INTO projects (title, category, year, image, type, tags, client, role, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [title, category, year, imagePath, type, tagsArray, client, role, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Proje Güncelle (Resimli - Cloudinary)
app.put('/api/projects/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, year, type, tags, client, role, description } = req.body;
    let imagePath = req.body.image; 

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imagePath = result.secure_url;
    }

    const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

    const result = await pool.query(
      `UPDATE projects SET title=$1, category=$2, year=$3, image=$4, type=$5, tags=$6, client=$7, role=$8, description=$9 WHERE id=$10 RETURNING *`,
      [title, category, year, imagePath, type, tagsArray, client, role, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Proje Sil
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BLOG YAZILARI API ---

// Yazıları Getir
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yazı Ekle (Resimli - Cloudinary)
app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, date, read_time, category, tags, author_name, author_role, author_avatar } = req.body;
    let imagePath = req.body.image;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imagePath = result.secure_url;
    }

    const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

    const result = await pool.query(
      "INSERT INTO blog_posts (title, excerpt, content, date, read_time, image, category, tags, author_name, author_role, author_avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [title, excerpt, content, date, read_time, imagePath, category, tagsArray, author_name, author_role, author_avatar]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Yazı Güncelle (Resimli - Cloudinary)
app.put('/api/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, date, read_time, category, tags, author_name, author_role, author_avatar } = req.body;
    let imagePath = req.body.image;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imagePath = result.secure_url;
    }

    const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

    const result = await pool.query(
      `UPDATE blog_posts SET title=$1, excerpt=$2, content=$3, date=$4, read_time=$5, image=$6, category=$7, tags=$8, author_name=$9, author_role=$10, author_avatar=$11 WHERE id=$12 RETURNING *`,
      [title, excerpt, content, date, read_time, imagePath, category, tagsArray, author_name, author_role, author_avatar, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Yazı Sil
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM blog_posts WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- DİĞER API'LER ---

// Mesaj Gönderme Endpoint
app.post('/api/messages', async (req, res) => {
  const { name, email, service, budget, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO proposals (name, email, service, budget, message) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, service, budget, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mesajları Getirme Endpoint (Admin için)
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proposals ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ziyaret Kaydetme Endpoint
app.post('/api/visit', async (req, res) => {
  try {
    await pool.query("INSERT INTO visits DEFAULT VALUES");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// İstatistikleri Getirme Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    // Son 12 ayın verilerini getir
    const result = await pool.query(`
      SELECT 
        TO_CHAR(visited_at, 'Mon') as month,
        COUNT(*) as count
      FROM visits 
      WHERE visited_at >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(visited_at, 'Mon'), DATE_TRUNC('month', visited_at)
      ORDER BY DATE_TRUNC('month', visited_at) ASC
    `);
    
    // Toplam ziyaret sayısı
    const totalResult = await pool.query("SELECT COUNT(*) FROM visits");
    
    res.json({
      monthly: result.rows,
      total: totalResult.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Frontend Statik Dosyalarını Sunma (Production için - Render vb. için)
// Vercel'de bu kısmı Vercel'in kendi routing mekanizması halleder, o yüzden Vercel'de çalışmaz.
if (!process.env.VERCEL) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  // Tüm diğer istekleri index.html'e yönlendir (SPA için)
  app.get('/*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
  });
}

export default app;
# Pınar Tech Studio - Portfolio & Blog

Bu proje, Pınar Topuz'un kişisel portfolyo web sitesidir. Modern web teknolojileri kullanılarak geliştirilmiş olup, dinamik bir blog sistemi, proje yönetimi ve admin paneli içerir.

## 🚀 Teknolojiler

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (İkonlar)

**Backend:**
- Node.js
- Express.js
- PostgreSQL (Veritabanı)
- Cloudinary (Resim Depolama)
- JWT & Bcrypt (Kimlik Doğrulama)

## 🛠️ Kurulum (Local)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

### 1. Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL (Yerel veritabanı sunucusu)

### 2. Projeyi Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone https://github.com/CodeByPinar/pinardevstudio.git
cd pinardevstudio
npm install
```

### 3. Çevresel Değişkenleri Ayarlayın (.env)
Ana dizinde `.env` dosyası oluşturun ve aşağıdaki bilgileri girin:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:SIFRE@localhost:5432/projelerim_db
CLOUDINARY_CLOUD_NAME=sizin_cloud_name
CLOUDINARY_API_KEY=sizin_api_key
CLOUDINARY_API_SECRET=sizin_api_secret
```

### 4. Veritabanını Hazırlayın
PostgreSQL'de `projelerim_db` adında bir veritabanı oluşturun. Uygulama ilk çalıştığında tabloları otomatik oluşturacaktır.

### 5. Uygulamayı Başlatın

Backend'i başlatmak için:
```bash
node server/index.js
```

Frontend'i başlatmak için (yeni bir terminalde):
```bash
npm run dev
```

## 🌍 Yayına Alma (Deployment)

Bu proje **Render.com** üzerinde ücretsiz olarak yayınlanmak üzere yapılandırılmıştır.

Detaylı kurulum rehberi için [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) dosyasını inceleyebilirsiniz.

### Özet Adımlar:
1. Kodları GitHub'a yükleyin.
2. Render.com'da yeni bir **PostgreSQL** veritabanı oluşturun.
3. Render.com'da yeni bir **Web Service** oluşturun ve GitHub reponuzu bağlayın.
4. Environment Variable'ları (DATABASE_URL, CLOUDINARY_...) ekleyin.
5. Build komutu: `npm install && npm run build`
6. Start komutu: `node server/index.js`

## 📝 Lisans

Bu proje kişisel kullanım içindir. Tüm hakları saklıdır.

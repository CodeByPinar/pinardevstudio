# Render.com ile Ücretsiz Yayına Alma Rehberi

Bu rehber, projenizi (Node.js + PostgreSQL) **tamamen ücretsiz** olarak Render.com üzerinde yayınlamanızı ve `pinartechstudio.com` domainini bağlamanızı sağlar.

## 1. Hazırlık (GitHub)

Render, kodunuzu GitHub'dan çeker.
1. Projenizi GitHub'a yükleyin (Eğer yüklemediyseniz).
   - GitHub'da yeni bir repo oluşturun.
   - Kodlarınızı bu repoya pushlayın.

## 2. Veritabanı Kurulumu (Render PostgreSQL)

1. [Render.com](https://render.com) adresine gidin ve GitHub hesabınızla giriş yapın.
2. **New +** butonuna tıklayın ve **PostgreSQL** seçeneğini seçin.
3. Ayarlar:
   - **Name:** `pinar-db` (veya istediğiniz bir isim)
   - **Database:** `projelerim_db`
   - **User:** `pinardev`
   - **Region:** Frankfurt (EU Central) - Türkiye'ye en yakın.
   - **Instance Type:** **Free** (Ücretsiz planı seçin).
4. **Create Database** butonuna tıklayın.
5. Veritabanı oluşturulduktan sonra açılan sayfada **"Internal Database URL"** ve **"External Database URL"** göreceksiniz. Bu sayfayı açık tutun.

## 3. Web Servis Kurulumu (Node.js Backend + React)

1. Render Dashboard'a dönün.
2. **New +** butonuna tıklayın ve **Web Service** seçeneğini seçin.
3. **Build and deploy from a Git repository** seçeneğini seçin.
4. GitHub reponuzu listeden bulup **Connect** deyin.
5. Ayarlar:
   - **Name:** `pinar-portfolio`
   - **Region:** Frankfurt (Veritabanı ile aynı olsun).
   - **Branch:** `main` (veya `master`).
   - **Root Directory:** (Boş bırakın).
   - **Runtime:** **Node**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`
   - **Instance Type:** **Free**
6. **Environment Variables** (Çevresel Değişkenler) bölümüne gelin ve **Add Environment Variable** diyerek şunları ekleyin:
   - `DATABASE_URL`: (Veritabanı sayfasındaki **Internal Database URL**'i kopyalayıp buraya yapıştırın).
   - `CLOUDINARY_CLOUD_NAME`: (Cloudinary isminiz)
   - `CLOUDINARY_API_KEY`: (Cloudinary API Key)
   - `CLOUDINARY_API_SECRET`: (Cloudinary Secret)
   - `NODE_ENV`: `production`
7. **Create Web Service** butonuna tıklayın.

Render projenizi build edecek ve başlatacaktır. Bu işlem birkaç dakika sürebilir.

## 4. Domain Bağlantısı ve IP Adresi Alma

Projeniz Render'da çalışmaya başladıktan sonra (Deploy successful yazısını görünce):

1. Render'da Web Servisinizin (pinar-portfolio) sayfasına gidin.
2. Sol menüden **Settings** > **Custom Domains** kısmına gelin.
3. **Add Custom Domain** butonuna tıklayın.
4. Domain adınızı yazın: `pinartechstudio.com`
5. Render size yapmanız gereken DNS ayarlarını gösterecektir.
   - Size bir **A Kaydı (IP Adresi)** verecek: `216.24.57.1` (Örnek - Siz ekranda ne görüyorsanız onu kullanın).
   - Size bir **CNAME Kaydı** verecek: `www` için `pinar-portfolio.onrender.com` gibi.

## 5. Squarespace DNS Ayarları

Şimdi Squarespace Domains paneline gidin ve Render'ın size verdiği bilgileri girin:

| Host | Type | Data (Render'ın size verdiği değerler) |
|------|------|----------------------------------------|
| @    | A    | `216.24.57.1` (Render'dan aldığınız IP) |
| www  | CNAME| `sizin-proje-isminiz.onrender.com`      |

*(Not: Google Workspace MX kayıtlarına dokunmayın.)*

Tebrikler! Siteniz artık ücretsiz sunucuda ve kendi domaininizde çalışıyor.

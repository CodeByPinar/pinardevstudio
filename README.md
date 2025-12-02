![Pınar Tech Studio Banner](public/banner.jpeg)

<div align="center">

# 🚀 Pınar Tech Studio

**Modern, Ölçeklenebilir ve Yüksek Performanslı Full-Stack Web Platformu**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Canlı Demo](https://pinartechstudio.com) • [Hata Bildir](https://github.com/CodeByPinar/pinardevstudio/issues) • [İletişim](mailto:info@pinartechstudio.com)

</div>

---

## 📑 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Mimari](#-mimari)
- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Proje Yapısı](#-proje-yapısı)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 📖 Proje Hakkında

**Pınar Tech Studio**, modern web geliştirme standartlarına uygun olarak tasarlanmış, **Clean Architecture** prensiplerini benimseyen kapsamlı bir Full-Stack portfolyo ve içerik yönetim sistemidir.

Bu platform, sadece kişisel bir vitrin olmanın ötesinde; dinamik blog yönetimi, proje sergileme alanları ve güvenli bir yönetim paneli sunar. **SEO (Arama Motoru Optimizasyonu)** ve **Web Performansı (Core Web Vitals)** odaklı geliştirilmiştir.

---

## 🏗 Mimari

Proje, **Serverless** mimarisi üzerine kurulmuştur. Frontend ve Backend API, Vercel üzerinde barındırılırken, veritabanı Render üzerinde, medya dosyaları ise Cloudinary CDN üzerinde tutulmaktadır.

```mermaid
graph TD
    Client[Kullanıcı / Tarayıcı] -->|HTTPS| Vercel[Vercel Edge Network]
    Vercel -->|Statik Dosyalar| React[React Frontend]
    Vercel -->|API İstekleri| API[Node.js Serverless Functions]
    API -->|Veri Okuma/Yazma| DB[(PostgreSQL @ Render)]
    API -->|Medya Yönetimi| Cloudinary[Cloudinary CDN]
    React -->|Analitik| Analytics[Google Analytics & Vercel Analytics]
```

---

## ✨ Özellikler

### 🎨 Kullanıcı Arayüzü (Frontend)
*   **Responsive Tasarım:** Mobil öncelikli (Mobile-First) yaklaşım ile Tailwind CSS kullanılarak geliştirildi.
*   **Modern Animasyonlar:** Kullanıcı deneyimini artıran yumuşak geçişler ve mikro etkileşimler.
*   **Karanlık/Aydınlık Mod:** (Gelecek sürümlerde eklenecek altyapı hazır).
*   **SEO Uyumlu:** Dinamik meta etiketleri, `sitemap.xml`, `robots.txt` ve Open Graph protokolleri.

### ⚙️ Backend & Yönetim
*   **Güvenli Kimlik Doğrulama:** JWT (JSON Web Token) ve BCrypt ile güvenli giriş sistemi.
*   **Dinamik İçerik Yönetimi:** Blog yazıları, projeler ve hizmetler için tam CRUD (Ekle/Sil/Güncelle) desteği.
*   **Medya Optimizasyonu:** Yüklenen görseller otomatik olarak Cloudinary üzerinde optimize edilir ve webp formatında sunulur.
*   **RESTful API:** Standartlara uygun, ölçeklenebilir API yapısı.

---

## 🛠 Teknoloji Yığını

| Alan | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React 19 | UI Kütüphanesi |
| | TypeScript | Tip Güvenliği |
| | Vite | Build Tool & Dev Server |
| | Tailwind CSS | Utility-First CSS Framework |
| | Lucide React | İkon Seti |
| **Backend** | Node.js | Runtime Environment |
| | Express.js | Web Framework |
| | PostgreSQL | İlişkisel Veritabanı |
| | Prisma / pg | Veritabanı İstemcisi |
| **DevOps** | Vercel | Hosting & CI/CD |
| | Render | Database Hosting |
| | Cloudinary | Cloud Media Storage |
| | GitHub Actions | Otomasyon |

---

## 📸 Ekran Görüntüleri

| Ana Sayfa | Admin Paneli |
| :---: | :---: |
| ![Home](/public/anasayfa.jpeg) | ![Admin](/public/admin_panel.jpeg) |

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda geliştirmek için aşağıdaki adımları izleyin.

### 1. Ön Gereksinimler
*   **Node.js** (v18 veya üzeri)
*   **Git**
*   **PostgreSQL** (Yerel veya Bulut)

### 2. Projeyi Klonlayın
```bash
git clone https://github.com/CodeByPinar/pinardevstudio.git
cd pinardevstudio
```

### 3. Bağımlılıkları Yükleyin
```bash
npm install
```

### 4. Çevresel Değişkenleri (.env) Ayarlayın
Ana dizinde `.env` dosyası oluşturun ve aşağıdaki değerleri kendinize göre düzenleyin:

```env
PORT=5000
DATABASE_URL=postgresql://kullanici:sifre@localhost:5432/veritabani_adi
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
JWT_SECRET=cok_gizli_anahtar
```

### 5. Uygulamayı Başlatın

**Geliştirme Modu (Frontend + Backend):**
```bash
npm run dev
# Backend için ayrı terminalde:
npm start
```

**Production Build:**
```bash
npm run build
```

---

## 🔌 API Dokümantasyonu

Temel API uç noktaları aşağıdadır:

| Metot | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Tüm projeleri listeler |
| `GET` | `/api/blogs` | Blog yazılarını listeler |
| `POST` | `/api/auth/login` | Admin girişi yapar |
| `POST` | `/api/projects` | Yeni proje ekler (Auth Gerekli) |
| `DELETE` | `/api/blogs/:id` | Blog yazısını siler (Auth Gerekli) |

---

## 📂 Proje Yapısı

```
pinardevstudio/
├── 📁 api/                # Vercel Serverless Functions Entry
├── 📁 components/         # Yeniden kullanılabilir React bileşenleri
│   ├── 📁 admin/          # Admin paneli bileşenleri
│   └── 📁 ui/             # Temel UI elementleri (Button, Input vb.)
├── 📁 public/             # Statik dosyalar (Favicon, Robots.txt)
├── 📁 server/             # Backend kaynak kodları
│   ├── 📁 config/         # Veritabanı ve Cloudinary ayarları
│   ├── 📁 controllers/    # İstekleri işleyen fonksiyonlar
│   ├── 📁 routes/         # API rota tanımları
│   └── index.js           # Server giriş noktası
├── 📁 src/                # Frontend ana uygulama kodları
├── .env                   # Çevresel değişkenler (Git'e eklenmez)
├── vercel.json            # Vercel dağıtım ayarları
└── package.json           # Proje bağımlılıkları ve scriptler
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1.  Bu depoyu (repository) forklayın.
2.  Yeni bir özellik dalı (feature branch) oluşturun (`git checkout -b feature/YeniOzellik`).
3.  Değişikliklerinizi commitleyin (`git commit -m 'Yeni özellik eklendi'`).
4.  Dalınızı pushlayın (`git push origin feature/YeniOzellik`).
5.  Bir **Pull Request** oluşturun.

---

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

<div align="center">

**CodeByPinar** tarafından ❤️ ve ☕ ile geliştirildi.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pinartopuz/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/CodeByPinar)
[![Website](https://img.shields.io/badge/Website-PinarTechStudio-ff69b4?style=for-the-badge)](https://pinartechstudio.com)

</div>

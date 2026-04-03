
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandBar from './components/BrandBar';
import Philosophy from './components/Philosophy';
import Services from './components/Services';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Process from './components/Process';
import Blog from './components/Blog'; 
import Proposal from './components/Proposal';
import Footer from './components/Footer';
import Cursor from './components/ui/Cursor';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { ProjectData, BlogPost, User, UserRole } from './types';

// Default Projects Data
const defaultProjects: ProjectData[] = [
  {
    id: 1,
    title: "E-Ticaret API",
    category: "Backend Gelistirme",
    year: "2023",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop",
    type: "Backend",
    tags: ["ASP.NET Core", "C#", "SQL", "REST API"],
    client: "Perakende Sirketi",
    role: "Backend Lideri",
    description: "Buyuk olcekli bir e-ticaret platformu icin olceklenebilir bir RESTful API tasarlayip gelistirdim. Sistem gunluk binlerce islemi yonetiyor; JWT kimlik dogrulama, gelismis urun filtreleme ve siparis yonetimi mikroservisleri iceriyor."
  },
  {
    id: 2,
    title: "Yapay Zeka Analiz Paneli",
    category: "Veri Bilimi",
    year: "2024",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    type: "Data",
    tags: ["Python", "React", "Pandas", "Scikit-learn"],
    client: "Finans Teknoloji Cozumleri",
    role: "Full-Stack Gelistirici",
    description: "Gercek zamanli pazar trendlerini gorsellestiren uctan uca bir veri analitik paneli gelistirdim. Python ile anomali tahmin modelleri kurup, paydaslara aksiyon alinabilir icgoruler sunan React arayuzunu olusturdum."
  },
  {
    id: 3,
    title: "Bankacilik Mikroservisleri",
    category: "Sistem Mimarisi",
    year: "2023",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop",
    type: "Backend",
    tags: ["Java", "Spring Boot", "Docker", "Microservices"],
    client: "BankTech",
    role: "Yazilim Muhendisi",
    description: "Eski bir bankacilik sisteminin modernizasyonuna katkida bulunarak monolitik modulleri Java Spring Boot ile mikroservis mimarisine tasidim. Sistem guvenilirligini artirdik ve dagitim surelerini %40 azalttik."
  },
  {
    id: 4,
    title: "Kurumsal Portal",
    category: "Web Uygulamasi",
    year: "2022",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    type: "Frontend",
    tags: ["Angular", "TypeScript", "RxJS"],
    client: "Kurumsal Sirket",
    role: "Frontend Gelistirici",
    description: "Calisan yonetimi ve kaynak planlamasi icin kapsamli bir ic portal gelistirdim. Angular ile dinamik ve tekrar kullanilabilir bilesenler olusturarak cihazlar arasi kesintisiz bir deneyim sagladim."
  }
];

// Default Blog Data
const defaultPosts: BlogPost[] = [
  {
    id: 1,
    title: ".NET'te Clean Architecture Neden Onemli?",
    excerpt: "Sorumluluklarin ayrismasinin ASP.NET Core ile nasil daha bakimi kolay, test edilebilir ve olceklenebilir kurumsal uygulamalar sagladigini inceliyoruz.",
    content: "Clean Architecture yazilimi katmanlara ayirir ve her katmana net bir sorumluluk verir. \n\n## Spagetti Kod Sorunu\nBir cok eski projede is kurallari UI ya da veritabani mantigiyla siki sekilde baglidir. Bu da uygulamayi bozmadan birim test yazmayi veya veritabanini degistirmeyi zorlastirir.\n\n## Temiz Cozum\n.NET dunyasinda cozumumuzu genelde su sekilde kurgulariz: \n- **Domain:** Is kurallari ve varliklar \n- **Application:** Is akislari ve use-case katmani \n- **Infrastructure:** Dis bagimliliklar (Db, dosya sistemi vb.) \n- **Presentation:** API veya UI \n\nBu ayrim sayesinde is mantigini veritabani ya da UI'den bagimsiz test edebiliriz. Ayrica SQL Server'dan PostgreSQL'e gecis gibi teknoloji degisimleri cok daha kolay hale gelir.",
    date: "12 Eki 2024",
    readTime: "5 dk okuma",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop",
    tags: [".NET", "Mimari", "En Iyi Pratikler"],
    views: 1250,
    author: {
        name: "Pınar Topuz",
        role: "Full-Stack Gelistirici",
        avatar: "https://ui-avatars.com/api/?name=Pinar+Topuz&background=000&color=fff"
    }
  },
  {
    id: 2,
    title: "React ile Yapay Zeka Modellerini Entegre Etmek",
    excerpt: "Python tabanli makine ogrenmesi modellerini REST API veya WebSocket ile React arayuze nasil baglayabileceginizi adim adim anlatiyoruz.",
    content: "Makine ogrenmesinin yayginlasmasiyla birlikte frontend ekipleri artik AI uretimi veriyi sikca ekrana tasiyor. \n\n## Mimari Yaklasim\nYaygin yontem, Python modelinizi Flask ya da FastAPI tarafinda servis etmek ve React uygulamanizin bu servisi tuketmesidir. \n\n## Gecikme Yonetimi\nAI cikarimi zaman alabileceginden gecikme yonetimi kritik hale gelir. Bu durumda WebSocket veya Server-Sent Events (SSE), standart HTTP isteklerine gore daha iyi bir kullanici deneyimi sunar.\n\n- Asenkron destek icin **FastAPI** kullanin\n- Onbellekleme icin **React Query** ekleyin\n- Arayuzde iyimser guncellemeler uygulayin",
    date: "05 Kas 2024",
    readTime: "7 dk okuma",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    tags: ["React", "AI", "Python"],
    views: 980,
    author: {
        name: "Pınar Topuz",
        role: "Full-Stack Gelistirici",
        avatar: "https://ui-avatars.com/api/?name=Pinar+Topuz&background=000&color=fff"
    }
  },
  {
    id: 3,
    title: "Mikroservisler: Monolit Ne Zaman Yetmez?",
    excerpt: "Mikroservislerin artilarini ve eksilerini birlikte degerlendiriyoruz. Bu karmasiklik sizin senaryonuz icin gercekten gerekli mi?",
    content: "Mikroservisler bagimsiz olceklenme ve dagitim avantajlari sunar; bu da buyuk ekipler icin gucludur. \n\n## Bedeli\nBununla birlikte daginik sistem karmasikligini da beraberinde getirir: \n- Ag gecikmesi \n- Veri tutarliligi sorunlari (CAP teoremi) \n- Izleme zorluklari (Distributed Tracing)\n\n### Oneri\nBir startup icin mikroservislere gecmeden once, iyi tasarlanmis bir **Moduler Monolit** yapisinin sizin icin daha uygun olup olmadigini mutlaka degerlendirin.",
    date: "15 Ara 2024",
    readTime: "6 dk okuma",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    tags: ["Mikroservis", "Sistem Tasarimi"],
    views: 3400,
    author: {
        name: "Pınar Topuz",
        role: "Full-Stack Gelistirici",
        avatar: "https://ui-avatars.com/api/?name=Pinar+Topuz&background=000&color=fff"
    }
  }
];

function App() {
  const [view, setView] = useState<'public' | 'login' | 'admin'>('public');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Initialize Data
  useEffect(() => {
    // Check URL for admin route
    if (window.location.hash === '#admin') {
      setView('login');
    }

    // Record Visit
    const recordVisit = async () => {
        if (!sessionStorage.getItem('visited')) {
            try {
                await fetch('/api/visit', { method: 'POST' });
                sessionStorage.setItem('visited', 'true');
            } catch (error) {
                console.error('Visit recording failed:', error);
            }
        }
    };
    recordVisit();

    // Fetch Projects from Backend
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data); // Veritabanı boşsa boş array set et, default veriyi yükleme
        }
      } catch (error) {
        console.error("Projeler yüklenemedi:", error);
        // Hata durumunda da boş bırak veya kullanıcıya bildir, default veri yükleme
        setProjects([]); 
      }
    };

    // Fetch Posts from Backend
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data); // Veritabanı boşsa boş array set et
        }
      } catch (error) {
        console.error("Yazılar yüklenemedi:", error);
        setPosts([]);
      }
    };

    fetchProjects();
    fetchPosts();

  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setMessages([]);
        return;
      }

      try {
        const response = await fetch('/api/messages', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else if (response.status === 401 || response.status === 403) {
          setMessages([]);
        }
      } catch (error) {
        console.error('Mesajlar yüklenemedi:', error);
      }
    };

    if (currentUser?.role === 'admin') {
      fetchMessages();
    }
  }, [currentUser]);

  // Handlers for Admin
  const handleUpdateProjects = (newProjects: ProjectData[]) => {
    setProjects(newProjects);
    // Backend'e kaydetme işlemi AdminDashboard içinde yapılacak, burada sadece state güncelleniyor
  };

  const handleUpdatePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
  };

  const handleNewMessage = (msg: any) => {
    const newMessages = [msg, ...messages];
    setMessages(newMessages);
    localStorage.setItem('pinar_messages', JSON.stringify(newMessages));
  };

  // Navigation
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setView('admin');
  };

  const goPublic = () => {
     setView('public');
     setCurrentUser(null);
      localStorage.removeItem('admin_token');
     window.location.hash = '';
  };

  // ----------------------------------------------------
  // VIEW: ADMIN DASHBOARD
  // ----------------------------------------------------
  if (view === 'admin' && currentUser) {
    return (
      <AdminDashboard 
        user={currentUser}
        projects={projects} 
        posts={posts}
        messages={messages} 
        onUpdateProjects={handleUpdateProjects} 
        onUpdatePosts={handleUpdatePosts}
        onLogout={goPublic}
      />
    );
  }

  // ----------------------------------------------------
  // VIEW: ADMIN LOGIN
  // ----------------------------------------------------
  if (view === 'login') {
    return (
       <AdminLogin onLogin={handleLoginSuccess} onBack={goPublic} />
    );
  }

  // ----------------------------------------------------
  // VIEW: PUBLIC PORTFOLIO
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-white custom-cursor-enabled">
      {/* Custom Cursor only visible on desktop */}
      <div className="hidden lg:block">
        <Cursor />
      </div>
      
      <Navbar />
      <main>
        <Hero />
        <BrandBar />
        <Philosophy />
        <Services />
        <TechStack />
        <Experience />
        <Process /> 
        <Projects projects={projects} />
        <Blog posts={posts} />
        <Proposal onSendMessage={handleNewMessage} />
      </main>
      
      <Footer onAdminClick={() => setView('login')} />
    </div>
  );
}

export default App;

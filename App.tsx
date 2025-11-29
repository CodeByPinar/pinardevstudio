
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
    title: "E-Commerce API",
    category: "Backend Development",
    year: "2023",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop",
    type: "Backend",
    tags: ["ASP.NET Core", "C#", "SQL", "REST API"],
    client: "Retail Corp",
    role: "Backend Lead",
    description: "Designed and implemented a scalable RESTful API for a large-scale e-commerce platform. The system handles thousands of transactions daily, featuring JWT authentication, complex product filtering, and order management microservices."
  },
  {
    id: 2,
    title: "AI Analysis Dashboard",
    category: "Data Science",
    year: "2024",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    type: "Data",
    tags: ["Python", "React", "Pandas", "Scikit-learn"],
    client: "FinTech Solutions",
    role: "Full Stack Dev",
    description: "An end-to-end data analytics dashboard that visualizes real-time market trends. I built the machine learning models in Python to predict anomalies and a React frontend to present actionable insights to stakeholders."
  },
  {
    id: 3,
    title: "Banking Microservices",
    category: "System Architecture",
    year: "2023",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop",
    type: "Backend",
    tags: ["Java", "Spring Boot", "Docker", "Microservices"],
    client: "BankTech",
    role: "Software Engineer",
    description: "Contributed to the modernization of a legacy banking system by migrating monolithic modules to a microservices architecture using Java Spring Boot. Improved system reliability and reduced deployment times by 40%."
  },
  {
    id: 4,
    title: "Corporate Portal",
    category: "Web Application",
    year: "2022",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    type: "Frontend",
    tags: ["Angular", "TypeScript", "RxJS"],
    client: "Enterprise Co.",
    role: "Frontend Dev",
    description: "Developed a comprehensive internal portal for employee management and resource scheduling. Utilized Angular to create dynamic, reusable components and ensured a seamless user experience across devices."
  }
];

// Default Blog Data
const defaultPosts: BlogPost[] = [
  {
    id: 1,
    title: "Why Clean Architecture Matters in .NET",
    excerpt: "Exploring the benefits of separating concerns and how it leads to maintainable, testable, and scalable enterprise applications using ASP.NET Core.",
    content: "Clean Architecture divides the software into layers, each with specific responsibilities. \n\n## The Problem with Spaghetti Code\nIn many legacy projects, business logic is tightly coupled with UI or Database logic. This makes it impossible to write unit tests or swap out databases without breaking the entire app.\n\n## The Clean Solution\nIn .NET, we typically organize our solution into: \n- **Domain:** Enterprise logic and entities \n- **Application:** Business use cases \n- **Infrastructure:** External concerns (Db, File System) \n- **Presentation:** API or UI \n\nThis separation allows us to test business logic in isolation without worrying about the database or the UI framework. It also makes switching underlying technologies (like swapping SQL Server for PostgreSQL) much easier.",
    date: "Oct 12, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop",
    tags: [".NET", "Architecture", "Best Practices"],
    views: 1250,
    author: {
        name: "Pınar Topuz",
        role: "Full-Stack Developer",
        avatar: "https://ui-avatars.com/api/?name=Pinar+Topuz&background=000&color=fff"
    }
  },
  {
    id: 2,
    title: "Integrating AI Models with React",
    excerpt: "A practical guide on how to serve Python-based machine learning models to a React frontend using RESTful APIs or WebSockets.",
    content: "With the rise of ML, frontend developers often need to display AI-generated data. \n\n## The Architecture\nThe standard approach involves creating a Flask or FastAPI backend to host your Python model. Then, your React application can consume this API. \n\n## Handling Latency\nKey challenges include handling latency—AI inference can be slow—so using WebSockets or Server-Sent Events (SSE) often provides a better UX than standard HTTP requests.\n\n- Use **FastAPI** for async support\n- Implement **React Query** for caching\n- Show optimistic updates in UI",
    date: "Nov 05, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    tags: ["React", "AI", "Python"],
    views: 980,
    author: {
        name: "Pınar Topuz",
        role: "Full-Stack Developer",
        avatar: "https://ui-avatars.com/api/?name=Pinar+Topuz&background=000&color=fff"
    }
  },
  {
    id: 3,
    title: "Microservices: When Monoliths Aren't Enough",
    excerpt: "Breaking down the pros and cons of microservices. Is the complexity worth it for your specific use case?",
    content: "Microservices offer independent scalability and deployment, which is great for large teams. \n\n## The Trade-off\nHowever, they introduce distributed system complexities like: \n- Network latency \n- Data consistency issues (CAP theorem) \n- Monitoring challenges (Distributed Tracing)\n\n### Recommendation\nBefore jumping into microservices for a startup, consider if a well-structured **Modular Monolith** might serve you better.",
    date: "Dec 15, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    tags: ["Microservices", "System Design"],
    views: 3400,
    author: {
        name: "Pınar Topuz",
        role: "Full-Stack Developer",
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

    // Fetch Messages from Backend
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Mesajlar yüklenemedi:", error);
      }
    };

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

    fetchMessages();
    fetchProjects();
    fetchPosts();

  }, []);

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

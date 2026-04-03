
import React, { useState } from 'react';
import { Database, Layout, Code, ArrowRight } from 'lucide-react';
import ServiceModal, { ServiceData } from './ServiceModal';

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  const services: ServiceData[] = [
    {
      title: "Full-Stack Gelistirme",
      icon: Layout,
      description: "ASP.NET Core, React ve Angular ile olceklenebilir web uygulamalari gelistiriyor; hizli ve kullanici dostu arayuzler sunuyorum.",
      detailedDescription: "Uctan uca web uygulama gelistirme hizmeti sunuyorum. Fikir asamasindan UI/UX tasarimina, frontend uygulamadan backend entegrasyonuna kadar tum sureci yonetiyorum. Odagim; yuksek performansli, SEO uyumlu ve tum cihazlarda sorunsuz calisan responsive urunler olusturmaktir.",
      color: "text-blue-600",
      bg: "group-hover:bg-blue-50",
      features: [
        "Tek Sayfa Uygulamalari (SPA)",
        "Asamali Web Uygulamalari (PWA)",
        "Responsive UI/UX Uygulamasi",
        "Sunucu Tarafli Render (Next.js)",
        "Tarayicilar Arasi Uyumluluk"
      ],
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Angular"]
    },
    {
      title: "Backend ve Mikroservis",
      icon: Code,
      description: "Saglam RESTful API'ler tasarlayip JWT kimlik dogrulama uygular, Java ve C# ile mikroservis mimarileri kuruyorum.",
      detailedDescription: "Guvenli ve olceklenebilir sunucu tarafi sistem mimarileri kurma konusunda uzmanim. Startup icin monolitik API de, kurumsal yapi icin daginik mikroservis mimarisi de gerekiyorsa; kod kalitesi, guvenlik ve performans optimizasyonunu birlikte sagliyorum.",
      color: "text-green-600",
      bg: "group-hover:bg-green-50",
      features: [
        "RESTful ve GraphQL API Tasarimi",
        "Mikroservis Mimarisi",
        "JWT Kimlik Dogrulama ve OAuth2",
        "Veritabani Optimizasyonu (SQL/NoSQL)",
        "Docker ve Kubernetes Dagitimi"
      ],
      technologies: ["C#", ".NET Core", "Java", "Spring Boot", "PostgreSQL", "Redis", "Docker"]
    },
    {
      title: "Veri Bilimi ve Yapay Zeka",
      icon: Database,
      description: "Python (Pandas, NumPy) ile makine ogrenmesi modelleri gelistiriyor, veriyi isleyip veriye dayali icgoruler uretiyorum.",
      detailedDescription: "Gelismis analitik ve yapay zeka entegrasyonu ile verinizin potansiyelini ortaya cikariyorum. Isletmelerin sureclerini otomatiklestirmesine, trendleri tahmin etmesine ve ozel ML modelleri ile veri gorsellestirme panelleri sayesinde aksiyon alinabilir icgoruler elde etmesine destek oluyorum.",
      color: "text-purple-600",
      bg: "group-hover:bg-purple-50",
      features: [
        "Tahminleme ve Ongorulu Modellemler",
        "Dogal Dil Isleme (NLP)",
        "Veri Gorsellestirme Panelleri",
        "ETL Hatti Gelistirme",
        "API Uzerinden AI Model Entegrasyonu"
      ],
      technologies: ["Python", "Pandas", "Scikit-learn", "TensorFlow", "Matplotlib", "SQL"]
    }
  ];

  return (
    <section className="py-24 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
           <span className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2 block">Uzmanlik</span>
           <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-6">
            Teknik Yetkinlikler
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Guvenli, olceklenebilir ve verimli yazilim cozumleri icin modern teknolojiler kullaniyorum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              onClick={() => setSelectedService(service)}
              className={`p-8 md:p-10 rounded-[2rem] border border-gray-100 bg-white hover:border-black/10 hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col items-start h-full relative overflow-hidden`}
            >
              {/* Hover Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 ${service.bg} transition-opacity duration-500 -mr-10 -mt-10`}></div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-gray-100 bg-white shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                <service.icon className={`w-7 h-7 ${service.color}`} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl font-bold text-black mb-4 group-hover:translate-x-1 transition-transform duration-300">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base mb-8 flex-grow">
                {service.description}
              </p>

              <div className="flex items-center text-sm font-bold text-black group-hover:gap-2 transition-all">
                <span>Daha Fazla</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

      </div>

      <ServiceModal 
        service={selectedService} 
        onClose={() => setSelectedService(null)} 
      />
    </section>
  );
};

export default Services;

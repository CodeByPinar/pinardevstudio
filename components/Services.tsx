
import React, { useState } from 'react';
import { Database, Layout, Code, ArrowRight } from 'lucide-react';
import ServiceModal, { ServiceData } from './ServiceModal';

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  const services: ServiceData[] = [
    {
      title: "Full-Stack Development",
      icon: Layout,
      description: "Building scalable web applications using ASP.NET Core, React, and Angular. Delivering responsive and user-friendly interfaces.",
      detailedDescription: "I provide end-to-end web application development services. From conceptualization and UI/UX design to frontend implementation and backend integration. My focus is on creating high-performance, SEO-friendly, and responsive applications that work seamlessly across all devices.",
      color: "text-blue-600",
      bg: "group-hover:bg-blue-50",
      features: [
        "Single Page Applications (SPA)",
        "Progressive Web Apps (PWA)",
        "Responsive UI/UX Implementation",
        "Server-Side Rendering (Next.js)",
        "Cross-Browser Compatibility"
      ],
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Angular"]
    },
    {
      title: "Backend & Microservices",
      icon: Code,
      description: "Designing robust RESTful APIs, implementing JWT authentication, and creating microservice architectures with Java and C#.",
      detailedDescription: "I specialize in architecting secure and scalable server-side systems. Whether you need a monolithic API for a startup or a distributed microservices architecture for an enterprise, I ensure code quality, security, and performance optimization.",
      color: "text-green-600",
      bg: "group-hover:bg-green-50",
      features: [
        "RESTful & GraphQL API Design",
        "Microservices Architecture",
        "JWT Authentication & OAuth2",
        "Database Optimization (SQL/NoSQL)",
        "Docker & Kubernetes Deployment"
      ],
      technologies: ["C#", ".NET Core", "Java", "Spring Boot", "PostgreSQL", "Redis", "Docker"]
    },
    {
      title: "Data Science & AI",
      icon: Database,
      description: "Developing machine learning models, processing data with Python (Pandas, NumPy), and providing data-driven insights.",
      detailedDescription: "Unlock the power of your data with advanced analytics and AI integration. I help businesses automate processes, predict trends, and gain actionable insights through custom machine learning models and data visualization dashboards.",
      color: "text-purple-600",
      bg: "group-hover:bg-purple-50",
      features: [
        "Predictive Modeling & Forecasting",
        "Natural Language Processing (NLP)",
        "Data Visualization Dashboards",
        "ETL Pipeline Development",
        "AI Model Integration via API"
      ],
      technologies: ["Python", "Pandas", "Scikit-learn", "TensorFlow", "Matplotlib", "SQL"]
    }
  ];

  return (
    <section className="py-24 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
           <span className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2 block">Expertise</span>
           <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-6">
            Technical Capabilities
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Leveraging cutting-edge technologies to build secure, scalable, and efficient software solutions.
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
                <span>Learn More</span>
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

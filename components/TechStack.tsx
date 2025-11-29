
import React from 'react';
import { Code2, Server, Database, Globe, Cpu, Layers, Box, Terminal, Coffee, Container, Braces } from 'lucide-react';

const TechStack: React.FC = () => {
  const technologies = [
    {
      name: 'ASP.NET Core',
      category: 'Backend Framework',
      icon: Server,
      description: 'Building high-performance, cross-platform web APIs and scalable server-side applications.'
    },
    {
      name: 'React Ecosystem',
      category: 'Frontend Library',
      icon: Code2,
      description: 'Creating dynamic user interfaces with React, Next.js, Redux, and modern hooks patterns.'
    },
    {
      name: 'C# & .NET',
      category: 'Core Language',
      icon: Terminal,
      description: 'Leveraging strong typing and object-oriented features for robust enterprise solutions.'
    },
    {
      name: 'Microservices',
      category: 'Architecture',
      icon: Layers,
      description: 'Designing distributed systems using Docker, Kubernetes, and event-driven patterns.'
    },
    {
      name: 'Python & AI',
      category: 'Data Science',
      icon: Cpu,
      description: 'Developing machine learning models and data processing pipelines with Pandas & Scikit-learn.'
    },
    {
      name: 'SQL & Databases',
      category: 'Data Persistence',
      icon: Database,
      description: 'Optimizing schema design and queries for PostgreSQL, SQL Server, and Redis.'
    },
    {
      name: 'Angular',
      category: 'Frontend Framework',
      icon: Globe,
      description: 'Building structured, large-scale enterprise single-page applications with TypeScript.'
    },
    {
      name: 'Java Spring',
      category: 'Backend Framework',
      icon: Coffee,
      description: 'Experience in building secure and transactional backend systems with Spring Boot.'
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative border-t border-gray-100" id="tech-stack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2 block">Tools & Technologies</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-6">Core Tech Stack</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            A curated selection of the powerful technologies I use to build digital products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="p-6 rounded-[2rem] border border-gray-100 bg-white hover:border-black/10 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Hover Effect Background */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime opacity-0 group-hover:opacity-10 rounded-bl-full transition-all duration-500 -mr-6 -mt-6"></div>

              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-brand-lime group-hover:scale-110 transition-all duration-300">
                <tech.icon size={26} className="text-black" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl font-bold text-black mb-1">{tech.name}</h3>
              <span className="text-xs font-bold uppercase text-brand-green tracking-wider block mb-4">{tech.category}</span>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;

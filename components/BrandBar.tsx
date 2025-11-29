
import React from 'react';
import { Database, Code2, Globe, Server, Layers, Box, Cpu, Braces, GitBranch, Terminal } from 'lucide-react';

const BrandBar: React.FC = () => {
  const stack = [
    { name: 'ASP.NET Core', icon: Server },
    { name: 'React', icon: Code2 },
    { name: 'C#', icon: Braces },
    { name: 'Python', icon: Terminal },
    { name: 'SQL', icon: Database },
    { name: 'Angular', icon: Globe },
    { name: 'TensorFlow', icon: Cpu },
    { name: 'Pandas', icon: Database },
    { name: 'Scikit-learn', icon: Cpu },
    { name: 'Git', icon: GitBranch },
  ];

  return (
    <div className="bg-black py-10 border-y border-gray-800 relative z-20 overflow-hidden">
      {/* Gradient Masks for smooth fade in/out - Premium Touch */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

      <div className="flex w-full">
        {/* First Loop */}
        <div className="flex animate-marquee shrink-0 min-w-full items-center justify-around">
          {stack.map((tech, index) => (
            <div key={`stack-1-${index}`} className="flex items-center gap-3 mx-8 group cursor-default select-none">
              <tech.icon className="text-gray-600 w-6 h-6 group-hover:text-brand-lime transition-colors duration-300" />
              <span className="text-gray-500 font-bold text-2xl tracking-tight group-hover:text-white transition-colors duration-300">{tech.name}</span>
            </div>
          ))}
        </div>
        
        {/* Second Loop for seamless effect */}
         <div className="flex animate-marquee shrink-0 min-w-full items-center justify-around">
          {stack.map((tech, index) => (
            <div key={`stack-2-${index}`} className="flex items-center gap-3 mx-8 group cursor-default select-none">
              <tech.icon className="text-gray-600 w-6 h-6 group-hover:text-brand-lime transition-colors duration-300" />
              <span className="text-gray-500 font-bold text-2xl tracking-tight group-hover:text-white transition-colors duration-300">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandBar;

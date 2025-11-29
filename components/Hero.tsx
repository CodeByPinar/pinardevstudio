
import React from 'react';
import Button from './ui/Button';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
      
      {/* Decorative Abstract Shapes */}
      {/* Triangle Left */}
      <div className="absolute top-20 left-10 lg:left-40 animate-float opacity-80">
         <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M20 0L37.3205 30H2.67949L20 0Z" stroke="black" strokeWidth="2.5" transform="rotate(-15 20 20)"/>
         </svg>
      </div>

      {/* Square Left Yellow */}
      <div className="absolute top-48 left-6 lg:left-24 animate-pulse">
        <div className="w-12 h-12 bg-brand-lime transform rotate-12 border-2 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)]"></div>
      </div>

      {/* Green Diamond Right */}
      <div className="absolute top-24 right-8 lg:right-40 animate-float-delayed">
        <div className="w-10 h-10 bg-brand-green transform rotate-45 rounded-lg shadow-sm"></div>
      </div>

       {/* Plus Sign Right */}
       <div className="absolute top-64 right-6 lg:right-24 opacity-60">
         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 transform rotate-12">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
         </svg>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Availability Badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
            </span>
            <span className="text-sm font-semibold text-gray-700">Available for new projects</span>
          </div>
        </div>

        <div className="inline-flex items-center space-x-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="w-12 h-[2px] bg-black"></span>
          <span className="text-black font-semibold tracking-wide uppercase text-sm">Hello, I'm Pınar Topuz 👋</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-black mb-8 leading-[0.9] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Full-Stack<br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-black">
            Developer
            {/* Underline decoration */}
            <svg className="absolute w-full h-4 -bottom-1 left-0 text-brand-lime opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Innovative Full-Stack Developer with 4 years of experience building scalable web applications using 
          <strong> ASP.NET Core</strong>, <strong>C#</strong>, and <strong>React</strong>. 
          Expert in designing robust RESTful APIs, Microservices, and implementing Clean Architecture & SOLID principles.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <a href="#proposal" onClick={handleScroll}>
            <Button variant="primary" size="lg" className="min-w-[180px] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all">
                Get In Touch
            </Button>
          </a>
          <a href="#portfolio" onClick={handleScroll}>
            <Button variant="white" size="lg" className="min-w-[180px] border-black shadow-[4px_4px_0px_rgba(200,200,200,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(200,200,200,1)] transition-all">
                View Portfolio
            </Button>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute left-1/2 bottom-[-80px] transform -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-black/20"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

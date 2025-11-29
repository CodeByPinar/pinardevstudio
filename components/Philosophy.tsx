
import React from 'react';
import { Check, ArrowRight, Code2 } from 'lucide-react';

const Philosophy: React.FC = () => {
  const values = [
    { title: "Clean Architecture & SOLID", desc: "Building scalable, maintainable systems by strictly adhering to best coding practices." },
    { title: "Agile & Scrum", desc: "Collaborating effectively within teams to deliver iterative, high-quality software solutions." },
    { title: "Continuous Learning", desc: "Passionately updating technical knowledge to stay ahead in the evolving tech landscape." }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden" id="about">
      {/* Decorative large watermark text */}
      <div className="hidden lg:block absolute top-1/2 -right-20 transform -translate-y-1/2 text-[15rem] xl:text-[20rem] font-black text-gray-50 pointer-events-none select-none leading-none z-0">
        CODE
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual Composition (Left on Desktop) */}
          <div className="relative order-2 lg:order-1 px-4 lg:px-0">
             {/* Main Image Container */}
             <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 bg-black group">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" 
                  alt="Tech Workspace" 
                  className="w-full h-[500px] lg:h-[600px] object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Glassmorphism Info Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-lg transition-all duration-300 group-hover:bg-white/15">
                   <div className="flex justify-between items-end">
                      <div>
                         {/* Status Pill */}
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 mb-4 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">System Online</span>
                         </div>
                         
                         <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Tech Workspace</h3>
                         <p className="text-gray-300 text-sm font-medium border-l-2 border-brand-lime pl-3">
                           Building the future,<br/> one line at a time.
                         </p>
                      </div>

                      {/* Icon Box */}
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Code2 size={28} className="text-black" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Floating Badge 1: Experience (Top Right) */}
             <div className="absolute -top-6 -right-4 lg:-right-10 bg-white p-6 rounded-2xl shadow-[8px_8px_0px_rgba(0,0,0,1)] border-2 border-black z-20 animate-float">
                <p className="text-5xl font-extrabold text-black mb-1">04<span className="text-brand-lime">+</span></p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Years of<br/>Experience</p>
             </div>

             {/* Floating Badge 2: Tech (Bottom Left) */}
             <div className="absolute -bottom-6 -left-4 lg:-left-10 bg-brand-lime p-6 lg:p-8 rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] z-20 animate-float-delayed flex items-center justify-center w-32 h-32 lg:w-40 lg:h-40">
                <div className="text-center">
                   <p className="text-2xl lg:text-3xl font-black text-black leading-none">.NET</p>
                   <p className="text-[10px] lg:text-xs font-bold uppercase mt-1">Core Expert</p>
                </div>
             </div>

             {/* Decorative Background Outline */}
             <div className="absolute -z-10 top-10 left-10 w-full h-full border-2 border-black/5 rounded-[2.5rem] transform translate-x-4 translate-y-4 lg:translate-x-6 lg:translate-y-6"></div>
          </div>

          {/* Text Content (Right on Desktop) */}
          <div className="order-1 lg:order-2">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-bold uppercase tracking-wider mb-8 text-gray-800 border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse"></span>
                My Approach
             </div>
            
            <h2 className="text-5xl md:text-6xl font-extrabold text-black mb-8 leading-[1.05] tracking-tight">
              Engineering solutions with <span className="relative inline-block text-brand-black px-2 italic bg-brand-lime skew-x-[-10deg]">precision.</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
              I am dedicated to delivering quality solutions by strictly adhering to best practices like Clean Architecture. My expertise lies in designing microservice architectures, integrating secure JWT authentication, and optimizing full-stack performance.
            </p>

            <div className="space-y-8 mb-12">
              {values.map((item, idx) => (
                <div key={idx} className="flex items-start gap-5 group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-lime shadow-lg">
                    <Check size={24} className="text-white group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-black group-hover:text-brand-green transition-colors mb-1">{item.title}</h4>
                    <p className="text-base text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact" className="group inline-flex items-center gap-3 text-lg font-bold border-b-2 border-black pb-1 hover:text-brand-green hover:border-brand-green transition-all">
              <span>Let's collaborate</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Philosophy;

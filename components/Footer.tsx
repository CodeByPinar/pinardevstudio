
import React from 'react';
import { ArrowUpRight, Send, MapPin, Phone, Mail, Lock } from 'lucide-react';
import Button from './ui/Button';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-brand-lime pt-28 pb-10 relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* CTA Section */}
          <div className="flex flex-col items-start text-left">
             <span className="inline-block px-4 py-1 border border-black rounded-full font-semibold text-sm mb-8 uppercase tracking-widest bg-white/20 backdrop-blur-sm">
               Open for new opportunities
             </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-black mb-10 leading-[0.9] tracking-tighter">
              Let's build<br/>
              something great.
            </h2>
             <a href="mailto:contact@pinartechstudio.com" className="group relative inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 shadow-xl">
              <span>contact@pinartechstudio.com</span>
              <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform duration-300"/>
            </a>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-end">
            <div className="bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[2rem] border border-white/50 space-y-8">
              <h3 className="text-2xl font-bold text-black">Contact Details</h3>
              
              {/* Phone Number Hidden
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full">
                      <Phone size={24} />
                  </div>
                  <div>
                      <p className="text-xs font-bold uppercase text-black/50">Phone</p>
                      <p className="text-lg font-semibold">5421105592</p>
                  </div>
              </div>
              */}

               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full">
                      <MapPin size={24} />
                  </div>
                  <div>
                      <p className="text-xs font-bold uppercase text-black/50">Location</p>
                      <p className="text-lg font-semibold">Samsun, Turkey</p>
                  </div>
              </div>

              <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full">
                      <Mail size={24} />
                  </div>
                  <div>
                      <p className="text-xs font-bold uppercase text-black/50">Email</p>
                      <p className="text-lg font-semibold break-all">contact@pinartechstudio.com</p>
                  </div>
              </div>
            </div>
          </div>
        
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-black/10 pt-10 gap-8">
          <div className="text-center md:text-left">
             <h3 className="font-bold text-2xl mb-2 text-black">Pınar Topuz</h3>
             <p className="text-sm font-medium text-black/60">© 2025 Pınar Tech Studio.<br/>All rights reserved.</p>
          </div>
          
          <div className="flex gap-8 flex-wrap justify-center items-center">
            <a href="https://www.linkedin.com/in/pinardev/" target="_blank" className="text-black text-lg font-bold hover:underline decoration-2 underline-offset-4 transition-all hover:text-white">LinkedIn</a>
            <a href="https://github.com/CodeByPinar" target="_blank" className="text-black text-lg font-bold hover:underline decoration-2 underline-offset-4 transition-all hover:text-white">Github</a>
            <a href="https://www.instagram.com/pinariisko/" target="_blank" className="text-black text-lg font-bold hover:underline decoration-2 underline-offset-4 transition-all hover:text-white">Instagram</a>
            <a href="https://x.com/pinariisko" target="_blank" className="text-black text-lg font-bold hover:underline decoration-2 underline-offset-4 transition-all hover:text-white">X (Twitter)</a>
            
            {/* Secret Admin Link */}
            {onAdminClick && (
              <button onClick={onAdminClick} className="opacity-20 hover:opacity-100 transition-opacity ml-4" title="Admin Login">
                <Lock size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -bottom-1/4 left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] bg-white opacity-20 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 opacity-30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-green-400 opacity-20 rounded-full blur-2xl animate-float-delayed"></div>
    </footer>
  );
};

export default Footer;

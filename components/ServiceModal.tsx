
import React, { useEffect } from 'react';
import { X, CheckCircle, ArrowRight, Zap, Layers, Code } from 'lucide-react';
import Button from './ui/Button';

export interface ServiceData {
  title: string;
  icon: any;
  description: string;
  color: string;
  bg: string;
  detailedDescription?: string;
  features?: string[];
  technologies?: string[];
}

interface ServiceModalProps {
  service: ServiceData | null;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  // Lock body scroll
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [service]);

  if (!service) return null;

  const Icon = service.icon;

  const handleGetStarted = () => {
    onClose();
    const proposalSection = document.getElementById('proposal');
    if (proposalSection) {
      proposalSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className={`relative p-10 ${service.bg.replace('group-hover:', '')} bg-opacity-50`}>
           <button 
             onClick={onClose}
             className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white rounded-full transition-all text-black"
           >
             <X size={24} />
           </button>

           <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm ${service.color}`}>
                 <Icon size={40} strokeWidth={1.5} />
              </div>
              <div className="flex-1 pt-2">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-2">{service.title}</h2>
                 <p className="text-gray-600 font-medium text-lg">Professional Solutions tailored to your needs.</p>
              </div>
           </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-10 overflow-y-auto">
           
           <div className="prose prose-lg max-w-none text-gray-600 mb-10">
             <p className="leading-relaxed">
               {service.detailedDescription || service.description}
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Features List */}
              <div>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-6 flex items-center gap-2">
                   <Zap size={18} className="text-brand-lime fill-black" /> Key Features
                 </h3>
                 <ul className="space-y-4">
                   {service.features?.map((feature, idx) => (
                     <li key={idx} className="flex items-start gap-3">
                       <CheckCircle size={20} className="text-brand-green flex-shrink-0 mt-0.5" />
                       <span className="text-gray-700 font-medium">{feature}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              {/* Technologies */}
              <div>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-6 flex items-center gap-2">
                   <Code size={18} className="text-blue-500" /> Technologies
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {service.technologies?.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-600">
                        {tech}
                      </span>
                    ))}
                 </div>

                 <div className="mt-8 p-6 bg-brand-lime/10 rounded-2xl border border-brand-lime/20">
                    <h4 className="font-bold text-black mb-1 flex items-center gap-2">
                        <Layers size={18} /> Why Choose Me?
                    </h4>
                    <p className="text-sm text-gray-600">
                        I ensure scalable architecture and clean code, minimizing technical debt for future growth.
                    </p>
                 </div>
              </div>
           </div>

           {/* Footer Action */}
           <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
              <Button onClick={handleGetStarted} className="group gap-2 shadow-xl">
                 Get a Quote for this Service
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>

        </div>

      </div>
    </div>
  );
};

export default ServiceModal;

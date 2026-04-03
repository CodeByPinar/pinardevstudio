import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Layers } from 'lucide-react';
import Button from './ui/Button';
import { ProjectData } from '../types';

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-y-auto overflow-x-hidden animate-fade-in-up scrollbar-hide">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-white/50 backdrop-blur-md hover:bg-white text-black rounded-full transition-all border border-gray-200"
        >
          <X size={24} />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 md:h-[450px] w-full">
           <img 
             src={project.image} 
             alt={project.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
           <div className="absolute bottom-8 left-8 md:left-12 text-white max-w-3xl">
             <span className="inline-block px-3 py-1 border border-white/30 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4">
               {project.category}
             </span>
             <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-2">{project.title}</h2>
           </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
            
            {/* Meta Data Row */}
            <div className="flex flex-wrap gap-8 mb-12 border-b border-gray-100 pb-12">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-full"><User size={20} /></div>
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Musteri</p>
                        <p className="font-semibold text-black">{project.client || 'Gizli'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-full"><Calendar size={20} /></div>
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Yil</p>
                        <p className="font-semibold text-black">{project.year}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-full"><Layers size={20} /></div>
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Rol</p>
                        <p className="font-semibold text-black">{project.role || 'Tasarim ve Gelistirme'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Description & Gallery */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-black">Proje Hakkinda</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {project.description || "Bu proje, dijital donusume butuncul bir yaklasimla ele alindi. Cihazlar arasi tutarli calisan kullanici odakli bir deneyim olusturuldu. Surec, detayli kullanici arastirmasi, wireframe ve yuksek sadakatli prototipleme adimlariyla ilerletildi."}
                        </p>
                        <p className="text-gray-600 leading-relaxed text-lg mt-4">
                          Modern web teknolojileriyle olceklenebilir ve surdurulebilir bir kod tabani kuruldu; performans ve SEO birlikte optimize edildi. Sonuc olarak marka vizyonuyla uyumlu, akici bir dijital deneyim sunuldu.
                        </p>
                    </div>

                    <div>
                         <h3 className="text-2xl font-bold mb-6 text-black">Proje Galerisi</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.gallery && project.gallery.length > 0 ? (
                                project.gallery.map((img, idx) => (
                                  <img key={idx} src={img} alt={`Galeri ${idx}`} className="rounded-xl w-full h-48 object-cover hover:scale-[1.02] transition-transform shadow-sm" />
                                ))
                            ) : (
                                <>
                                    {/* Fallback Mock Gallery */}
                                  <img src="https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=2070&auto=format&fit=crop" className="rounded-xl w-full h-48 object-cover hover:scale-[1.02] transition-transform shadow-sm" alt="Ornek 1" />
                                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" className="rounded-xl w-full h-48 object-cover hover:scale-[1.02] transition-transform shadow-sm" alt="Ornek 2" />
                                </>
                            )}
                         </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="font-bold text-lg mb-4">Teknolojiler</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-brand-lime/10 p-6 rounded-2xl border border-brand-lime/20">
                         <h4 className="font-bold text-lg mb-2">Sonuc</h4>
                         <p className="text-sm text-gray-600">
                           Ilk ay icinde kullanici etkilesimini %40'tan fazla artiran ve hemen cikma oranini ciddi sekilde dusuren yuksek performansli bir cozum teslim edildi.
                         </p>
                    </div>

                    <Button fullWidth className="gap-2 shadow-xl group">
                        Canli Siteyi Gor <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

import React, { useState } from 'react';
import Button from './ui/Button';
import { Send, CheckCircle, ArrowRight } from 'lucide-react';

interface ProposalProps {
  onSendMessage?: (data: any) => void;
}

const Proposal: React.FC<ProposalProps> = ({ onSendMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Full-Stack Geliştirme',
    budget: '$1k - $5k',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    "Full-Stack Geliştirme",
    "Backend Mimarisi",
    "Veri Bilimi ve Yapay Zeka",
    "UI/UX Tasarim",
    "Danismanlik"
  ];

  const budgets = [
    "< $1k",
    "$1k - $5k",
    "$5k - $10k",
    "> $10k"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        if (onSendMessage) {
          onSendMessage(savedMessage);
        }
        setIsSubmitted(true);
      } else {
        alert('Mesaj gönderilemedi.');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Sunucu hatası.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="proposal">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div>
            <span className="text-brand-lime font-bold tracking-wider uppercase text-sm mb-4 inline-block px-3 py-1 bg-black rounded-full">
              Proje Baslat
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-black mb-6 leading-tight">
              Bir fikrin mi var?<br />
              Hayata gecirelim.
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Su anda freelance projeler ve yeni firsatlar icin musaitim.
              Guclu bir backend, modern bir frontend ya da yapay zeka entegrasyonu ihtiyaciniz varsa,
              vizyonunuzu nasil gercege donusturebilecegimizi konusalim.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-brand-lime transition-colors duration-300">
                   <span className="text-lg font-bold">1</span>
                </div>
                <p className="text-lg font-medium text-gray-700">Formu proje detaylarinizla doldurun.</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-brand-lime transition-colors duration-300">
                   <span className="text-lg font-bold">2</span>
                </div>
                <p className="text-lg font-medium text-gray-700">Ihtiyaclarinizi 24 saat icinde inceleyeyim.</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-brand-lime transition-colors duration-300">
                   <span className="text-lg font-bold">3</span>
                </div>
                <p className="text-lg font-medium text-gray-700">Yol haritasini konusmak icin bir gorusme planlayalim.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">E-posta tercih eder misiniz?</p>
                <a href="mailto:contact@pinartechstudio.com" className="text-xl font-bold text-black border-b-2 border-brand-lime hover:bg-brand-lime transition-colors">
                    contact@pinartechstudio.com
                </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 relative">
            
            {isSubmitted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-[2.5rem] z-20 animate-fade-in-up p-8 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">Mesaj Gonderildi!</h3>
                <p className="text-gray-500 text-lg mb-8 max-w-xs mx-auto">
                  Tesekkurler. Projenizi konusmak icin en kisa surede size donecegim.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Yeni Mesaj Gonder
                </Button>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className={`space-y-6 ${isSubmitted ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Adiniz</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-gray-400"
                    placeholder="Ad Soyad"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">E-posta Adresi</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-gray-400"
                    placeholder="ornek@eposta.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ilgilendigim hizmet...</label>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, service: s})}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        formData.service === s 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Bütçe Araligi</label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData({...formData, budget: b})}
                        className={`px-2 py-2 rounded-lg text-sm font-semibold transition-all border text-center ${
                          formData.budget === b 
                          ? 'bg-brand-lime text-black border-black' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Proje Aciklamasi</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-gray-400 resize-none"
                  placeholder="Projeniz, hedefleriniz ve zaman plani hakkinda kisaca bilgi verin..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                disabled={isSubmitting}
                className="group mt-4"
              >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">Gonderiliyor... <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div></span>
                ) : (
                    <span className="flex items-center gap-2">Teklif Gonder <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                )}
              </Button>
              
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proposal;


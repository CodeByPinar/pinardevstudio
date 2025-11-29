
import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      role: "CTO, FinTech Corp",
      text: "Pınar ile çalışmak projemizin kaderini değiştirdi. .NET Core mimarisindeki derin bilgisi sayesinde sistem performansımız %40 arttı.",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Sarah Miller",
      role: "Product Owner, Global AI",
      text: "Veri analitiği ve dashboard projemizde Pınar'ın Python ve React yetenekleri harikaydı. Karmaşık verileri anlaşılır içgörülere dönüştürdü.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Mehmet Demir",
      role: "Kurucu, StartUp Hub",
      text: "Full-stack yetenekleri sayesinde hem backend hem frontend tarafında kusursuz bir iş çıkardı. İletişimi güçlü ve çözüm odaklı.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2 block">Referanslar</span>
          <h2 className="text-4xl font-extrabold text-black">Müşteriler Ne Diyor?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-8 right-8 text-brand-lime w-12 h-12 opacity-50" />
              <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover"/>
                 </div>
                 <div>
                   <h4 className="font-bold text-black">{t.name}</h4>
                   <p className="text-xs text-gray-500 font-semibold uppercase">{t.role}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

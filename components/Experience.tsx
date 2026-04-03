import React from 'react';

const Experience: React.FC = () => {
  const jobs = [
    {
      company: "QMIND SOLUTIONS",
      role: "Veri Bilimci",
      period: "Nis 2021 — Guncel",
      desc: "Makine ogrenmesi ve veri analitigi projelerinde uctan uca veri isleme, model gelistirme ve degerlendirme sureclerini yonettim. Gercek zamanli karar destek sistemleri icin regresyon, siniflandirma ve zaman serisi modelleri gelistirdim. Python, Pandas, NumPy ve Scikit-learn kullanarak optimizasyon yapip gorsellestirme panelleri hazirladim."
    },
    {
      company: "RADICALX",
      role: "Yapay Zeka Stajyeri",
      period: "Agu 2023 — Oca 2024",
      desc: "Yapay zeka modellerini gercek dunya senaryolarinda degerlendirmek icin deneyler tasarlayip uyguladim. Modelleri dogruluk, hiz ve genelleme kapasitesi acisindan test ettim. Veri setlerini analiz ederek on-isleme akislari olusturdum ve TensorFlow/PyTorch ile Ar-Ge calismalarina destek verdim."
    },
    {
      company: "TECHIOSITY TECHNOLOGY",
      role: "Yazilim Gelistirici",
      period: "Sub 2023 — Mar 2023",
      desc: "Java backend modullerine ucuncu taraf API entegrasyonlari yaparak sistem yeteneklerini genislettim. Hata ayiklama, refaktor ve performans iyilestirmeleri gerceklestirdim. Angular UI bilesenlerini gelistirip frontend-backend entegrasyonunu RESTful servisler uzerinden optimize ettim."
    },
    {
      company: "DIGITAL HELP",
      role: "Web Gelistirici",
      period: "Ara 2022 — Sub 2023",
      desc: "HTML, JavaScript, AJAX ve JSON kullanarak mockup'lardan kullanici dostu web arayuzleri gelistirdim. Cok adimli formlar, dinamik icerik yukleme modulleri olusturdum; UI bilesenlerini masaustu ve mobil cihazlar icin optimize ettim."
    }
  ];

  return (
    <section className="py-24 bg-brand-black text-white relative overflow-hidden" id="experience">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-brand-lime font-bold tracking-wider uppercase text-sm mb-2 block">Kariyer Yolu</span>
            <h2 className="text-4xl md:text-5xl font-extrabold">Is Deneyimi</h2>
          </div>
          <div className="w-full md:w-auto">
              <a href="https://www.linkedin.com/in/pinardev/" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 border border-gray-600 rounded-full hover:bg-white hover:text-black transition-colors font-semibold">
                    LinkedIn Profilini Gor
              </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {jobs.map((job, index) => (
            <div key={index} className="group border-b border-gray-800 pb-8 last:border-0 hover:bg-white/5 p-6 -mx-6 rounded-2xl transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                 <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-brand-lime transition-colors">{job.role}</h3>
                    <p className="text-lg text-gray-400 font-medium uppercase tracking-wide">{job.company}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300 whitespace-nowrap">
                        {job.period}
                    </span>
                 </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-3xl">
                  {job.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
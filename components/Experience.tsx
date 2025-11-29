import React from 'react';

const Experience: React.FC = () => {
  const jobs = [
    {
      company: "QMIND SOLUTIONS",
      role: "Data Scientist",
      period: "Apr 2021 — Present",
      desc: "Managed end-to-end data processing, model development, and evaluation for ML/Data Analytics projects. Developed regression, classification, and time-series models for real-time decision support systems. Utilized Python, Pandas, NumPy, and Scikit-learn for optimization and prepared visualization dashboards."
    },
    {
      company: "RADICALX",
      role: "AI Intern",
      period: "Aug 2023 — Jan 2024",
      desc: "Designed and implemented experiments to evaluate AI models in real-world scenarios. Tested models for accuracy, speed, and generalization capability. Analyzed datasets to create pre-processing workflows and supported R&D efforts using TensorFlow/PyTorch."
    },
    {
      company: "TECHIOSITY TECHNOLOGY",
      role: "Software Developer",
      period: "Feb 2023 — Mar 2023",
      desc: "Extended system functionality by integrating third-party APIs into Java backend modules. Performed debugging, refactoring, and performance optimizations. Enhanced Angular UI components and optimized frontend-backend integration via RESTful services."
    },
    {
      company: "DIGITAL HELP",
      role: "Web Developer",
      period: "Dec 2022 — Feb 2023",
      desc: "Developed user-friendly web interfaces from mockups using HTML, JavaScript, AJAX, and JSON. Created multi-step forms, dynamic content loading modules, and optimized UI components for both desktop and mobile devices."
    }
  ];

  return (
    <section className="py-24 bg-brand-black text-white relative overflow-hidden" id="experience">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-brand-lime font-bold tracking-wider uppercase text-sm mb-2 block">Career Path</span>
            <h2 className="text-4xl md:text-5xl font-extrabold">Work Experience</h2>
          </div>
          <div className="w-full md:w-auto">
              <a href="https://www.linkedin.com/in/pinardev/" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 border border-gray-600 rounded-full hover:bg-white hover:text-black transition-colors font-semibold">
                  View LinkedIn Profile
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
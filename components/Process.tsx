import React from 'react';

const Process: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Discovery",
      description: "We start by understanding your goals, audience, and the problem we need to solve together."
    },
    {
      number: "02",
      title: "Strategy",
      description: "Defining the roadmap and technical approach to ensure the project is scalable and effective."
    },
    {
      number: "03",
      title: "Design",
      description: "Crafting visual aesthetics and interactive prototypes that align with your brand identity."
    },
    {
      number: "04",
      title: "Development",
      description: "Bringing the design to life with clean, performant code using modern web technologies."
    }
  ];

  return (
    <section className="py-24 bg-brand-black text-white relative overflow-hidden" id="process">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <span className="text-brand-lime font-bold tracking-wider uppercase text-sm mb-2 block">How I Work</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Simple Process.<br />Powerful Results.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (Desktop only, not on last item) */}
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-[1px] bg-gray-800 -ml-4 z-0"></div>
              )}
              
              <div className="relative z-10 bg-brand-black pb-8 pr-4">
                <div className="w-16 h-16 rounded-full border border-gray-700 bg-brand-black flex items-center justify-center text-xl font-bold text-white mb-6 group-hover:border-brand-lime group-hover:text-brand-lime transition-colors duration-300 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
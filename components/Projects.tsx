
import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { ProjectData } from '../types';

interface ProjectsProps {
    projects: ProjectData[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter(p => p.type === filter);

  const filters = ["All", "Backend", "Frontend", "Data"];

  return (
    <section id="portfolio" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div>
            <h2 className="text-6xl md:text-8xl font-bold text-black tracking-tighter mb-4 leading-[0.9]">
              Selected<br/><span className="text-gray-200">Works</span>
            </h2>
          </div>

          <div className="flex gap-8 border-b border-gray-100 pb-1 overflow-x-auto scrollbar-hide">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-lg font-medium transition-colors relative pb-3 px-1 whitespace-nowrap ${
                  filter === f ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {f}
                {filter === f && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`group cursor-pointer block ${index % 2 === 1 ? 'md:mt-24' : ''} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 aspect-[4/3] mb-8 shadow-sm">
                
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* View Project Button (Centered) */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:scale-105 hover:bg-brand-lime">
                        View Project <ArrowUpRight size={20} />
                    </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-6 group-hover:border-black/20 transition-colors duration-500 px-2">
                <div>
                  <h3 className="text-3xl font-bold text-black mb-3 group-hover:text-brand-green transition-colors tracking-tight">{project.title}</h3>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full group-hover:border-gray-200 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="hidden md:block">
                   <span className="text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1 rounded-full">{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-32 text-center">
             <a href="https://github.com/CodeByPinar" target="_blank" rel="noreferrer" className="group relative inline-flex items-center gap-2 text-xl font-bold text-black overflow-hidden">
               <span className="relative z-10 border-b-2 border-black pb-1 group-hover:text-brand-green group-hover:border-brand-green transition-colors">View All Projects on GitHub</span>
               <ArrowUpRight className="relative z-10 w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
             </a>
        </div>

      </div>

      {/* Project Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};

export default Projects;


import React, { useEffect } from 'react';
import { X, Calendar, Clock, Eye, User } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  
  // SEO & Body Scroll Lock
  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
      // Simulate SEO Title Update
      const prevTitle = document.title;
      document.title = `${post.title} | Pınar Tech Blog`;
      
      return () => {
        document.body.style.overflow = '';
        document.title = prevTitle;
      };
    }
  }, [post]);

  if (!post) return null;

  // Simple pseudo-markdown renderer for better readability
  const renderContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-2xl font-bold text-black mt-8 mb-4">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xl font-bold text-black mt-6 mb-3">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc text-gray-700 mb-2 pl-2">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className="mb-4 text-gray-600 leading-8 text-lg">{line}</p>;
    });
  };

  const author = post.author || {
      name: "Pınar Topuz",
      role: "Full-Stack Developer",
      avatar: "https://ui-avatars.com/api/?name=Pinar+Topuz&background=000&color=fff"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-y-auto scrollbar-hide animate-fade-in-up flex flex-col">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-30 flex justify-between items-center p-6 bg-white/80 backdrop-blur-md border-b border-gray-100">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                    <img src={author.avatar} alt={author.name} className="w-full h-full object-cover"/>
                 </div>
                 <div>
                    <p className="text-sm font-bold text-black">{author.name}</p>
                    <p className="text-xs text-gray-500">{author.role}</p>
                 </div>
             </div>
             <button 
                onClick={onClose}
                className="p-2 bg-gray-100 hover:bg-red-50 text-black hover:text-red-500 rounded-full transition-all"
             >
                <X size={20} />
            </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 md:h-96 w-full flex-shrink-0">
           <img 
             src={post.image} 
             alt={post.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
           
           <div className="absolute bottom-8 left-8 md:left-12 right-8">
              <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-lime text-black text-xs font-bold uppercase rounded-md shadow-sm">
                          {tag}
                      </span>
                  ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                {post.title}
              </h1>
           </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12 max-w-3xl mx-auto w-full">
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400 uppercase tracking-wider mb-10 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Eye size={18} />
                    <span>{post.views ? post.views.toLocaleString() : '1,204'} Views</span>
                </div>
            </div>

            {/* Main Content */}
            <article className="prose prose-lg max-w-none text-gray-700">
                {renderContent(post.content)}
            </article>

            {/* Footer Author Bio */}
            <div className="mt-16 pt-10 border-t-2 border-gray-100">
                <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-6">About the Author</h3>
                <div className="flex items-start gap-6 bg-gray-50 p-6 rounded-2xl">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                        <img src={author.avatar} alt={author.name} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                        <p className="font-bold text-xl text-black mb-1">{author.name}</p>
                        <p className="text-sm text-brand-green font-bold uppercase mb-3">{author.role}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Experienced Full-Stack Developer specializing in .NET and React ecosystems. Passionate about clean architecture, AI integration, and sharing technical knowledge with the community.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;

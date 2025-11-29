
import React, { useState, useMemo } from 'react';
import { Calendar, Clock, ArrowRight, Eye, Hash } from 'lucide-react';
import BlogModal from './BlogModal';
import { BlogPost } from '../types';

interface BlogProps {
  posts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return ["All", ...Array.from(tags)];
  }, [posts]);

  // Filter posts
  const filteredPosts = selectedTag === "All" 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag));

  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden" id="blog">
      {/* Background decoration */}
      <div className="absolute top-20 left-[-100px] w-64 h-64 bg-brand-lime opacity-10 rounded-full blur-[80px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Filter */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <span className="text-brand-green font-bold tracking-wider uppercase text-sm mb-2 block">Insights & Thoughts</span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-black mb-6 tracking-tight">
              Latest Articles
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Technical deep dives into .NET Architecture, React patterns, and the future of AI in software development.
            </p>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 justify-start lg:justify-end max-w-lg">
             {allTags.map(tag => (
               <button
                 key={tag}
                 onClick={() => setSelectedTag(tag)}
                 className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                   selectedTag === tag
                     ? 'bg-black text-white border-black shadow-lg'
                     : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black'
                 }`}
               >
                 {tag}
               </button>
             ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                <p className="text-gray-400 text-lg">No articles found for this category.</p>
                <button 
                    onClick={() => setSelectedTag("All")} 
                    className="mt-4 text-black font-bold underline decoration-brand-lime"
                >
                    View All Posts
                </button>
            </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
             const author = post.author || { name: "Pınar Topuz", avatar: "https://ui-avatars.com/api/?name=Pinar+Topuz&background=000&color=fff" };
             
             return (
                <article 
                  key={post.id} 
                  className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Image */}
                  <div className="h-60 overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {post.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-black shadow-sm flex items-center gap-1">
                            <Hash size={10} className="text-brand-green"/> {tag}
                          </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    
                    {/* Meta Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <Clock size={14} />
                            <span>{post.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-brand-green bg-brand-lime/10 px-2 py-1 rounded-md">
                            <Eye size={12} />
                            <span>{post.views ? post.views.toLocaleString() : '1.2k'}</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-brand-green transition-colors line-clamp-2 leading-tight">
                        {post.title}
                    </h3>
                    
                    <p className="text-gray-500 leading-relaxed mb-8 line-clamp-3 flex-grow text-sm">
                        {post.excerpt}
                    </p>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-3">
                            <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full bg-gray-100 border border-gray-100"/>
                            <span className="text-xs font-bold text-gray-900">{author.name}</span>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-brand-lime group-hover:text-black transition-colors">
                            <ArrowRight size={14} className="group-hover:-rotate-45 transition-transform duration-300"/>
                        </div>
                    </div>
                  </div>
                </article>
             );
          })}
        </div>
      </div>

      <BlogModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </section>
  );
};

export default Blog;

import React, { useState, useMemo } from 'react';
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, Plus, Trash2, Edit2, X, Save, Newspaper, Search, Shield, ShieldAlert, BarChart3, TrendingUp } from 'lucide-react';
import { ProjectData, BlogPost, User } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface Message {
  id: number;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  date: string;
}

interface AdminDashboardProps {
  user: User;
  projects: ProjectData[];
  posts: BlogPost[];
  messages: Message[];
  onUpdateProjects: (projects: ProjectData[]) => void;
  onUpdatePosts: (posts: BlogPost[]) => void;
  onLogout: () => void;
}

// Simple Custom SVG Chart Component
const StatsChart = ({ data }: { data: { month: string, count: string }[] }) => {
  const max = Math.max(...data.map(d => parseInt(d.count)), 10); // Minimum scale of 10
  
  return (
    <div className="w-full h-48 mt-4 relative flex items-end justify-between gap-2 px-2">
      {/* Background Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
        <div className="w-full h-px bg-black"></div>
        <div className="w-full h-px bg-black"></div>
        <div className="w-full h-px bg-black"></div>
        <div className="w-full h-px bg-black"></div>
      </div>
      
      {/* Bars */}
      {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No data yet</div>
      ) : (
          data.map((d, i) => {
            const count = parseInt(d.count);
            const height = Math.max((count / max) * 100, 5); // Min height for visibility
            return (
                <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <div className="w-full bg-brand-lime hover:bg-black transition-colors rounded-t-sm relative" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {count} Views
                    </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{d.month}</span>
                </div>
            );
          })
      )}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, projects, posts, messages, onUpdateProjects, onUpdatePosts, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'blog' | 'messages'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState<'project' | 'post'>('project');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [stats, setStats] = useState<{ monthly: any[], total: number }>({ monthly: [], total: 0 });

  const isAdmin = user.role === 'admin';

  // Fetch Stats
  React.useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Stats fetch error", error);
        }
    };
    fetchStats();
  }, []);

  // --------------------------------------------------------
  // FILTERING
  // --------------------------------------------------------
  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [projects, searchQuery]);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [posts, searchQuery]);

  const filteredMessages = useMemo(() => {
    return messages.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [messages, searchQuery]);


  // --------------------------------------------------------
  // PROJECT ACTIONS
  // --------------------------------------------------------
  const handleDeleteProject = async (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('Delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (response.ok) {
            onUpdateProjects(projects.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const openAddProject = () => {
    if (!isAdmin) return;
    setEditingType('project');
    setFormData({ tags: [], gallery: [] });
    setIsEditing(true);
  };

  const openEditProject = (project: ProjectData) => {
    if (!isAdmin) return;
    setEditingType('project');
    setFormData(project);
    setIsEditing(true);
  };

  // --------------------------------------------------------
  // BLOG ACTIONS
  // --------------------------------------------------------
  const handleDeletePost = async (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('Delete this blog post?')) {
      try {
        const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (response.ok) {
            onUpdatePosts(posts.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const openAddPost = () => {
    if (!isAdmin) return;
    setEditingType('post');
    setFormData({ 
        tags: [], 
        date: new Date().toLocaleDateString(),
        views: 0,
        author: {
            name: user.username,
            role: "Editor",
            avatar: "https://ui-avatars.com/api/?name=Admin&background=000&color=fff"
        }
    });
    setIsEditing(true);
  };

  const openEditPost = (post: BlogPost) => {
    if (!isAdmin) return;
    setEditingType('post');
    setFormData(post);
    setIsEditing(true);
  };

  // --------------------------------------------------------
  // SAVE HANDLER
  // --------------------------------------------------------
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    const data = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formData).forEach(key => {
        if (key === 'tags' && Array.isArray(formData[key])) {
            data.append(key, formData[key].join(', '));
        } else if (key === 'author') {
             data.append('author_name', formData.author.name);
             data.append('author_role', formData.author.role);
             data.append('author_avatar', formData.author.avatar);
        } else if (key !== 'imageFile') { // Skip imageFile, handled separately
             data.append(key, formData[key]);
        }
    });

    // Append file if selected
    if (formData.imageFile) {
        data.append('image', formData.imageFile);
    } else if (formData.image) {
        data.append('image', formData.image); // Keep existing URL if no new file
    }

    try {
        let url = editingType === 'project' ? '/api/projects' : '/api/posts';
        let method = 'POST';

        if (formData.id) {
            url += `/${formData.id}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            body: data // FormData automatically sets Content-Type to multipart/form-data
        });

        if (response.ok) {
            const savedItem = await response.json();
            if (editingType === 'project') {
                if (method === 'PUT') {
                    onUpdateProjects(projects.map(p => p.id === savedItem.id ? savedItem : p));
                } else {
                    onUpdateProjects([savedItem, ...projects]);
                }
            } else {
                if (method === 'PUT') {
                    onUpdatePosts(posts.map(p => p.id === savedItem.id ? savedItem : p));
                } else {
                    onUpdatePosts([savedItem, ...posts]);
                }
            }
            setIsEditing(false);
            setFormData({});
        } else {
            alert('Save failed');
        }
    } catch (error) {
        console.error("Save error", error);
        alert('Save error');
    }
  };

  // Fetch messages from backend on load
  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (response.ok) {
          const data = await response.json();
          // Update parent state via a prop if needed, or handle locally. 
          // Since messages are passed as props, we might need to refactor App.tsx to fetch there, 
          // but for now let's assume we just want to display them here or refresh.
          // Ideally, App.tsx should handle the fetching.
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex-shrink-0 hidden lg:flex flex-col z-20 shadow-sm">
        <div className="h-24 flex items-center px-8">
           <span className="font-extrabold text-2xl tracking-tighter">Pınar.<span className="text-brand-lime">Dash</span></span>
        </div>
        
        <div className="px-6 mb-8">
           <div className={`p-4 rounded-2xl flex items-center gap-3 ${isAdmin ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
              <div className="w-10 h-10 rounded-full bg-brand-lime flex items-center justify-center text-black font-bold">
                 {user.username.charAt(0)}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold truncate">{user.username}</p>
                 <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{user.role}</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 space-y-2 px-4">
           {[
             { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
             { id: 'projects', icon: FolderKanban, label: 'Projects' },
             { id: 'blog', icon: Newspaper, label: 'Blog Posts' },
             { id: 'messages', icon: MessageSquare, label: 'Inbox', badge: messages.length }
           ].map((item) => (
             <button 
               key={item.id}
               onClick={() => { setActiveTab(item.id as any); setSearchQuery(''); }}
               className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl transition-all duration-200 font-bold text-sm ${
                 activeTab === item.id 
                 ? 'bg-gray-900 text-white shadow-lg' 
                 : 'text-gray-500 hover:bg-gray-50 hover:text-black'
               }`}
             >
               <item.icon size={20} className={activeTab === item.id ? 'text-brand-lime' : ''}/> 
               {item.label}
               {item.badge ? (
                 <span className="ml-auto bg-brand-lime text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">{item.badge}</span>
               ) : null}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
           <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm">
             <LogOut size={20} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-gray-50/50">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
             <span className="font-bold text-lg">Pınar.Dash</span>
             <button onClick={onLogout}><LogOut size={20}/></button>
        </div>

        {/* Read Only Banner */}
        {!isAdmin && (
          <div className="bg-yellow-50 border-b border-yellow-100 px-8 py-3 flex items-center justify-center gap-2 text-yellow-700 text-sm font-bold">
            <ShieldAlert size={16} />
            <span>Read-Only Mode Active. You cannot make changes.</span>
          </div>
        )}

        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-10 animate-fade-in-up">
                    <header>
                       <h1 className="text-4xl font-extrabold text-black mb-2">Dashboard Overview</h1>
                       <p className="text-gray-500 font-medium">Welcome back, here's what's happening today.</p>
                    </header>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:-translate-y-1 transition-transform">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand-lime transition-colors"><FolderKanban size={24}/></div>
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                            </div>
                            <h3 className="text-5xl font-black text-black mb-1">{projects.length}</h3>
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Total Projects</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:-translate-y-1 transition-transform">
                             <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand-lime transition-colors"><Newspaper size={24}/></div>
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
                            </div>
                            <h3 className="text-5xl font-black text-black mb-1">{posts.length}</h3>
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Published Articles</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:-translate-y-1 transition-transform">
                             <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand-lime transition-colors"><MessageSquare size={24}/></div>
                            </div>
                            <h3 className="text-5xl font-black text-black mb-1">{messages.length}</h3>
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Total Inquiries</p>
                        </div>
                         <div className="bg-black text-white p-6 rounded-[2rem] shadow-xl flex flex-col justify-center relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime opacity-20 rounded-full blur-3xl"></div>
                             <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-brand-lime">
                                   <Shield size={20} />
                                   <span className="text-xs font-bold uppercase tracking-widest">System Status</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">Operational</h3>
                                <p className="text-gray-400 text-sm">All systems running smoothly.</p>
                             </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                               <h3 className="text-xl font-bold text-black flex items-center gap-2">
                                 <BarChart3 className="text-brand-lime" /> Profile Views
                               </h3>
                               <p className="text-sm text-gray-400 mt-1">Real-time visitor traffic (Total: {stats.total})</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold">
                               <span className="w-3 h-3 rounded-full bg-brand-lime"></span> Organic
                            </div>
                        </div>
                        <StatsChart data={stats.monthly} />
                    </div>
                </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
                <div className="space-y-8 animate-fade-in-up">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h1 className="text-3xl font-extrabold text-black">Projects Management</h1>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <div className="relative flex-1 md:w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="Search projects..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                              />
                           </div>
                           {isAdmin && (
                               <Button onClick={openAddProject} size="sm" className="gap-2 shadow-lg whitespace-nowrap"><Plus size={18}/> Add New</Button>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {filteredProjects.length === 0 && <p className="text-center text-gray-400 py-10">No projects found.</p>}
                        {filteredProjects.map(project => (
                            <div key={project.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                                <img src={project.image} alt={project.title} className="w-full md:w-24 h-48 md:h-24 object-cover rounded-xl bg-gray-100" />
                                <div className="flex-1 text-center md:text-left w-full">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                                       <h3 className="text-lg font-bold text-black">{project.title}</h3>
                                       <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold uppercase tracking-wider rounded text-gray-500">{project.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2 line-clamp-1">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {project.tags.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 border border-gray-200 rounded text-[10px] font-bold text-gray-500">{t}</span>)}
                                    </div>
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-2 w-full md:w-auto justify-center">
                                        <button onClick={() => openEditProject(project)} className="p-2 bg-gray-50 hover:bg-black hover:text-white rounded-lg transition-colors"><Edit2 size={18}/></button>
                                        <button onClick={() => handleDeleteProject(project.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={18}/></button>
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                </div>
            )}

            {/* BLOG TAB */}
            {activeTab === 'blog' && (
                <div className="space-y-8 animate-fade-in-up">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h1 className="text-3xl font-extrabold text-black">Blog Articles</h1>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                           <div className="relative flex-1 md:w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="Search articles..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                              />
                           </div>
                           {isAdmin && (
                               <Button onClick={openAddPost} size="sm" className="gap-2 shadow-lg whitespace-nowrap"><Plus size={18}/> Write Article</Button>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {filteredPosts.length === 0 && <p className="text-center text-gray-400 py-10">No articles found.</p>}
                        {filteredPosts.map(post => (
                            <div key={post.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                                <div className="w-full md:w-24 h-48 md:h-24 relative rounded-xl overflow-hidden flex-shrink-0">
                                   <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-center md:text-left w-full">
                                    <h3 className="text-lg font-bold text-black mb-1">{post.title}</h3>
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-medium text-gray-400 mb-2">
                                       <span>{post.date}</span>
                                       <span>•</span>
                                       <span className="flex items-center gap-1"><TrendingUp size={12}/> {post.views}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-2 w-full md:w-auto justify-center">
                                        <button onClick={() => openEditPost(post)} className="p-2 bg-gray-50 hover:bg-black hover:text-white rounded-lg transition-colors"><Edit2 size={18}/></button>
                                        <button onClick={() => handleDeletePost(post.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={18}/></button>
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-extrabold text-black">Inbox</h1>
                         <div className="relative w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="Search messages..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                              />
                           </div>
                    </div>

                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2rem]">
                            <p className="text-gray-400 text-lg">No messages found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredMessages.map((msg) => (
                                <div key={msg.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-black/20 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b border-gray-100 pb-4 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-brand-lime flex items-center justify-center font-bold text-lg">
                                                {msg.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-black">{msg.name}</h3>
                                                <p className="text-gray-500 text-sm">{msg.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600">{msg.service}</span>
                                            <p className="text-xs text-gray-400 mt-2 font-mono">{msg.date}</p>
                                        </div>
                                    </div>
                                    <div className="pl-0 md:pl-16">
                                         <div className="mb-4">
                                             <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Budget</span>
                                             <p className="font-semibold text-black">{msg.budget}</p>
                                         </div>
                                         <div>
                                             <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Message</span>
                                             <p className="text-gray-700 mt-2 leading-relaxed bg-gray-50 p-4 rounded-xl">{msg.message}</p>
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
      </main>

      {/* EDIT/ADD MODAL (DYNAMIC) */}
      {isEditing && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsEditing(false)}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-8 md:p-10 animate-fade-in-up shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-3xl font-extrabold text-black">
                        {formData.id ? 'Edit' : 'Create New'} {editingType === 'project' ? 'Project' : 'Article'}
                    </h2>
                    <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSave} className="space-y-6">
                    
                    {/* Common Fields */}
                    <div className="space-y-2">
                         <Input 
                            label="Title" 
                            value={formData.title || ''} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            required 
                            className="text-lg font-bold"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Cover Image</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        setFormData({...formData, imageFile: e.target.files[0]});
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-lime file:text-black hover:file:bg-black hover:file:text-white transition-all"
                            />
                        </div>
                        <div className="text-xs text-gray-400 text-center font-bold uppercase my-2">- OR -</div>
                        <Input 
                            label="Image URL" 
                            value={formData.image || ''} 
                            onChange={e => setFormData({...formData, image: e.target.value})} 
                            placeholder="https://..." 
                        />
                         {(formData.image || formData.imageFile) && (
                            <img 
                                src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.image} 
                                className="w-full h-40 object-cover rounded-xl mt-2 border border-gray-200" 
                                alt="Preview"
                            />
                         )}
                    </div>
                    
                    <Input 
                        label="Tags (comma separated)" 
                        value={formData.tags?.join(', ') || ''} 
                        onChange={e => setFormData({...formData, tags: e.target.value.split(',').map((s: string) => s.trim())})} 
                        placeholder="React, AI, Design..."
                    />

                    {/* PROJECT SPECIFIC FIELDS */}
                    {editingType === 'project' && (
                        <>
                             <div className="grid grid-cols-2 gap-6">
                                <Input label="Category" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                                <Input label="Type (Backend/Frontend/Data)" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <Input label="Client" value={formData.client || ''} onChange={e => setFormData({...formData, client: e.target.value})} />
                                <Input label="Role" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
                                <textarea 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black outline-none h-32 resize-none transition-all"
                                    value={formData.description || ''}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                            </div>
                        </>
                    )}

                    {/* BLOG SPECIFIC FIELDS */}
                    {editingType === 'post' && (
                        <>
                             <div className="grid grid-cols-2 gap-6">
                                <Input label="Read Time" value={formData.readTime || ''} onChange={e => setFormData({...formData, readTime: e.target.value})} placeholder="5 min read" />
                                <Input label="Date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Excerpt (Short Summary)</label>
                                <textarea 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black outline-none h-24 resize-none transition-all"
                                    value={formData.excerpt || ''}
                                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Content (Markdown)</label>
                                <div className="text-xs text-gray-400 mb-2 font-mono bg-gray-50 p-2 rounded">Use ## for H3, - for lists</div>
                                <textarea 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black outline-none h-64 font-mono text-sm transition-all"
                                    value={formData.content || ''}
                                    onChange={e => setFormData({...formData, content: e.target.value})}
                                ></textarea>
                            </div>
                        </>
                    )}

                    <div className="pt-6 border-t border-gray-100">
                        <Button type="submit" fullWidth className="gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"><Save size={18}/> Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
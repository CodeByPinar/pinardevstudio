import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Newspaper,
  Search,
  BarChart3,
  TrendingUp,
  Download,
  SlidersHorizontal,
  Sparkles,
  PlugZap,
  BellRing,
  CircleDashed,
  CheckCircle2,
  Layers3,
  Clock3,
  GripVertical,
  RefreshCw
} from 'lucide-react';
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
  status?: 'new' | 'in_progress' | 'responded';
  created_at?: string;
}

type WidgetId = 'insights' | 'shortcuts' | 'serviceHeatmap' | 'activityFeed';

interface AdminDashboardProps {
  user: User;
  projects: ProjectData[];
  posts: BlogPost[];
  messages: Message[];
  onUpdateProjects: (projects: ProjectData[]) => void;
  onUpdatePosts: (posts: BlogPost[]) => void;
  onLogout: () => void;
}

type PluginKey = 'insights' | 'shortcuts' | 'serviceHeatmap' | 'activityFeed';
type PluginState = Record<PluginKey, boolean>;

const defaultPlugins: PluginState = {
  insights: true,
  shortcuts: true,
  serviceHeatmap: true,
  activityFeed: true
};

const downloadCsv = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  };

  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Henüz veri yok</div>
      ) : (
          data.map((d, i) => {
            const count = parseInt(d.count);
            const height = Math.max((count / max) * 100, 5); // Min height for visibility
            return (
                <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <div className="w-full bg-brand-lime hover:bg-black transition-colors rounded-t-sm relative" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {count} görüntülenme
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
  const [projectSort, setProjectSort] = useState<'latest' | 'title' | 'type'>('latest');
  const [postSort, setPostSort] = useState<'latest' | 'title' | 'views'>('latest');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [formData, setFormData] = useState<any>({});
  const [stats, setStats] = useState<{ monthly: any[], total: number }>({ monthly: [], total: 0 });
  const [plugins, setPlugins] = useState<PluginState>(() => {
    try {
      const raw = localStorage.getItem('dashboard_plugins');
      if (!raw) return defaultPlugins;
      return { ...defaultPlugins, ...(JSON.parse(raw) as Partial<PluginState>) };
    } catch {
      return defaultPlugins;
    }
  });
  const [readMessageIds, setReadMessageIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem('read_message_ids');
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });
  const [liveMessages, setLiveMessages] = useState<Message[]>(messages);
  const [syncPulse, setSyncPulse] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(() => {
    try {
      const raw = localStorage.getItem('dashboard_widget_order');
      const parsed = raw ? (JSON.parse(raw) as WidgetId[]) : [];
      const defaults: WidgetId[] = ['insights', 'shortcuts', 'serviceHeatmap', 'activityFeed'];
      const valid = parsed.filter((p) => defaults.includes(p));
      const missing = defaults.filter((d) => !valid.includes(d));
      return [...valid, ...missing];
    } catch {
      return ['insights', 'shortcuts', 'serviceHeatmap', 'activityFeed'];
    }
  });
  const [draggedWidget, setDraggedWidget] = useState<WidgetId | null>(null);
  const [draggedMessageId, setDraggedMessageId] = useState<number | null>(null);

  const isAdmin = user.role === 'admin';

  React.useEffect(() => {
    localStorage.setItem('dashboard_plugins', JSON.stringify(plugins));
  }, [plugins]);

  React.useEffect(() => {
    localStorage.setItem('read_message_ids', JSON.stringify(readMessageIds));
  }, [readMessageIds]);

  React.useEffect(() => {
    localStorage.setItem('dashboard_widget_order', JSON.stringify(widgetOrder));
  }, [widgetOrder]);

  React.useEffect(() => {
    setLiveMessages(messages);
  }, [messages]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAuthFailure = (response: Response) => {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_token');
      onLogout();
      return true;
    }
    return false;
  };

  // Fetch Stats
  React.useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats', {
              headers: getAuthHeaders()
            });
            if (handleAuthFailure(response)) return;
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

  React.useEffect(() => {
    if (!isAdmin) return;

    const poll = async () => {
      try {
        const response = await fetch('/api/messages', {
          headers: getAuthHeaders()
        });

        if (handleAuthFailure(response)) return;
        if (!response.ok) return;

        const data: Message[] = await response.json();
        const previousCount = liveMessages.length;
        setLiveMessages(data);
        setSyncPulse(true);

        if (data.length > previousCount) {
          setNotificationText(`${data.length - previousCount} yeni bildirim alindi`);
          setTimeout(() => setNotificationText(''), 4000);
        }

        setTimeout(() => setSyncPulse(false), 500);
      } catch {
        // polling errors are intentionally silent
      }
    };

    const interval = setInterval(poll, 12000);
    return () => clearInterval(interval);
  }, [isAdmin, liveMessages.length]);

  // --------------------------------------------------------
  // FILTERING
  // --------------------------------------------------------
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return [...filtered].sort((a, b) => {
      if (projectSort === 'title') return a.title.localeCompare(b.title);
      if (projectSort === 'type') return (a.type || '').localeCompare(b.type || '');
      return b.id - a.id;
    });
  }, [projects, searchQuery, projectSort]);

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return [...filtered].sort((a, b) => {
      if (postSort === 'title') return a.title.localeCompare(b.title);
      if (postSort === 'views') return (b.views || 0) - (a.views || 0);
      return b.id - a.id;
    });
  }, [posts, searchQuery, postSort]);

  const filteredMessages = useMemo(() => {
    return liveMessages
      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(m => serviceFilter === 'all' || m.service === serviceFilter)
      .filter(m => {
        if (messageFilter === 'all') return true;
        const isRead = readMessageIds.includes(m.id);
        return messageFilter === 'read' ? isRead : !isRead;
      });
  }, [liveMessages, searchQuery, messageFilter, serviceFilter, readMessageIds]);

  const serviceBreakdown = useMemo(() => {
    return liveMessages.reduce<Record<string, number>>((acc, item) => {
      const key = item.service || 'Bilinmeyen';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [liveMessages]);

  const serviceOptions = useMemo(() => Object.keys(serviceBreakdown).sort(), [serviceBreakdown]);

  const totalPostViews = useMemo(() => posts.reduce((sum, p) => sum + (p.views || 0), 0), [posts]);
  const avgPostViews = posts.length ? Math.round(totalPostViews / posts.length) : 0;
  const unreadCount = useMemo(() => liveMessages.filter((m) => !readMessageIds.includes(m.id)).length, [liveMessages, readMessageIds]);

  const activityFeed = useMemo(() => {
    const items: { id: string; label: string; time: string; type: 'project' | 'post' | 'message' }[] = [];

    projects.slice(0, 4).forEach((p) => {
      items.push({
        id: `project-${p.id}`,
        label: `Yeni/son proje: ${p.title}`,
        time: `${p.year || 'N/A'} yılında güncel`,
        type: 'project'
      });
    });

    posts.slice(0, 4).forEach((p) => {
      items.push({
        id: `post-${p.id}`,
        label: `Blog güncellendi: ${p.title}`,
        time: p.date || 'Tarih yok',
        type: 'post'
      });
    });

    liveMessages.slice(0, 4).forEach((m) => {
      items.push({
        id: `msg-${m.id}`,
        label: `Yeni teklif: ${m.name}`,
        time: m.date || 'Tarih yok',
        type: 'message'
      });
    });

    return items.slice(0, 8);
  }, [projects, posts, liveMessages]);

  const markMessageAsRead = (id: number) => {
    if (readMessageIds.includes(id)) return;
    setReadMessageIds((prev) => [...prev, id]);
  };

  const markAllAsRead = () => {
    const allIds = liveMessages.map((m) => m.id);
    setReadMessageIds(allIds);
  };

  const updateMessageStatus = async (id: number, status: 'new' | 'in_progress' | 'responded') => {
    try {
      const response = await fetch(`/api/messages/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });

      if (handleAuthFailure(response)) return;
      if (!response.ok) return;

      const updated: Message = await response.json();
      setLiveMessages((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
    } catch {
      // ignore transient status update errors
    }
  };

  const handleWidgetDrop = (target: WidgetId) => {
    if (!draggedWidget || draggedWidget === target) return;
    setWidgetOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(draggedWidget);
      const to = next.indexOf(target);
      next.splice(from, 1);
      next.splice(to, 0, draggedWidget);
      return next;
    });
    setDraggedWidget(null);
  };

  const kanbanColumns: Array<{ key: 'new' | 'in_progress' | 'responded'; title: string; tone: string }> = [
    { key: 'new', title: 'Yeni', tone: 'bg-yellow-50 border-yellow-100' },
    { key: 'in_progress', title: 'Yanıtlaniyor', tone: 'bg-blue-50 border-blue-100' },
    { key: 'responded', title: 'Yanıtlandi', tone: 'bg-green-50 border-green-100' }
  ];

  const togglePlugin = (key: PluginKey) => {
    setPlugins((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  // --------------------------------------------------------
  // PROJECT ACTIONS
  // --------------------------------------------------------
  const handleDeleteProject = async (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('Bu projeyi silmek istiyor musunuz?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (handleAuthFailure(response)) return;
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
    if (window.confirm('Bu blog yazısini silmek istiyor musunuz?')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (handleAuthFailure(response)) return;
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
           } else if (key === 'readTime') {
             data.append('read_time', formData[key]);
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
          headers: getAuthHeaders(),
            body: data // FormData automatically sets Content-Type to multipart/form-data
        });
        if (handleAuthFailure(response)) return;

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
            alert('Kaydetme basarisiz');
        }
    } catch (error) {
        console.error("Save error", error);
          alert('Kaydetme hatasi');
    }
  };

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
             { id: 'overview', icon: LayoutDashboard, label: 'Genel Bakis' },
             { id: 'projects', icon: FolderKanban, label: 'Projeler' },
             { id: 'blog', icon: Newspaper, label: 'Blog Yazıları' },
             { id: 'messages', icon: MessageSquare, label: 'Gelen Kutusu', badge: liveMessages.length }
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
             <LogOut size={20} /> Cikis Yap
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-gray-50/50">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
             <span className="font-bold text-lg">Pinar.Dash</span>
             <button onClick={onLogout}><LogOut size={20}/></button>
        </div>

        {/* Read Only Banner */}
        {!isAdmin && (
          <div className="bg-yellow-50 border-b border-yellow-100 px-8 py-3 flex items-center justify-center gap-2 text-yellow-700 text-sm font-bold">
            <ShieldAlert size={16} />
            <span>Salt okunur mod aktif. Degisiklik yapamazsiniz.</span>
          </div>
        )}

        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-10 animate-fade-in-up">
                    <header>
                       <h1 className="text-4xl font-extrabold text-black mb-2">Panel Özeti</h1>
                       <p className="text-gray-500 font-medium">Tekrar hos geldiniz, kontrol sende. Performans ve içerik durumu burada.</p>
                    </header>

                {/* Plugin Switchboard */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                                <h3 className="text-xl font-bold text-black flex items-center gap-2"><PlugZap size={20} className="text-brand-lime" /> Panel Eklentileri</h3>
                      <p className="text-sm text-gray-500 mt-1">Widget'ları aç/kapat, paneli çalışma stiline göre kişiselleştir.</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{Object.values(plugins).filter(Boolean).length} aktif modül</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    {widgetOrder.map((widgetId) => {
                      const plugin = [
                      { key: 'insights' as PluginKey, title: 'Gelişmiş İçgörü', icon: Sparkles },
                      { key: 'shortcuts' as PluginKey, title: 'Hızlı Aksiyonlar', icon: Layers3 },
                      { key: 'serviceHeatmap' as PluginKey, title: 'Servis Isi Haritasi', icon: BarChart3 },
                      { key: 'activityFeed' as PluginKey, title: 'Aktivite Akisi', icon: BellRing }
                      ].find((p) => p.key === widgetId);

                      if (!plugin) return null;

                      return (
                      <button
                        key={plugin.key}
                        draggable
                        onDragStart={() => setDraggedWidget(plugin.key as WidgetId)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleWidgetDrop(plugin.key as WidgetId)}
                        onClick={() => togglePlugin(plugin.key)}
                        className={`p-4 rounded-2xl border text-left transition-all ${plugins[plugin.key] ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-black'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <plugin.icon size={18} className={`${plugins[plugin.key] ? 'text-brand-lime' : 'text-gray-400'} mb-2`} />
                          <GripVertical size={14} className="opacity-60" />
                        </div>
                        <p className="text-sm font-bold">{plugin.title}</p>
                        <p className="text-[11px] opacity-70 mt-1">{plugins[plugin.key] ? 'Aktif' : 'Pasif'}</p>
                      </button>
                    );})}
                  </div>
                </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:-translate-y-1 transition-transform">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand-lime transition-colors"><FolderKanban size={24}/></div>
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                            </div>
                            <h3 className="text-5xl font-black text-black mb-1">{projects.length}</h3>
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Toplam Proje</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:-translate-y-1 transition-transform">
                             <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand-lime transition-colors"><Newspaper size={24}/></div>
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
                            </div>
                            <h3 className="text-5xl font-black text-black mb-1">{posts.length}</h3>
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Yayinlanan Yazı</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:-translate-y-1 transition-transform">
                             <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-brand-lime transition-colors"><MessageSquare size={24}/></div>
                            </div>
                          <h3 className="text-5xl font-black text-black mb-1">{unreadCount}</h3>
                          <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Okunmamış Mesaj</p>
                        </div>
                         <div className="bg-black text-white p-6 rounded-[2rem] shadow-xl flex flex-col justify-center relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime opacity-20 rounded-full blur-3xl"></div>
                             <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-brand-lime">
                                   <Shield size={20} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Sistem Durumu</span>
                                </div>
                                  <h3 className="text-2xl font-bold mb-1">Aktif</h3>
                                  <p className="text-gray-400 text-sm">Tüm sistemler sorunsuz calisiyor.</p>
                             </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                               <h3 className="text-xl font-bold text-black flex items-center gap-2">
                                 <BarChart3 className="text-brand-lime" /> Profil Görüntülenmeleri
                               </h3>
                               <p className="text-sm text-gray-400 mt-1">Gercek zamanli ziyaretci trafigi (Toplam: {stats.total})</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold">
                               <span className="w-3 h-3 rounded-full bg-brand-lime"></span> Organik
                            </div>
                        </div>
                        <StatsChart data={stats.monthly} />
                    </div>

                    {notificationText && (
                      <div className="bg-brand-lime/20 text-black border border-brand-lime rounded-2xl px-4 py-3 text-sm font-bold">
                        {notificationText}
                      </div>
                    )}

                    {plugins.insights && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                          <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Blog Erisimi</p>
                          <h4 className="text-3xl font-black">{totalPostViews}</h4>
                          <p className="text-sm text-gray-500 mt-2">Toplam makale görüntülenmesi</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                          <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Ortalama Görüntüleme</p>
                          <h4 className="text-3xl font-black">{avgPostViews}</h4>
                          <p className="text-sm text-gray-500 mt-2">Makale başına ortalama görüntülenme</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                          <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Gelen Kutusu Durumu</p>
                          <h4 className="text-3xl font-black">{liveMessages.length ? Math.round((unreadCount / liveMessages.length) * 100) : 0}%</h4>
                          <p className="text-sm text-gray-500 mt-2">Henüz yanıt bekleyen mesaj oranı</p>
                        </div>
                      </div>
                    )}

                    {plugins.shortcuts && (
                      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-black flex items-center gap-2"><Sparkles size={20} className="text-brand-lime" /> Hizli Aksiyon Merkezi</h3>
                            <p className="text-sm text-gray-500 mt-1">Tek tikla içerik uret, disa aktarim al, gelen kutusunu temizle.</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <Button onClick={openAddProject} className="gap-2 justify-center" size="sm"><Plus size={16} /> Proje Ekle</Button>
                          <Button onClick={openAddPost} className="gap-2 justify-center" size="sm"><Plus size={16} /> Yazı Ekle</Button>
                          <button
                            onClick={() => downloadCsv('projects.csv', projects.map((p) => ({ id: p.id, title: p.title, category: p.category, year: p.year, type: p.type, tags: p.tags.join('|') })))}
                            className="h-10 rounded-xl border border-gray-200 font-bold text-sm hover:border-black transition-colors flex items-center justify-center gap-2"
                          >
                            <Download size={16} /> Projeler CSV
                          </button>
                          <button
                            onClick={markAllAsRead}
                            className="h-10 rounded-xl border border-gray-200 font-bold text-sm hover:border-black transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={16} /> Tümünü Okundu İşaretle
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {plugins.serviceHeatmap && (
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                          <h3 className="text-xl font-bold text-black mb-5 flex items-center gap-2"><BarChart3 size={20} className="text-brand-lime" /> Servis Talep Isi Haritasi</h3>
                          <div className="space-y-3">
                            {Object.entries(serviceBreakdown).length === 0 && <p className="text-sm text-gray-400">Henüz servis talebi yok.</p>}
                            {Object.entries(serviceBreakdown).map(([service, count]) => {
                              const width = liveMessages.length ? Math.max((count / liveMessages.length) * 100, 8) : 8;
                              return (
                                <div key={service}>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-bold text-gray-700">{service}</span>
                                    <span className="text-gray-500">{count}</span>
                                  </div>
                                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div className="h-full bg-black rounded-full" style={{ width: `${width}%` }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {plugins.activityFeed && (
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                          <h3 className="text-xl font-bold text-black mb-5 flex items-center gap-2"><BellRing size={20} className="text-brand-lime" /> Son Aktivite Akışı</h3>
                          <div className="space-y-3">
                            {activityFeed.length === 0 && <p className="text-sm text-gray-400">Aktivite yok.</p>}
                            {activityFeed.map((item) => (
                              <div key={item.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock3 size={12} /> {item.time}</p>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">{item.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
                <div className="space-y-8 animate-fade-in-up">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h1 className="text-3xl font-extrabold text-black">Proje Yönetimi</h1>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white">
                          <SlidersHorizontal size={16} className="text-gray-400" />
                          <select value={projectSort} onChange={(e) => setProjectSort(e.target.value as 'latest' | 'title' | 'type')} className="text-sm font-semibold bg-transparent outline-none">
                                <option value="latest">En Yeni</option>
                                <option value="title">Başlık A-Z</option>
                                <option value="type">Tur</option>
                          </select>
                        </div>
                           <div className="relative flex-1 md:w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="Proje ara..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                              />
                           </div>
                           {isAdmin && (
                               <Button onClick={openAddProject} size="sm" className="gap-2 shadow-lg whitespace-nowrap"><Plus size={18}/> Yeni Ekle</Button>
                           )}
                           <button
                             onClick={() => downloadCsv('projects.csv', filteredProjects.map((p) => ({ id: p.id, title: p.title, category: p.category, type: p.type, year: p.year, tags: p.tags.join('|') })))}
                             className="h-10 px-4 rounded-xl border border-gray-200 font-bold text-sm hover:border-black transition-colors flex items-center gap-2"
                           >
                             <Download size={16} /> CSV
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {filteredProjects.length === 0 && <p className="text-center text-gray-400 py-10">Proje bulunamadi.</p>}
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
                        <h1 className="text-3xl font-extrabold text-black">Blog Yazıları</h1>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white">
                          <SlidersHorizontal size={16} className="text-gray-400" />
                          <select value={postSort} onChange={(e) => setPostSort(e.target.value as 'latest' | 'title' | 'views')} className="text-sm font-semibold bg-transparent outline-none">
                                <option value="latest">En Yeni</option>
                                <option value="title">Başlık A-Z</option>
                                <option value="views">En Cok Goruntulenen</option>
                          </select>
                        </div>
                           <div className="relative flex-1 md:w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="Yazı ara..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                              />
                           </div>
                           {isAdmin && (
                               <Button onClick={openAddPost} size="sm" className="gap-2 shadow-lg whitespace-nowrap"><Plus size={18}/> Yazı Ekle</Button>
                           )}
                           <button
                             onClick={() => downloadCsv('posts.csv', filteredPosts.map((p) => ({ id: p.id, title: p.title, date: p.date, views: p.views || 0, tags: p.tags.join('|') })))}
                             className="h-10 px-4 rounded-xl border border-gray-200 font-bold text-sm hover:border-black transition-colors flex items-center gap-2"
                           >
                             <Download size={16} /> CSV
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {filteredPosts.length === 0 && <p className="text-center text-gray-400 py-10">Yazı bulunamadi.</p>}
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
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
                        <h1 className="text-3xl font-extrabold text-black">Gelen Kutusu</h1>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                          <RefreshCw size={14} className={syncPulse ? 'animate-spin' : ''} /> canli senkronizasyon
                        </div>
                         <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white">
                               <CircleDashed size={16} className="text-gray-400" />
                               <select value={messageFilter} onChange={(e) => setMessageFilter(e.target.value as 'all' | 'unread' | 'read')} className="text-sm font-semibold bg-transparent outline-none">
                                 <option value="all">Tüm</option>
                                 <option value="unread">Okunmamış</option>
                                 <option value="read">Okunmuş</option>
                               </select>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white">
                               <Layers3 size={16} className="text-gray-400" />
                               <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="text-sm font-semibold bg-transparent outline-none">
                                 <option value="all">Tüm Hizmetler</option>
                                 {serviceOptions.map((service) => (
                                   <option key={service} value={service}>{service}</option>
                                 ))}
                               </select>
                            </div>
                            <button
                              onClick={() => downloadCsv('messages.csv', filteredMessages.map((m) => ({ id: m.id, name: m.name, email: m.email, service: m.service, budget: m.budget, date: m.date })))}
                              className="h-10 px-4 rounded-xl border border-gray-200 font-bold text-sm hover:border-black transition-colors flex items-center gap-2"
                            >
                              <Download size={16} /> CSV
                            </button>
                            <button
                              onClick={markAllAsRead}
                              className="h-10 px-4 rounded-xl border border-gray-200 font-bold text-sm hover:border-black transition-colors flex items-center gap-2"
                            >
                              <CheckCircle2 size={16} /> Tümunu Okundu Yap
                            </button>
                            <div className="relative w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="Mesaj ara..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-black outline-none transition-all"
                              />
                            </div>
                           </div>
                    </div>

                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[2rem]">
                            <p className="text-gray-400 text-lg">Mesaj bulunamadi.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                              {kanbanColumns.map((col) => (
                                <div
                                  key={col.key}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={() => {
                                    if (draggedMessageId) {
                                      updateMessageStatus(draggedMessageId, col.key);
                                      setDraggedMessageId(null);
                                    }
                                  }}
                                  className={`rounded-2xl border p-4 ${col.tone}`}
                                >
                                  <h3 className="text-sm font-extrabold tracking-wide uppercase mb-3">{col.title}</h3>
                                  <div className="space-y-2 min-h-[140px]">
                                    {liveMessages
                                      .filter((m) => (m.status || 'new') === col.key)
                                      .slice(0, 6)
                                      .map((m) => (
                                        <div
                                          key={`kanban-${m.id}`}
                                          draggable
                                          onDragStart={() => setDraggedMessageId(m.id)}
                                          className="bg-white rounded-xl border border-gray-200 p-3 cursor-grab active:cursor-grabbing"
                                        >
                                          <p className="font-bold text-sm text-gray-800 truncate">{m.name}</p>
                                          <p className="text-xs text-gray-500 truncate mt-1">{m.service}</p>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                        <div className="space-y-4">
                            {filteredMessages.map((msg) => (
                                <div key={msg.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-black/20 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b border-gray-100 pb-4 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-brand-lime flex items-center justify-center font-bold text-lg">
                                                {msg.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                  <h3 className="text-xl font-bold text-black">{msg.name}</h3>
                                                  {readMessageIds.includes(msg.id) ? (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> okunmuş</span>
                                                  ) : (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-bold uppercase tracking-wider flex items-center gap-1"><BellRing size={12} /> okunmamış</span>
                                                  )}
                                                </div>
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
                                             <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Bütçe</span>
                                             <p className="font-semibold text-black">{msg.budget}</p>
                                         </div>
                                         <div>
                                             <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Mesaj</span>
                                             <p className="text-gray-700 mt-2 leading-relaxed bg-gray-50 p-4 rounded-xl">{msg.message}</p>
                                         </div>
                                         {!readMessageIds.includes(msg.id) && (
                                           <div className="mt-4">
                                             <button onClick={() => markMessageAsRead(msg.id)} className="h-9 px-4 rounded-lg border border-gray-200 hover:border-black transition-colors text-sm font-bold flex items-center gap-2">
                                               <CheckCircle2 size={14} /> Okundu Olarak İşaretle
                                             </button>
                                           </div>
                                         )}
                                         <div className="mt-4 flex flex-wrap gap-2">
                                           {kanbanColumns.map((col) => (
                                             <button
                                               key={`${msg.id}-${col.key}`}
                                               onClick={() => updateMessageStatus(msg.id, col.key)}
                                               className={`h-8 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${(msg.status || 'new') === col.key ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                                             >
                                               {col.title}
                                             </button>
                                           ))}
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        {formData.id ? 'Duzenle' : 'Yeni Olustur'} {editingType === 'project' ? 'Proje' : 'Yazı'}
                    </h2>
                    <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSave} className="space-y-6">
                    
                    {/* Common Fields */}
                    <div className="space-y-2">
                         <Input 
                           label="Başlık" 
                            value={formData.title || ''} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            required 
                            className="text-lg font-bold"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Kapak Gorseli</label>
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
                        <div className="text-xs text-gray-400 text-center font-bold uppercase my-2">- VEYA -</div>
                        <Input 
                          label="Gorsel URL" 
                            value={formData.image || ''} 
                            onChange={e => setFormData({...formData, image: e.target.value})} 
                            placeholder="https://..." 
                        />
                         {(formData.image || formData.imageFile) && (
                            <img 
                                src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.image} 
                                className="w-full h-40 object-cover rounded-xl mt-2 border border-gray-200" 
                                alt="Onizleme"
                            />
                         )}
                    </div>
                    
                    <Input 
                        label="Etiketler (virgulle ayir)" 
                        value={formData.tags?.join(', ') || ''} 
                        onChange={e => setFormData({...formData, tags: e.target.value.split(',').map((s: string) => s.trim())})} 
                        placeholder="React, AI, Tasarim..."
                    />

                    {/* PROJECT SPECIFIC FIELDS */}
                    {editingType === 'project' && (
                        <>
                            <div className="grid grid-cols-2 gap-6">
                              <Input label="Kategori" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} />
                              <Input label="Tur (Backend/Frontend/Veri)" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <Input label="Müşteri" value={formData.client || ''} onChange={e => setFormData({...formData, client: e.target.value})} />
                                <Input label="Rol" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Aciklama</label>
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
                                <Input label="Okuma Süresi" value={formData.readTime || ''} onChange={e => setFormData({...formData, readTime: e.target.value})} placeholder="5 dk" />
                                <Input label="Tarih" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Özet (Kisa)</label>
                                <textarea 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black outline-none h-24 resize-none transition-all"
                                    value={formData.excerpt || ''}
                                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Tam İçerik (Markdown)</label>
                                <div className="text-xs text-gray-400 mb-2 font-mono bg-gray-50 p-2 rounded">Başlık icin ##, liste icin - kullanin</div>
                                <textarea 
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-black outline-none h-64 font-mono text-sm transition-all"
                                    value={formData.content || ''}
                                    onChange={e => setFormData({...formData, content: e.target.value})}
                                ></textarea>
                            </div>
                        </>
                    )}

                    <div className="pt-6 border-t border-gray-100">
                        <Button type="submit" fullWidth className="gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"><Save size={18}/> Degisiklikleri Kaydet</Button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

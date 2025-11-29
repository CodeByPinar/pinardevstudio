import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

interface AdminLoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Sunucu hatası. Lütfen backend sunucusunun çalıştığından emin olun.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] relative overflow-hidden selection:bg-brand-lime selection:text-black">
        
        {/* Animated Background Orbs - Light Theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-lime/30 rounded-full blur-[100px] animate-float opacity-80 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-brand-green/20 rounded-full blur-[100px] animate-float-delayed opacity-60 mix-blend-multiply"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="w-full max-w-md relative z-10 px-6 perspective-1000">
            <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 ring-1 ring-white/80 relative overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)]">
                
                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col items-center mb-10 relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-brand-lime blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <div className="relative w-20 h-20 bg-black text-brand-lime rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                            <ShieldCheck size={36} strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-lime rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                            <Lock size={14} className="text-black" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-black mt-6 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 font-medium mt-2">Please enter your credentials</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-1">
                        <Input 
                            label="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="admin"
                            className="bg-white/50 border-gray-200 focus:bg-white focus:border-black transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <Input 
                            label="Password" 
                            type="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            className="bg-white/50 border-gray-200 focus:bg-white focus:border-black transition-all"
                        />
                    </div>
                    
                    {error && (
                        <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-sm font-bold rounded-xl flex items-center justify-center gap-2 animate-fade-in-up">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            {error}
                        </div>
                    )}

                    <Button 
                        fullWidth 
                        size="lg" 
                        type="submit" 
                        disabled={isLoading}
                        className={`shadow-lg shadow-brand-lime/20 mt-4 h-14 text-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
                
                <div className="mt-10 text-center relative z-10">
                  <button 
                    onClick={onBack}
                    className="group flex items-center justify-center gap-2 mx-auto text-sm font-bold text-gray-400 hover:text-black transition-colors px-4 py-2 rounded-full hover:bg-gray-100/50"
                  >
                      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                      Back to Portfolio
                  </button>
                </div>
            </div>
            
            {/* Footer Copyright */}
            <div className="text-center mt-8 text-gray-400 text-xs font-medium">
                &copy; {new Date().getFullYear()} Pınar Topuz. All rights reserved.
            </div>
        </div>
    </div>
  );
};

export default AdminLogin;
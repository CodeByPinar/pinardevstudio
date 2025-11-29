
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#portfolio' },
    { name: 'Quote', href: '#proposal' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false); // Close mobile menu if open
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0 flex items-center gap-1 cursor-pointer group">
            <span className="font-bold text-xl tracking-tight group-hover:opacity-80 transition-opacity">Pınar.</span>
            <span className="bg-brand-lime px-2 py-0.5 rounded-full text-xs font-bold border border-black/5 group-hover:scale-105 transition-transform">Tech Studio</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={handleScroll}
                className="text-gray-600 hover:text-black font-medium text-sm transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-brand-lime transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="#portfolio" onClick={handleScroll}>
                <Button variant="white" size="sm" className="border-black hover:bg-black hover:text-white transition-colors">
                View Work
                </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-6 px-6 flex flex-col space-y-6 animate-fade-in-up">
           {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={handleScroll}
                className="text-2xl font-bold text-gray-800 hover:text-brand-lime transition-colors" 
              >
                {link.name}
              </a>
           ))}
            <div className="pt-4">
              <a href="#portfolio" onClick={handleScroll}>
                <Button variant="primary" fullWidth>
                  View Work
                </Button>
              </a>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

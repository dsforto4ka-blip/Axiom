import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Phone, Menu, X, Sparkles, FileSpreadsheet } from 'lucide-react';
import { getAccessToken, initAuth } from '../services/firebaseAuth';
import { getSavedSpreadsheetId } from '../services/googleSheets';

interface HeaderProps {
  onOpenOrderModal: (buildId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrderModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Главная', href: '#hero' },
    { name: 'Услуги & Сборки', href: '#builds' },
    { name: 'Конфигуратор', href: '#configurator' },
    { name: 'О нас & Преимущества', href: '#advantages' },
    { name: 'Этапы работы', href: '#how-it-works' },
    { name: 'Контакты', href: '#contacts' },
  ];

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0B0F1C]/85 backdrop-blur-md border-b border-[#2A7DE1]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <Logo size="md" />

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-[#6FC3FF] transition-colors relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right: Phone & Order Button */}
        <div className="hidden sm:flex items-center gap-4">
          <a 
            href="tel:+79930326681" 
            className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-200 hover:text-[#6FC3FF] transition-colors group"
            id="header-phone-link"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 flex items-center justify-center text-[#6FC3FF] group-hover:scale-110 group-hover:bg-[#2A7DE1]/30 transition-all">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-mono leading-none">Звонок бесплатный</div>
              <span className="font-semibold tracking-wide text-white group-hover:text-[#6FC3FF] transition-colors">
                +7 (993) 032-66-81
              </span>
            </div>
          </a>

          <button
            onClick={() => onOpenOrderModal()}
            id="header-order-btn"
            className="relative group overflow-hidden rounded-xl px-5 py-2.5 bg-gradient-to-r from-[#2A7DE1] to-[#1E60B5] hover:from-[#358BEE] hover:to-[#2A7DE1] text-white text-sm font-semibold shadow-lg shadow-[#2A7DE1]/25 hover:shadow-[#2A7DE1]/50 transition-all duration-300 flex items-center gap-2 border border-[#6FC3FF]/40 active:scale-95 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1.5 font-medium tracking-wide">
              <Sparkles className="w-4 h-4 text-[#6FC3FF] animate-pulse" />
              Заказать ПК
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
          id="mobile-menu-toggle-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F1C]/95 backdrop-blur-xl border-b border-[#2A7DE1]/25 px-4 pt-4 pb-6 mt-3 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-[#2A7DE1]/20 hover:text-[#6FC3FF] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <a 
              href="tel:+79930326681" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200"
            >
              <Phone className="w-4 h-4 text-[#6FC3FF]" />
              <span className="font-semibold text-white">+7 (993) 032-66-81</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-semibold text-center shadow-lg shadow-[#2A7DE1]/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Заказать ПК
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

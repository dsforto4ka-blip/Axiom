import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer id="contacts" className="relative z-10 border-t border-[#2A7DE1]/25 bg-[#080C17]/95 pt-16 pb-12 overflow-hidden">
      
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#2A7DE1]/10 to-transparent blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Slogan (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Студия кастомных персональных компьютеров «ТЕХНОПОТОК». Создаём мощные, тихие и эстетичные рабочие станции и гейминг-сетапы с 2020 года.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {/* Telegram */}
              <a
                href="https://t.me/technopotok_pc"
                target="_blank"
                rel="noreferrer"
                id="social-tg"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#2A7DE1] hover:border-[#6FC3FF] transition-all"
                title="Telegram канал ТЕХНОПОТОК"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                </svg>
              </a>

              {/* VK */}
              <a
                href="https://vk.com/technopotok"
                target="_blank"
                rel="noreferrer"
                id="social-vk"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#2A7DE1] hover:border-[#6FC3FF] transition-all"
                title="Группа ВКонтакте"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.072-1.78.868-2.393 1.932-1.58 1.213.918 1.83 1.944 2.87 2.116.786.131 1.777.016 1.777.016s1.084-.112.571-1.207c-.426-.906-1.956-2.28-2.62-3.003-.564-.614-.408-.885 0-1.542.973-1.564 2.253-3.473 2.502-4.708.132-.656-.207-.864-.817-.864l-2.857.017c-.503 0-.668.277-.8.618-.89 2.302-2.176 4.316-2.927 4.316-.276 0-.404-.124-.404-.814V8.125c0-.687-.202-.996-.78-.996h-3.41c-.432 0-.693.32-.693.626 0 .65.986.8 1.086 2.629v3.974c0 .87-.156 1.028-.501 1.028-.918 0-3.151-3.3-4.475-7.073-.255-.724-.51-1.02-.988-1.02H1.365c-.567 0-.68.266-.68.56 0 .524.67 3.12 3.12 6.55 2.124 2.98 5.11 4.59 7.822 4.59h1.535z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@technopotok"
                target="_blank"
                rel="noreferrer"
                id="social-yt"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600 hover:border-red-400 transition-all"
                title="YouTube канал со сборками и тестами"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Навигация
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#hero" className="hover:text-[#6FC3FF] transition-colors">Главная</a>
              </li>
              <li>
                <a href="#builds" className="hover:text-[#6FC3FF] transition-colors">Готовые сборки</a>
              </li>
              <li>
                <a href="#configurator" className="hover:text-[#6FC3FF] transition-colors">Конфигуратор</a>
              </li>
              <li>
                <a href="#advantages" className="hover:text-[#6FC3FF] transition-colors">Почему мы</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#6FC3FF] transition-colors">Этапы работы</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Builds (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Сборки в наличии
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#builds" className="hover:text-[#6FC3FF] transition-colors flex justify-between">
                  <span>ПК «СТАНДАРТ»</span>
                  <span className="text-[#6FC3FF] font-mono">40 000 ₽</span>
                </a>
              </li>
              <li>
                <a href="#builds" className="hover:text-[#6FC3FF] transition-colors flex justify-between">
                  <span>ПК «ИГРОВОЙ»</span>
                  <span className="text-[#6FC3FF] font-mono">95 000 ₽</span>
                </a>
              </li>
              <li>
                <a href="#builds" className="hover:text-[#6FC3FF] transition-colors flex justify-between">
                  <span>ПК «ПРОФИ» 3D/AI</span>
                  <span className="text-[#6FC3FF] font-mono">140 000 ₽</span>
                </a>
              </li>
              <li>
                <a href="#configurator" className="hover:text-[#6FC3FF] transition-colors flex justify-between text-xs text-slate-500">
                  <span>Индивидуальный кастом</span>
                  <span className="text-slate-400 font-mono">по запросу</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts Required by User (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Прямые контакты
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a 
                  href="tel:+79930326681" 
                  className="flex items-center gap-2.5 hover:text-[#6FC3FF] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 flex items-center justify-center text-[#6FC3FF] group-hover:scale-105">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Телефон / WhatsApp</div>
                    <span className="font-semibold text-white group-hover:text-[#6FC3FF]">+7 (993) 032-66-81</span>
                  </div>
                </a>
              </li>

              <li>
                <a 
                  href="mailto:bigsans.yt@gmail.com" 
                  className="flex items-center gap-2.5 hover:text-[#6FC3FF] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 flex items-center justify-center text-[#6FC3FF] group-hover:scale-105">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Электронная почта</div>
                    <span className="font-mono text-xs text-slate-200 group-hover:text-[#6FC3FF]">bigsans.yt@gmail.com</span>
                  </div>
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-xs text-slate-400 pt-1">
                <Clock className="w-4 h-4 text-[#6FC3FF] shrink-0" />
                <span>Пн-Вс: 10:00 — 21:00 (без выходных)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Note & Discreet Admin Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 ТЕХНОПОТОК. Все права защищены.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Сделано с любовью к железу и высоким FPS</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="opacity-40 hover:opacity-100 text-slate-500 hover:text-[#6FC3FF] transition-all p-1 rounded hover:bg-slate-800/60 flex items-center gap-1 cursor-pointer text-[11px]"
                title="Панель инженера (доступ по паролю)"
              >
                <Lock className="w-3 h-3" />
                <span className="sr-only sm:not-sr-only text-[10px]">Вход</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

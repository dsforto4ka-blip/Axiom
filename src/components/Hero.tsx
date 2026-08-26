import React from 'react';
import { Cpu, Zap, Shield, Sparkles, ArrowRight, Gauge, PlayCircle, Flame, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenOrderModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & Action buttons */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A7DE1]/10 border border-[#6FC3FF]/30 text-xs font-mono text-[#6FC3FF] backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#6FC3FF] animate-ping"></span>
              <span>СБОРКА В ТЕЧЕНИЕ 24–48 ЧАСОВ • ГАРАНТИЯ 3 ГОДА</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] font-tech">
              Собери ПК своей мечты с{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FC3FF] via-[#2A7DE1] to-[#3B82F6] drop-shadow-[0_0_25px_rgba(111,195,255,0.4)]">
                ТЕХНОПОТОК
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Индивидуальные сборки для игр, работы и творчества. Честные цены, надёжные комплектующие, гарантия 3 года.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary Vibrant Button */}
              <button
                onClick={() => onOpenOrderModal()}
                id="hero-assemble-btn"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-bold text-base shadow-[0_0_30px_rgba(42,125,225,0.4)] hover:shadow-[0_0_40px_rgba(111,195,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Cpu className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Собрать ПК</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Secondary Glassmorphism Button */}
              <a
                href="#builds"
                id="hero-explore-builds-btn"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card hover:bg-[#2A7DE1]/20 border border-[#2A7DE1]/40 text-slate-100 font-semibold text-base transition-all duration-300 hover:border-[#6FC3FF] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Посмотреть готовые сборки</span>
                <span className="text-[#6FC3FF] group-hover:translate-y-0.5 transition-transform">↓</span>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 text-[#6FC3FF] font-bold text-xl sm:text-2xl font-tech">
                  <Shield className="w-5 h-5 text-[#2A7DE1]" />
                  3 Года
                </div>
                <span className="text-xs text-slate-400">Полная гарантия</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 text-[#6FC3FF] font-bold text-xl sm:text-2xl font-tech">
                  <Gauge className="w-5 h-5 text-[#2A7DE1]" />
                  24 Часа
                </div>
                <span className="text-xs text-slate-400">Стресс-тесты</span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-1 text-[#6FC3FF] font-bold text-xl sm:text-2xl font-tech">
                  <Zap className="w-5 h-5 text-[#2A7DE1]" />
                  0 ₽
                </div>
                <span className="text-xs text-slate-400">Сборка & BIOS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Futuristic PC Rig Showcase */}
          <div className="lg:col-span-5 relative">
            
            {/* Glowing background halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2A7DE1]/30 to-[#6FC3FF]/20 rounded-3xl blur-2xl transform -rotate-3 scale-95 pointer-events-none"></div>

            {/* Main Cyber Rig Card */}
            <div className="relative glass-card rounded-2xl p-4 sm:p-6 border border-[#6FC3FF]/30 overflow-hidden shadow-2xl">
              
              {/* Top Card Header with live system indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6FC3FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2A7DE1]"></span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-300 tracking-wider uppercase">
                    ТЕХНОПОТОК // RIG X-PRO
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#6FC3FF]/10 text-[#6FC3FF] border border-[#6FC3FF]/20">
                  READY TO PLAY
                </span>
              </div>

              {/* Showcase Image with glass reflection */}
              <div className="relative rounded-xl overflow-hidden group aspect-[4/3] bg-slate-950/70 border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=85"
                  alt="Игровой ПК ТЕХНОПОТОК с водяным охлаждением и RGB"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Tech overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1C] via-transparent to-transparent opacity-80"></div>

                {/* Floating Benchmark Badges on top of image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <div className="bg-[#0B0F1C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2A7DE1]/40 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 leading-none">Cyberpunk 2077</div>
                      <div className="text-xs font-bold text-white font-mono">115+ FPS (2K RT)</div>
                    </div>
                  </div>

                  <div className="bg-[#0B0F1C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#6FC3FF]/40 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#6FC3FF]" />
                    <div>
                      <div className="text-[10px] text-slate-400 leading-none">Температура</div>
                      <div className="text-xs font-bold text-[#6FC3FF] font-mono">62°C Peak</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Specs Ticker */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Процессор:</span>
                  <span className="font-semibold text-white">AMD Ryzen 7 5700X / 4.6 GHz</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Видеокарта:</span>
                  <span className="font-semibold text-[#6FC3FF]">RTX 4070 12GB DLSS 3.5</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Охлаждение:</span>
                  <span className="font-semibold text-white">ARGB СЖО 240mm (Silent)</span>
                </div>
              </div>

              {/* Quick Action in showcase card */}
              <button
                onClick={() => onOpenOrderModal('profi')}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#2A7DE1]/20 hover:bg-[#2A7DE1]/40 border border-[#2A7DE1]/50 hover:border-[#6FC3FF] text-[#6FC3FF] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Рассчитать похожую сборку
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

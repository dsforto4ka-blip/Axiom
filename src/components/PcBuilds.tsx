import React, { useState } from 'react';
import { PC_BUILDS } from '../data/builds';
import { PcBuild } from '../types';
import { Cpu, HardDrive, MemoryStick as Ram, Disc, Check, Flame, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

interface PcBuildsProps {
  onSelectBuild: (build: PcBuild) => void;
}

export const PcBuilds: React.FC<PcBuildsProps> = ({ onSelectBuild }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'office' | 'gaming' | 'pro'>('all');

  const filteredBuilds = activeCategory === 'all' 
    ? PC_BUILDS 
    : PC_BUILDS.filter(b => b.category === activeCategory);

  return (
    <section id="builds" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 text-xs font-mono text-[#6FC3FF]">
              <span>КАТАЛОГ СБОРОК</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-tech tracking-tight">
              Готовые конфигурации{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FC3FF] to-[#2A7DE1]">
                ПК
              </span>
            </h2>
            <p className="text-slate-300 text-base max-w-xl">
              Сбалансированные протестированные решения под разный бюджет. Готовы к отправке или кастомизации под ваш запрос.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            {[
              { id: 'all', label: 'Все сборки' },
              { id: 'office', label: 'Офис / Учеба' },
              { id: 'gaming', label: 'Гейминг' },
              { id: 'pro', label: '3D / Монтаж / AI' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white shadow-md shadow-[#2A7DE1]/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Main PC Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredBuilds.map((build) => (
            <div
              key={build.id}
              className={`glass-card rounded-2xl flex flex-col justify-between overflow-hidden relative group transition-all duration-300 ${
                build.popular
                  ? 'border-[#6FC3FF]/60 shadow-[0_0_35px_rgba(42,125,225,0.25)] ring-1 ring-[#6FC3FF]/40'
                  : 'border-[#2A7DE1]/25 hover:border-[#6FC3FF]/40'
              }`}
              id={`pc-build-card-${build.id}`}
            >
              {/* Popular Flag */}
              {build.popular && (
                <div className="absolute top-0 right-0 z-20">
                  <div className="bg-gradient-to-l from-[#6FC3FF] to-[#2A7DE1] text-slate-950 font-extrabold text-[11px] uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-lg flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-slate-950" />
                    {build.badge}
                  </div>
                </div>
              )}

              {/* Card Image Area with Overlay and Category Badge */}
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={build.image}
                    alt={`ПК ТЕХНОПОТОК ${build.name}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>

                  {/* Left Badge */}
                  {!build.popular && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#0B0F1C]/80 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-mono px-3 py-1 rounded-lg">
                        {build.badge}
                      </span>
                    </div>
                  )}

                  {/* Build Title & Tagline overlayed */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-2xl font-black text-white font-tech tracking-wide flex items-center gap-2">
                      «{build.name}»
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-6">
                  <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                    {build.tagline}
                  </p>

                  {/* Key Hardware Specs */}
                  <div className="space-y-2.5 bg-[#0B0F1C]/70 rounded-xl p-4 border border-slate-800/80">
                    <div className="flex items-start gap-2.5 text-xs">
                      <Cpu className="w-4 h-4 text-[#6FC3FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[11px]">Процессор</span>
                        <span className="text-slate-100 font-medium">{build.specs.cpu}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs">
                      <Disc className="w-4 h-4 text-[#2A7DE1] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[11px]">Видеокарта</span>
                        <span className="text-[#6FC3FF] font-semibold">{build.specs.gpu}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs">
                      <Ram className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[11px]">Оперативная память</span>
                        <span className="text-slate-100 font-medium">{build.specs.ram}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs">
                      <HardDrive className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 block text-[11px]">Накопитель</span>
                        <span className="text-slate-100 font-medium">{build.specs.storage}</span>
                      </div>
                    </div>
                  </div>

                  {/* FPS Highlights Preview */}
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      Производительность:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {build.fpsHighlights.map((fps, i) => (
                        <div key={i} className="bg-slate-900/90 rounded-lg p-2 text-center border border-slate-800">
                          <div className="text-[10px] text-slate-400 truncate">{fps.game}</div>
                          <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{fps.fps}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Order Action in Footer */}
              <div className="p-6 pt-0 mt-auto">
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-mono">Цена под ключ:</div>
                    <div className="text-2xl sm:text-3xl font-black text-white font-tech text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#6FC3FF]">
                      {build.formattedPrice}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectBuild(build)}
                    id={`order-build-btn-${build.id}`}
                    className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg ${
                      build.popular
                        ? 'bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white hover:shadow-[#6FC3FF]/40 hover:scale-105 active:scale-95'
                        : 'bg-slate-800 hover:bg-[#2A7DE1] text-white hover:shadow-[#2A7DE1]/40 active:scale-95 border border-slate-700 hover:border-[#6FC3FF]'
                    }`}
                  >
                    <span>Заказать сборку</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6FC3FF]" /> Гарантия 3 года
                  </span>
                  <span className="text-[#6FC3FF]">Тест 24ч включен</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

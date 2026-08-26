import React from 'react';
import { ADVANTAGES } from '../data/builds';
import { Wrench, Zap, Rocket, Package, Check, Sparkles } from 'lucide-react';

interface AdvantagesProps {
  onOpenOrderModal: () => void;
}

export const Advantages: React.FC<AdvantagesProps> = ({ onOpenOrderModal }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Wrench':
        return <Wrench className="w-7 h-7 text-[#6FC3FF]" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-amber-400" />;
      case 'Rocket':
        return <Rocket className="w-7 h-7 text-[#6FC3FF]" />;
      case 'Package':
        return <Package className="w-7 h-7 text-emerald-400" />;
      default:
        return <Sparkles className="w-7 h-7 text-[#6FC3FF]" />;
    }
  };

  return (
    <section id="advantages" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 text-xs font-mono text-[#6FC3FF]">
            <span>ПРЕИМУЩЕСТВА СТУДИИ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-tech tracking-tight">
            Почему выбирают{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FC3FF] to-[#2A7DE1]">
              ТЕХНОПОТОК
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Мы не просто соединяем платы — мы создаём эталонные компьютерные системы с вниманием к каждой детали и термодинамике.
          </p>
        </div>

        {/* 4 Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((adv, idx) => (
            <div
              key={adv.id}
              className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group"
              id={`advantage-card-${adv.id}`}
            >
              {/* Subtle top-right accent glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#2A7DE1]/20 to-transparent rounded-bl-full pointer-events-none group-hover:from-[#6FC3FF]/30 transition-all duration-300"></div>

              <div className="space-y-4 relative z-10">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-xl bg-[#0B0F1C] border border-[#2A7DE1]/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-[#6FC3FF] transition-all duration-300">
                  {getIcon(adv.iconName)}
                </div>

                {/* Badge */}
                <div className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#6FC3FF] bg-[#2A7DE1]/15 px-2.5 py-0.5 rounded border border-[#2A7DE1]/30">
                  {adv.highlight}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white font-tech group-hover:text-[#6FC3FF] transition-colors">
                  {adv.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {adv.description}
                </p>
              </div>

              {/* Bottom Feature Checkmarks */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-[#6FC3FF] shrink-0" />
                <span>Гарантия качества ТЕХНОПОТОК</span>
              </div>
            </div>
          ))}
        </div>

        {/* Banner with extra confidence */}
        <div className="mt-12 glass-card rounded-2xl p-6 sm:p-8 border border-[#2A7DE1]/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#0F172A] via-[#111C38] to-[#0F172A]">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold text-white font-tech flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#6FC3FF]" />
              Есть свои комплектующие или нестандартный проект?
            </h4>
            <p className="text-sm text-slate-300 max-w-2xl">
              Соберём систему из ваших деталей, выполним профессиональный кастомный кабель-менеджмент, установим кастомную СЖО или сделаем апгрейд текущего ПК.
            </p>
          </div>
          <button
            onClick={() => onOpenOrderModal()}
            className="shrink-0 px-6 py-3 rounded-xl bg-[#2A7DE1] hover:bg-[#3B82F6] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#2A7DE1]/30 hover:shadow-[#2A7DE1]/50 cursor-pointer"
          >
            Получить консультацию
          </button>
        </div>

      </div>
    </section>
  );
};

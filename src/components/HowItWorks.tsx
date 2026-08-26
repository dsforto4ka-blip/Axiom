import React from 'react';
import { WORK_STEPS } from '../data/builds';
import { FileText, Sliders, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenOrderModal: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOrderModal }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-6 h-6 text-[#6FC3FF]" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-[#2A7DE1]" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-[#6FC3FF]" />;
      default:
        return <CheckCircle2 className="w-6 h-6 text-[#6FC3FF]" />;
    }
  };

  return (
    <section id="how-it-works" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 text-xs font-mono text-[#6FC3FF]">
            <span>ПРОЗРАЧНЫЙ ПРОЦЕСС</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-tech tracking-tight">
            Как мы{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FC3FF] to-[#2A7DE1]">
              работаем
            </span>
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Всего 4 простых и прозрачных шага от вашей идеи до мощного и готового к бою компьютера.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-[#2A7DE1]/20 via-[#6FC3FF]/40 to-[#2A7DE1]/20 -translate-y-6 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {WORK_STEPS.map((step) => (
              <div
                key={step.step}
                className="glass-card glass-card-hover rounded-2xl p-6 relative flex flex-col justify-between group"
                id={`work-step-${step.step}`}
              >
                <div>
                  {/* Top Bar with Number Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-[#2A7DE1]/40 flex items-center justify-center shadow-lg group-hover:border-[#6FC3FF] group-hover:scale-105 transition-all">
                      {getStepIcon(step.iconName)}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2A7DE1] to-[#6FC3FF] text-slate-950 font-black text-lg flex items-center justify-center font-tech shadow-md shadow-[#2A7DE1]/40 group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg font-bold text-white font-tech mb-2 group-hover:text-[#6FC3FF] transition-colors">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>ЭТАП 0{step.step} / 04</span>
                  <span className="text-[#6FC3FF]">ТЕХНОПОТОК</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onOpenOrderModal()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-bold text-sm shadow-xl shadow-[#2A7DE1]/30 hover:shadow-[#6FC3FF]/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>Начать с 1-го шага: Оставить заявку</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

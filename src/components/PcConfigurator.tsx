import React, { useState } from 'react';
import { Cpu, HardDrive, Disc, MemoryStick, Sparkles, Check, ArrowRight, Gauge, Sliders, Shield } from 'lucide-react';

interface PcConfiguratorProps {
  onOpenCustomOrder: (configDetails: string) => void;
}

export const PcConfigurator: React.FC<PcConfiguratorProps> = ({ onOpenCustomOrder }) => {
  const [selectedBudget, setSelectedBudget] = useState<number>(95000);
  const [selectedUsage, setSelectedUsage] = useState<string>('gaming');
  const [selectedResolution, setSelectedResolution] = useState<string>('2k');
  const [needRgb, setNeedRgb] = useState<boolean>(true);
  const [needWaterCooling, setNeedWaterCooling] = useState<boolean>(false);

  // Dynamic calculation of components based on budget and tasks
  const getConfigRecommendation = () => {
    if (selectedBudget < 60000) {
      return {
        tier: 'Базовый гейминг / Работа',
        cpu: 'AMD Ryzen 5 3600 / Intel Core i3-12100F',
        gpu: 'NVIDIA GTX 1660 Super 6GB / RX 6600 8GB',
        ram: '16GB DDR4 3200MHz',
        ssd: '512GB NVMe M.2 (2400 MB/s)',
        power: '550W 80+ Bronze',
        case: 'AeroCool / DeepCool Mesh (3x вентилятора)',
        estimatedFps: 'CS2: 180+ FPS | GTA V: 90 FPS | Dota 2: 170 FPS',
        deliveryDays: '1-2 дня',
      };
    } else if (selectedBudget <= 120000) {
      return {
        tier: 'Оптимальный гейминг 2K / Стриминг',
        cpu: 'AMD Ryzen 5 5600 / Intel Core i5-12400F',
        gpu: 'NVIDIA RTX 3060 Ti 8GB / RTX 4060 8GB DLSS 3',
        ram: '32GB (2x16GB) DDR4 3600MHz Kingston Fury',
        ssd: '1TB M.2 PCIe 4.0 (3500 MB/s)',
        power: '650W DeepCool 80+ Gold',
        case: 'Montech Air 100 ARGB с закаленным стеклом',
        estimatedFps: 'Cyberpunk 2077 (2K): 75+ FPS | Warzone: 120 FPS',
        deliveryDays: '1-2 дня',
      };
    } else if (selectedBudget <= 180000) {
      return {
        tier: 'Ультра гейминг / 3D & 4K Монтаж',
        cpu: 'AMD Ryzen 7 5700X3D / Intel Core i5-14600KF',
        gpu: 'NVIDIA RTX 4070 Super 12GB / RTX 4070 Ti',
        ram: '32GB DDR5 6000MHz / 64GB DDR4',
        ssd: '2TB Samsung 980 Pro PCIe 4.0 (7000 MB/s)',
        power: '750W-850W Gold Modular',
        case: 'Lian Li Lancool III / DeepCool Morpheus',
        estimatedFps: 'Cyberpunk (4K DLSS): 85+ FPS | Blender: Ultra Fast',
        deliveryDays: '2-3 дня',
      };
    } else {
      return {
        tier: 'Экстремальный флагман / AI / Heavy 3D',
        cpu: 'AMD Ryzen 7 7800X3D / Intel Core i7-14700K',
        gpu: 'NVIDIA GeForce RTX 4080 Super 16GB / RTX 4090 24GB',
        ram: '64GB DDR5 6400MHz RGB CL30',
        ssd: '4TB NVMe PCIe 4.0 + СЖО 360mm LCD Display',
        power: '1000W 80+ Platinum ATX 3.0',
        case: 'Lian Li O11 Dynamic EVO / NZXT H9 Flow',
        estimatedFps: 'Все игры в 4K Ultra на 140+ FPS | Любой рендеринг',
        deliveryDays: '2-3 дня',
      };
    }
  };

  const currentConfig = getConfigRecommendation();

  const handleApplyConfig = () => {
    const summary = `Конфигуратор: Бюджет ${selectedBudget.toLocaleString('ru-RU')} ₽, Задачи: ${selectedUsage}, Разрешение: ${selectedResolution}, RGB: ${needRgb ? 'Да' : 'Нет'}, СЖО: ${needWaterCooling ? 'Да' : 'Нет'}`;
    onOpenCustomOrder(summary);
  };

  return (
    <section id="configurator" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 text-xs font-mono text-[#6FC3FF]">
            <Sliders className="w-3.5 h-3.5" />
            <span>ИНТЕРАКТИВНЫЙ ПОДБОР</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-tech tracking-tight">
            Калькулятор конфигурации под ваш бюджет
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Двигайте ползунок бюджета и выбирайте сценарии использования — система моментально подберёт идеальный сетап.
          </p>
        </div>

        {/* Configurator Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#2A7DE1]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 1. Budget Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <span>1. Планируемый бюджет:</span>
                  </label>
                  <span className="text-2xl font-black font-tech text-[#6FC3FF] bg-slate-900/80 px-4 py-1.5 rounded-xl border border-[#2A7DE1]/40">
                    {selectedBudget.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <input
                  type="range"
                  min="40000"
                  max="300000"
                  step="5000"
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#6FC3FF] focus:outline-none"
                />

                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>40 000 ₽ (Базовый)</span>
                  <span>140 000 ₽ (Профи)</span>
                  <span>300 000+ ₽ (Экстрим)</span>
                </div>
              </div>

              {/* 2. Usage Purpose */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 block">
                  2. Основная цель использования:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'gaming', label: '🎮 Игры / Гейминг' },
                    { id: '3d_video', label: '🎬 3D & Видео 4K' },
                    { id: 'stream_ai', label: '🧠 AI / Стриминг' },
                    { id: 'work_study', label: '💼 Офис / Учеба' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedUsage(item.id)}
                      className={`p-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                        selectedUsage === item.id
                          ? 'bg-[#2A7DE1] border-[#6FC3FF] text-white shadow-md shadow-[#2A7DE1]/40'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Resolution & Extra preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Целевое разрешение монитора:
                  </label>
                  <div className="flex gap-2">
                    {['Full HD (1080p)', '2K (1440p)', '4K Ultra'].map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setSelectedResolution(res)}
                        className={`flex-1 py-2 px-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedResolution === res
                            ? 'bg-[#2A7DE1]/30 border-[#6FC3FF] text-[#6FC3FF]'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Дополнительные опции:
                  </label>
                  <div className="flex gap-4 items-center pt-1.5">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={needRgb}
                        onChange={(e) => setNeedRgb(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-[#2A7DE1] focus:ring-0 cursor-pointer"
                      />
                      <span>ARGB подсветка</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={needWaterCooling}
                        onChange={(e) => setNeedWaterCooling(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-[#2A7DE1] focus:ring-0 cursor-pointer"
                      />
                      <span>СЖО (Водяное охл.)</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Live Spec Summary (5 cols) */}
            <div className="lg:col-span-5 bg-[#0B0F1C]/90 rounded-2xl p-6 border border-[#6FC3FF]/30 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
              
              {/* Background gradient flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2A7DE1]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#6FC3FF] tracking-wider block">РЕКОМЕНДАЦИЯ СИСТЕМЫ</span>
                    <h3 className="text-lg font-bold text-white font-tech">{currentConfig.tier}</h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#2A7DE1]/20 border border-[#6FC3FF]/40 flex items-center justify-center text-[#6FC3FF]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <Cpu className="w-4 h-4 text-[#6FC3FF] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400">CPU</div>
                      <div className="font-semibold text-slate-100">{currentConfig.cpu}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <Disc className="w-4 h-4 text-[#2A7DE1] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400">GPU (Видеокарта)</div>
                      <div className="font-semibold text-[#6FC3FF]">{currentConfig.gpu}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <MemoryStick className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-400">RAM & Накопитель</div>
                      <div className="font-semibold text-slate-100">{currentConfig.ram} + {currentConfig.ssd}</div>
                    </div>
                  </div>
                </div>

                {/* Benchmark FPS */}
                <div className="p-3 rounded-xl bg-[#2A7DE1]/10 border border-[#2A7DE1]/30 text-xs">
                  <div className="flex items-center gap-1.5 text-[#6FC3FF] font-semibold mb-1">
                    <Gauge className="w-3.5 h-3.5" />
                    Ориентировочный FPS:
                  </div>
                  <div className="text-slate-300 font-mono text-[11px]">{currentConfig.estimatedFps}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-3 pt-2 relative z-10">
                <button
                  onClick={handleApplyConfig}
                  id="configurator-order-btn"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-bold text-sm shadow-lg shadow-[#2A7DE1]/40 hover:shadow-[#6FC3FF]/60 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Заказать с этими параметрами</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#6FC3FF]" /> Сборка 0 ₽
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#6FC3FF]" /> Гарантия 3 года
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

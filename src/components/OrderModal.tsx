import React, { useState, useEffect } from 'react';
import { X, Cpu, Send, ShieldCheck, User, Phone, Wallet, Target, Sparkles, AlertCircle, FileSpreadsheet, Check } from 'lucide-react';
import { OrderFormData, PcBuild } from '../types';
import { appendOrderToSheet } from '../services/googleSheets';
import { getAccessToken } from '../services/firebaseAuth';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: OrderFormData, sheetUrl?: string) => void;
  initialBuild?: PcBuild | null;
  customDetails?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialBuild,
  customDetails,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    budget: '50-100k',
    purpose: '',
    needAssemblyHelp: true,
    preferredBuild: '',
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    if (initialBuild) {
      setFormData((prev) => ({
        ...prev,
        preferredBuild: initialBuild.name,
        purpose: `Готовая сборка «${initialBuild.name}» (${initialBuild.formattedPrice}): ${initialBuild.specs.cpu}, ${initialBuild.specs.gpu}`,
        budget: initialBuild.price <= 50000 ? 'under-50k' : initialBuild.price <= 100000 ? '50-100k' : initialBuild.price <= 200000 ? '100-200k' : 'over-200k',
      }));
    } else if (customDetails) {
      setFormData((prev) => ({
        ...prev,
        purpose: customDetails,
        preferredBuild: 'Индивидуальная конфигурация',
      }));
    }
  }, [initialBuild, customDetails, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Пожалуйста, введите имя';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Введите корректный номер телефона';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let sheetUrl: string | undefined;

    try {
      setSyncStatus('Запись заявки в Google Таблицу...');
      const res = await appendOrderToSheet(formData);
      sheetUrl = res.spreadsheetUrl;
    } catch (sheetErr: any) {
      console.warn('Sheets sync note:', sheetErr.message);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSyncStatus(null);
      onSuccess(formData, sheetUrl);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[#6FC3FF]/40 shadow-2xl space-y-6 my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A7DE1]/20 border border-[#6FC3FF]/30 text-xs font-mono text-[#6FC3FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>БЫСТРЫЙ ЗАКАЗ ПК</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-tech pt-1">
            {initialBuild ? `Заказ сборки «${initialBuild.name}»` : 'Заявка на сборку ПК'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Оставьте контакты, и мы свяжемся в течение 10 минут. Данные запишутся в Google Таблицу.
          </p>
        </div>

        {/* Selected build highlight banner */}
        {initialBuild && (
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-[#2A7DE1]/40 flex items-center gap-4">
            <img
              src={initialBuild.image}
              alt={initialBuild.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#6FC3FF] uppercase">{initialBuild.badge}</div>
              <div className="text-base font-bold text-white font-tech">«{initialBuild.name}»</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">{initialBuild.formattedPrice}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#6FC3FF]" />
              Ваше имя <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Константин"
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.name ? 'border-red-500' : 'border-slate-700 focus:border-[#6FC3FF]'
              } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#2A7DE1]`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#6FC3FF]" />
              Номер телефона <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              placeholder="+7 (999) 000-00-00"
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.phone ? 'border-red-500' : 'border-slate-700 focus:border-[#6FC3FF]'
              } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#2A7DE1]`}
            />
            {errors.phone && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">{errors.phone}</p>
            )}
          </div>

          {/* Budget */}
          {!initialBuild && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#6FC3FF]" />
                Бюджет
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-[#6FC3FF] focus:outline-none cursor-pointer"
              >
                <option value="under-50k">До 50 000 ₽</option>
                <option value="50-100k">50 000 – 100 000 ₽</option>
                <option value="100-200k">100 000 – 200 000 ₽</option>
                <option value="over-200k">От 200 000 ₽</option>
              </select>
            </div>
          )}

          {/* Purpose / Comments */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#6FC3FF]" />
              Комментарий / Задачи
            </label>
            <textarea
              rows={2}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Дополнительные пожелания (корпус, объем SSD, видеокарта)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-[#6FC3FF] focus:outline-none resize-none"
            />
          </div>

          {/* Assembly help checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.needAssemblyHelp}
              onChange={(e) => setFormData({ ...formData, needAssemblyHelp: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-[#2A7DE1] cursor-pointer"
            />
            <span>Нужна бесплатная сборка и стресс-тестирование 24ч</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-bold text-sm shadow-xl shadow-[#2A7DE1]/30 hover:shadow-[#6FC3FF]/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{syncStatus || 'Отправка...'}</span>
              </div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Отправить заявку</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1 text-[#6FC3FF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Прямая связь со старшим инженером</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <span>Гарантия 3 года</span>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { OrderFormData } from '../types';
import { Send, User, Phone, Wallet, Target, CheckSquare, ShieldCheck, Sparkles, AlertCircle, FileSpreadsheet, Check } from 'lucide-react';
import { appendOrderToSheet, getSavedSpreadsheetId } from '../services/googleSheets';
import { getAccessToken, initAuth } from '../services/firebaseAuth';

interface OrderFormProps {
  onSuccess: (data: OrderFormData, sheetUrl?: string) => void;
  initialBudget?: string;
  initialPurpose?: string;
  initialBuild?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSuccess,
  initialBudget = '50-100k',
  initialPurpose = '',
  initialBuild = '',
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    budget: initialBudget,
    purpose: initialPurpose || (initialBuild ? `Заказ сборки: ${initialBuild}` : ''),
    needAssemblyHelp: true,
    preferredBuild: initialBuild,
  });

  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = initAuth(
      () => setHasGoogleAuth(true),
      () => setHasGoogleAuth(false)
    );
    return () => unsub();
  }, []);

  const budgetOptions = [
    { value: 'under-50k', label: 'До 50 000 ₽' },
    { value: '50-100k', label: '50 000 – 100 000 ₽' },
    { value: '100-200k', label: '100 000 – 200 000 ₽' },
    { value: 'over-200k', label: 'От 200 000 ₽' },
  ];

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
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
      // Reset form
      setFormData({
        name: '',
        phone: '',
        budget: '50-100k',
        purpose: '',
        needAssemblyHelp: true,
        preferredBuild: '',
      });
    }, 500);
  };

  return (
    <section id="order-form-section" className="py-20 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glowing aura around card */}
        <div className="relative glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#6FC3FF]/40 shadow-[0_0_50px_rgba(42,125,225,0.2)] overflow-hidden">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A7DE1] via-[#6FC3FF] to-[#2A7DE1]"></div>

          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A7DE1]/15 border border-[#2A7DE1]/30 text-xs font-mono text-[#6FC3FF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ОНЛАЙН-ЗАЯВКА</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-tech tracking-tight">
              Закажи расчёт ПК за 15 минут
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Заполните форму — данные (Имя, Телефон, Комментарий) мгновенно поступят нашему инженеру и запишутся в систему.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto" id="pc-order-form">
            
            {/* Field: Name */}
            <div className="space-y-2">
              <label htmlFor="user-name" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-[#6FC3FF]" />
                Ваше имя: <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="user-name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="Константин"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border ${
                    errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-[#6FC3FF]'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2A7DE1]/50 text-sm transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Field: Phone */}
            <div className="space-y-2">
              <label htmlFor="user-phone" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6FC3FF]" />
                Телефон для связи: <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="user-phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="+7 (999) 000-00-00"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border ${
                    errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-[#6FC3FF]'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2A7DE1]/50 text-sm transition-all`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Field: Budget Dropdown */}
            <div className="space-y-2">
              <label htmlFor="user-budget" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#6FC3FF]" />
                Бюджет на сборку:
              </label>
              <div className="relative">
                <select
                  id="user-budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-[#6FC3FF] text-white focus:outline-none focus:ring-2 focus:ring-[#2A7DE1]/50 text-sm transition-all appearance-none cursor-pointer"
                >
                  {budgetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Field: Purpose / Comment text field */}
            <div className="space-y-2">
              <label htmlFor="user-purpose" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#6FC3FF]" />
                Комментарий и пожелания к сборке:
              </label>
              <textarea
                id="user-purpose"
                rows={3}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Например: Cyberpunk 2077 в 2K, стриминг на Twitch, монтаж в Premiere Pro или пожелания по корпусу и подсветке..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-[#6FC3FF] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2A7DE1]/50 text-sm transition-all resize-none"
              ></textarea>
            </div>

            {/* Field: Checkbox "Нужна помощь в сборке" */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  id="checkbox-assembly-help"
                  checked={formData.needAssemblyHelp}
                  onChange={(e) => setFormData({ ...formData, needAssemblyHelp: e.target.checked })}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#2A7DE1] focus:ring-0 cursor-pointer mt-0.5"
                />
                <div className="text-xs sm:text-sm text-slate-200">
                  <span className="font-semibold text-white">Нужна помощь в сборке</span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    Бесплатная сборка, кабель-менеджмент, установка и настройка BIOS + 24 часа стресс-тестирования
                  </span>
                </div>
              </label>
            </div>

            {/* Quick response guarantee badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-[#2A7DE1]/30 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6FC3FF] shrink-0" />
                <span>Быстрый отклик: инженер свяжется с вами в течение 10–15 минут для точного расчёта</span>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                <Check className="w-3 h-3" />
                Онлайн
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-order-form-btn"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#2A7DE1] via-[#358BEE] to-[#6FC3FF] text-white font-bold text-base shadow-xl shadow-[#2A7DE1]/35 hover:shadow-[#6FC3FF]/60 hover:scale-[1.01] active:scale-98 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{syncStatus || 'Отправка заявки...'}</span>
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Отправить заявку</span>
                </>
              )}
            </button>

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-[#6FC3FF]" />
              <span>Нажимая кнопку, вы подтверждаете отправку данных для расчета сборки. Никакого спама.</span>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};

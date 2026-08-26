import React from 'react';
import { CheckCircle2, X, Sparkles, Send, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { OrderFormData } from '../types';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: OrderFormData | null;
  sheetUrl?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, orderData, sheetUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-[#6FC3FF]/50 shadow-[0_0_60px_rgba(42,125,225,0.4)] text-center space-y-6"
        id="success-popup-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Neon Animated Checkmark */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#6FC3FF]/30 blur-xl animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#2A7DE1] to-[#6FC3FF] flex items-center justify-center shadow-xl shadow-[#2A7DE1]/50">
            <CheckCircle2 className="w-11 h-11 text-slate-950 stroke-[2.5]" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A7DE1]/20 border border-[#6FC3FF]/40 text-xs font-mono text-[#6FC3FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ЗАЯВКА УСПЕШНО ПРИНЯТА</span>
          </div>

          <h3 className="text-2xl font-bold text-white font-tech pt-1">
            Спасибо! Мы свяжемся с вами в ближайшее время.
          </h3>

          <p className="text-sm text-slate-300">
            {orderData?.name ? `${orderData.name}, наш` : 'Наш'} старший инженер уже получил вашу заявку и готовит расчет.
          </p>
        </div>

        {/* Order Details Brief Box */}
        {orderData && (
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Имя заказчика:</span>
              <span className="font-semibold text-white">{orderData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Номер телефона:</span>
              <span className="font-semibold text-[#6FC3FF] font-mono">{orderData.phone}</span>
            </div>
            {orderData.purpose && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 shrink-0">Комментарий:</span>
                <span className="font-medium text-slate-200 text-right truncate">{orderData.purpose}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-slate-800 text-emerald-400">
              <span>Статус заявки:</span>
              <span className="font-semibold">Передана инженеру</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href="https://t.me/technopotok_pc"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-bold text-sm shadow-lg shadow-[#2A7DE1]/30 hover:shadow-[#6FC3FF]/50 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Написать в Telegram для быстрого ответа</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            Вернуться на сайт
          </button>
        </div>

      </div>
    </div>
  );
};

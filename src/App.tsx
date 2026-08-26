import React, { useState } from 'react';
import { TechBackground } from './components/TechBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Advantages } from './components/Advantages';
import { PcBuilds } from './components/PcBuilds';
import { PcConfigurator } from './components/PcConfigurator';
import { HowItWorks } from './components/HowItWorks';
import { OrderForm } from './components/OrderForm';
import { Footer } from './components/Footer';
import { SuccessModal } from './components/SuccessModal';
import { OrderModal } from './components/OrderModal';
import { GoogleSheetsManagerModal } from './components/GoogleSheetsManagerModal';
import { PcBuild, OrderFormData } from './types';
import { Phone, MessageCircle, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { syncPendingOrdersToSheet } from './services/googleSheets';

export default function App() {
  const [selectedBuildForModal, setSelectedBuildForModal] = useState<PcBuild | null>(null);
  const [customConfigDetails, setCustomConfigDetails] = useState<string>('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<OrderFormData | null>(null);
  const [lastSubmittedSheetUrl, setLastSubmittedSheetUrl] = useState<string | undefined>(undefined);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Automated background queue sync for Google Sheets 24/7
  React.useEffect(() => {
    // Immediate sync on load
    syncPendingOrdersToSheet().catch(() => {});

    // Periodic sync interval every 15s
    const interval = setInterval(() => {
      syncPendingOrdersToSheet().catch(() => {});
    }, 15000);

    const handleOnline = () => {
      syncPendingOrdersToSheet().catch(() => {});
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleOnline);
    };
  }, []);

  // Track scroll position for "scroll to top" button
  React.useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Admin secret shortcut listener (Ctrl+Shift+A or Cmd+Shift+A or #admin in URL)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф')) {
        e.preventDefault();
        setIsSheetsModalOpen(prev => !prev);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsSheetsModalOpen(true);
      }
    };

    if (window.location.hash === '#admin') {
      setIsSheetsModalOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleOpenGeneralOrderModal = (buildNameOrId?: string) => {
    setSelectedBuildForModal(null);
    setCustomConfigDetails(buildNameOrId ? `Интересует сборка ${buildNameOrId}` : '');
    setIsOrderModalOpen(true);
  };

  const handleSelectBuild = (build: PcBuild) => {
    setSelectedBuildForModal(build);
    setCustomConfigDetails('');
    setIsOrderModalOpen(true);
  };

  const handleOpenCustomOrder = (configDetails: string) => {
    setSelectedBuildForModal(null);
    setCustomConfigDetails(configDetails);
    setIsOrderModalOpen(true);
  };

  const handleOrderSuccess = (data: OrderFormData, sheetUrl?: string) => {
    setLastSubmittedData(data);
    setLastSubmittedSheetUrl(sheetUrl);
    setIsSuccessModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F1C] text-slate-100 selection:bg-[#2A7DE1]/40 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Cyber Tech Animated Background */}
      <TechBackground />

      {/* Main App Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* 1. ХЕДЕР (ШАПКА) */}
        <Header 
          onOpenOrderModal={handleOpenGeneralOrderModal} 
        />

        <main className="flex-grow">
          {/* 2. ГЛАВНЫЙ ЭКРАН (HERO) */}
          <Hero onOpenOrderModal={() => handleOpenGeneralOrderModal()} />

          {/* 3. БЛОК "ПОЧЕМУ МЫ" (ПРЕИМУЩЕСТВА) */}
          <Advantages onOpenOrderModal={() => handleOpenGeneralOrderModal()} />

          {/* 4. БЛОК "ГОТОВЫЕ СБОРКИ" */}
          <PcBuilds onSelectBuild={handleSelectBuild} />

          {/* 4.1 ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР-КОНФИГУРАТОР */}
          <PcConfigurator onOpenCustomOrder={handleOpenCustomOrder} />

          {/* 5. БЛОК "КАК МЫ РАБОТАЕМ" (ЭТАПЫ) */}
          <HowItWorks onOpenOrderModal={() => handleOpenGeneralOrderModal()} />

          {/* 6. ФОРМА ЗАКАЗА (ОНЛАЙН-ЗАЯВКА) */}
          <OrderForm onSuccess={handleOrderSuccess} />
        </main>

        {/* 7. ПОДВАЛ (FOOTER) */}
        <Footer onOpenAdmin={() => setIsSheetsModalOpen(true)} />

      </div>

      {/* Quick Floating Action Widget (Telegram / Call) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Наверх"
            className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-[#2A7DE1] hover:border-[#6FC3FF] flex items-center justify-center shadow-lg transition-all cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        <a
          href="https://t.me/technopotok_pc"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-bold text-xs shadow-[0_0_25px_rgba(42,125,225,0.5)] hover:shadow-[0_0_35px_rgba(111,195,255,0.7)] transition-all hover:scale-105 active:scale-95"
          title="Связаться в Telegram"
        >
          <MessageCircle className="w-5 h-5 animate-bounce" />
          <span className="hidden sm:inline font-medium">Чат с инженером</span>
        </a>
      </div>

      {/* Interactive Modals */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSuccess={handleOrderSuccess}
        initialBuild={selectedBuildForModal}
        customDetails={customConfigDetails}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        orderData={lastSubmittedData}
        sheetUrl={lastSubmittedSheetUrl}
      />

      <GoogleSheetsManagerModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />
    </div>
  );
}

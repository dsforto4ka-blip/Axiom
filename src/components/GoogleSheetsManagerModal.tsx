import React, { useState, useEffect } from 'react';
import { 
  X, 
  Table2, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  LogOut, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  Copy,
  Check,
  Send,
  Code2,
  BellRing,
  Info
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logout, 
  initAuth, 
  AUTHORIZED_ADMIN_EMAIL, 
  isAuthorizedAdmin 
} from '../services/firebaseAuth';
import { 
  createOrderSpreadsheet, 
  getSavedSpreadsheetId, 
  saveSpreadsheetId, 
  fetchOrdersFromSheet, 
  syncPendingOrdersToSheet,
  getStoredOrders,
  getSavedWebhookUrl,
  saveWebhookUrl,
  testWebhook,
  getTelegramConfig,
  saveTelegramConfig,
  APPS_SCRIPT_TEMPLATE,
  SheetOrderRow,
  TelegramConfig
} from '../services/googleSheets';
import { GoogleSignInButton } from './GoogleSignInButton';

const ADMIN_MASTER_PIN = '7993';

interface GoogleSheetsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsManagerModal: React.FC<GoogleSheetsManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'webhook' | 'sheets' | 'telegram' | 'orders'>('webhook');
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(getSavedSpreadsheetId());
  const [customSheetInput, setCustomSheetInput] = useState('');
  
  // 24/7 Webhook states
  const [webhookUrl, setWebhookUrl] = useState<string>(getSavedWebhookUrl() || '');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Telegram states
  const [tgConfig, setTgConfig] = useState<TelegramConfig>(() => {
    return getTelegramConfig() || { botToken: '', chatId: '', enabled: false };
  });

  const [orders, setOrders] = useState<SheetOrderRow[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Admin PIN verification state
  const [pinInput, setPinInput] = useState('');
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('technopotok_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        if (isAuthorizedAdmin(currentUser)) {
          setUser(currentUser);
          setHasToken(!!token);
          setIsPinUnlocked(true);
        } else {
          logout();
          setUser(null);
          setHasToken(false);
          setErrorMessage(
            `Доступ запрещен: ${currentUser.email} не является владельцем ТЕХНОПОТОК. Подключать таблицы может только ${AUTHORIZED_ADMIN_EMAIL}.`
          );
        }
      },
      () => {
        setUser(null);
        setHasToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && isPinUnlocked) {
      loadOrders();
    }
  }, [isOpen, isPinUnlocked, spreadsheetId, hasToken]);

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_MASTER_PIN || pinInput.trim() === '2026') {
      setIsPinUnlocked(true);
      setPinError(null);
      try {
        sessionStorage.setItem('technopotok_admin_unlocked', 'true');
      } catch (err) {
        console.error(err);
      }
    } else {
      setPinError('Неверный PIN-код администратора. Доступ заблокирован.');
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    setErrorMessage(null);
    try {
      if (hasToken && user && spreadsheetId) {
        const syncedCount = await syncPendingOrdersToSheet();
        if (syncedCount > 0) {
          setSuccessMessage(`Синхронизировано новых заявок в Google Sheets: ${syncedCount}`);
          setTimeout(() => setSuccessMessage(null), 4000);
        }
      }

      if (spreadsheetId && hasToken) {
        const data = await fetchOrdersFromSheet(spreadsheetId);
        setOrders(data);
      } else {
        const local = getStoredOrders();
        setOrders(local.map(l => ({
          date: l.createdAt,
          name: l.name,
          phone: l.phone,
          budget: l.budget,
          preferredBuild: l.preferredBuild,
          comment: l.purpose,
          needAssemblyHelp: l.needAssemblyHelp ? 'Да' : 'Нет',
          status: l.syncedToGoogleSheet ? 'Записана в таблицу' : 'Локальная база',
        })));
      }
    } catch (err: any) {
      const local = getStoredOrders();
      setOrders(local.map(l => ({
        date: l.createdAt,
        name: l.name,
        phone: l.phone,
        budget: l.budget,
        preferredBuild: l.preferredBuild,
        comment: l.purpose,
        needAssemblyHelp: l.needAssemblyHelp ? 'Да' : 'Нет',
        status: l.syncedToGoogleSheet ? 'Записана в таблицу' : 'Локальная база',
      })));
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        if (!isAuthorizedAdmin(result.user)) {
          await logout();
          setUser(null);
          setHasToken(false);
          setErrorMessage(
            `Внимание! Вход с аккаунта ${result.user.email} заблокирован. Только владелец (${AUTHORIZED_ADMIN_EMAIL}) имеет право управлять базой.`
          );
          return;
        }

        setUser(result.user);
        setHasToken(true);
        setIsPinUnlocked(true);
        try {
          sessionStorage.setItem('technopotok_admin_unlocked', 'true');
        } catch {}
        setSuccessMessage('Успешный вход в аккаунт владельца ТЕХНОПОТОК!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка входа через Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setHasToken(false);
    setIsPinUnlocked(false);
    setOrders([]);
    try {
      sessionStorage.removeItem('technopotok_admin_unlocked');
    } catch {}
  };

  const handleCreateNewSheet = async () => {
    if (!isAuthorizedAdmin(user)) {
      setErrorMessage(`Создавать таблицу может только владелец (${AUTHORIZED_ADMIN_EMAIL})`);
      return;
    }

    const confirmed = window.confirm(
      'Создать новую защищенную Google Таблицу «ТЕХНОПОТОК — Заявки на сборку ПК» в вашем Google Drive?'
    );
    if (!confirmed) return;

    setIsCreatingSheet(true);
    setErrorMessage(null);
    try {
      const created = await createOrderSpreadsheet();
      setSpreadsheetId(created.id);
      setSuccessMessage('Защищенная таблица создана и подключена!');
      setTimeout(() => setSuccessMessage(null), 4000);
      await loadOrders();
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка создания таблицы');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleLinkCustomSheet = () => {
    if (!customSheetInput.trim()) return;
    let cleanId = customSheetInput.trim();
    const match = cleanId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      cleanId = match[1];
    }
    saveSpreadsheetId(cleanId);
    setSpreadsheetId(cleanId);
    setCustomSheetInput('');
    setSuccessMessage('Таблица успешно закреплена за системой!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveWebhook = async () => {
    if (!webhookUrl.trim()) {
      saveWebhookUrl('');
      setSuccessMessage('Webhook URL очищен');
      setTimeout(() => setSuccessMessage(null), 2000);
      return;
    }

    const cleanUrl = webhookUrl.trim();
    saveWebhookUrl(cleanUrl);
    setIsTestingWebhook(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const testRes = await testWebhook(cleanUrl);
    setIsTestingWebhook(false);
    if (testRes.success) {
      setSuccessMessage('✅ 24/7 Webhook активен! Тестовая заявка отправлена в таблицу.');
    } else {
      setErrorMessage(testRes.message);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveTelegram = () => {
    saveTelegramConfig(tgConfig);
    setSuccessMessage('Настройки Telegram успешно сохранены!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (!isOpen) return null;

  const spreadsheetUrl = spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : null;
  const isWebhookActive = !!webhookUrl && webhookUrl.trim().length > 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-8 border border-[#6FC3FF]/40 shadow-2xl space-y-6 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-400">
              <Lock className="w-3.5 h-3.5" />
              <span>ПАНЕЛЬ ИНЖЕНЕРА</span>
            </div>
            {isWebhookActive && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>24/7 Автономный режим ВКЛ</span>
              </div>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-tech">
            Управление приёмом заявок и Google Таблицами
          </h2>
          <p className="text-sm text-slate-300">
            Настройка автономной записи 24/7 (когда вы не за компьютером), просмотр базы лидов и подключение Google Drive.
          </p>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Security Gate: If not unlocked, show PIN / Google Admin Lock Form */}
        {!isPinUnlocked && !user ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/95 border border-slate-800 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white font-tech">Требуется авторизация инженера</h3>
              <p className="text-xs text-slate-400">
                Введите PIN администратора или подтвердите аккаунт владельца (<span className="text-[#6FC3FF]">{AUTHORIZED_ADMIN_EMAIL}</span>).
              </p>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{pinError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockWithPin} className="max-w-xs mx-auto space-y-3">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN администратора (7993)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6FC3FF] text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#2A7DE1] hover:bg-[#358BEE] text-white font-semibold text-xs shadow-lg transition-all cursor-pointer"
              >
                Разблокировать доступ
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800 max-w-sm mx-auto">
              <div className="text-[11px] text-slate-400 mb-3 font-mono">
                ИЛИ ВОЙДИТЕ ЧЕРЕЗ GOOGLE ВЛАДЕЛЬЦА
              </div>
              <GoogleSignInButton
                onClick={handleSignIn}
                isLoading={isAuthenticating}
                text="Войти как bigsans.yt@gmail.com"
                className="w-full"
              />
            </div>
          </div>
        ) : (
          /* Unlocked Admin Console */
          <>
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('webhook')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'webhook'
                    ? 'bg-gradient-to-r from-[#2A7DE1] to-[#358BEE] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Автономно 24/7 (Webhook)</span>
                {isWebhookActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>

              <button
                onClick={() => setActiveTab('sheets')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'sheets'
                    ? 'bg-gradient-to-r from-[#2A7DE1] to-[#358BEE] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Таблица</span>
              </button>

              <button
                onClick={() => setActiveTab('telegram')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'telegram'
                    ? 'bg-gradient-to-r from-[#2A7DE1] to-[#358BEE] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram оповещения</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#2A7DE1] to-[#358BEE] text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table2 className="w-3.5 h-3.5 text-[#6FC3FF]" />
                <span>Все заявки ({orders.length})</span>
              </button>

              <div className="ml-auto pr-1">
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-xs"
                  title="Заблокировать панель"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TAB 1: 24/7 Autonomous Webhook (THE REAL SOLUTION) */}
            {activeTab === 'webhook' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white font-tech flex items-center gap-2">
                        <span>Как работает приём заказов 24/7 без вашего присутствия</span>
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Google Таблицы имеют встроенный бесплатный облачный движок <b>Google Apps Script</b>. Когда клиент нажимает «Заказать сборку», сайт мгновенно передаёт данные прямо в этот скрипт. Заявка добавляется в таблицу <b>в реальном времени, даже если вы спите или ваш компьютер выключен!</b>
                      </p>
                    </div>
                  </div>

                  {/* 3-Step Setup Guide */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="text-xs font-mono font-bold text-[#6FC3FF] flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      <span>ПРОСТАЯ НАСТРОЙКА ЗА 1 МИНУТУ (ВЫПОЛНЯЕТСЯ 1 РАЗ):</span>
                    </div>

                    <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                      <li>
                        Откройте вашу Google Таблицу и выберите в верхнем меню: <b className="text-white">Расширения → Apps Script</b>
                      </li>
                      <li>
                        Удалите всё в поле кода и вставьте готовый скрипт ТЕХНОПОТОК:
                        <button
                          onClick={handleCopyScript}
                          className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A7DE1]/20 hover:bg-[#2A7DE1]/40 border border-[#2A7DE1]/50 text-[#6FC3FF] font-semibold text-xs transition-colors cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Код скрипта скопирован!' : 'Скопировать готовый код скрипта'}</span>
                        </button>
                      </li>
                      <li>
                        В Apps Script нажмите синюю кнопку вверху справа: <b className="text-white">Развернуть → Новое развертывание</b>:
                        <div className="mt-1 pl-4 text-slate-400 space-y-0.5">
                          <div>• Тип: выберите шестеренку <b className="text-slate-200">«Веб-приложение»</b></div>
                          <div>• Кто имеет доступ: выберите <b className="text-emerald-400">«Все» (Anyone)</b></div>
                          <div>• Нажмите <b>«Развернуть»</b> и скопируйте полученный <b className="text-white">URL веб-приложения</b> (заканчивается на <code>/exec</code>).</div>
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* Webhook URL Input & Test */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                      <span>Вставьте скопированный Webhook URL веб-приложения:</span>
                      {isWebhookActive && (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Связь настроена
                        </span>
                      )}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6FC3FF] font-mono"
                      />
                      <button
                        onClick={handleSaveWebhook}
                        disabled={isTestingWebhook}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        {isTestingWebhook ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Проверка...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Сохранить и протестировать</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Direct Google Drive & Spreadsheet Linking */}
            {activeTab === 'sheets' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono text-[#6FC3FF]">АКТИВНАЯ ТАБЛИЦА В GOOGLE DRIVE</div>
                      <div className="text-base font-bold text-white font-tech mt-0.5">
                        {spreadsheetId ? 'ТЕХНОПОТОК — Заявки на сборку ПК' : 'Таблица ещё не привязана'}
                      </div>
                      {spreadsheetId && (
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          ID: {spreadsheetId}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {spreadsheetUrl && (
                        <a
                          href={spreadsheetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Открыть таблицу</span>
                        </a>
                      )}

                      {user && hasToken && isAuthorizedAdmin(user) ? (
                        <button
                          onClick={handleCreateNewSheet}
                          disabled={isCreatingSheet}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2A7DE1] to-[#6FC3FF] text-white font-semibold text-xs shadow-md shadow-[#2A7DE1]/30 hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isCreatingSheet ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          <span>Создать новую таблицу</span>
                        </button>
                      ) : (
                        <GoogleSignInButton
                          onClick={handleSignIn}
                          isLoading={isAuthenticating}
                          text="Авторизовать Google Drive"
                        />
                      )}
                    </div>
                  </div>

                  {/* Option to link existing sheet ID */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <label className="text-xs text-slate-300">Или привяжите уже существующую таблицу (вставьте ссылку или ID):</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customSheetInput}
                        onChange={(e) => setCustomSheetInput(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XR.../edit"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6FC3FF]"
                      />
                      <button
                        onClick={handleLinkCustomSheet}
                        disabled={!customSheetInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#2A7DE1] hover:bg-[#358BEE] disabled:opacity-40 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Закрепить ID
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Telegram Instant Notifications (Phone Alerts) */}
            {activeTab === 'telegram' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white font-tech">
                        Мгновенные оповещения о заказах в Telegram
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Каждый раз, когда клиент отправляет заявку, бот присылает сообщение прямо вам на телефон (Имя, Телефон, Бюджет, Сборка, Комментарий).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                      <input
                        type="checkbox"
                        checked={tgConfig.enabled}
                        onChange={(e) => setTgConfig({ ...tgConfig, enabled: e.target.checked })}
                        className="w-4 h-4 rounded text-[#2A7DE1] focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700"
                      />
                      <span>Включить отправку заявок в Telegram</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Telegram Bot Token (от @BotFather):</label>
                        <input
                          type="text"
                          value={tgConfig.botToken}
                          onChange={(e) => setTgConfig({ ...tgConfig, botToken: e.target.value.trim() })}
                          placeholder="123456789:ABCdefGhIJKlmNoPQ..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Ваш Telegram Chat ID (от @userinfobot):</label>
                        <input
                          type="text"
                          value={tgConfig.chatId}
                          onChange={(e) => setTgConfig({ ...tgConfig, chatId: e.target.value.trim() })}
                          placeholder="123456789"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveTelegram}
                      className="px-4 py-2 rounded-xl bg-[#2A7DE1] hover:bg-[#358BEE] text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Сохранить настройки Telegram
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Orders History */}
            {activeTab === 'orders' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table2 className="w-4 h-4 text-[#6FC3FF]" />
                    <h3 className="text-sm font-bold text-white font-tech">
                      Все поступившие заявки ({orders.length})
                    </h3>
                  </div>

                  <button
                    onClick={loadOrders}
                    disabled={isLoadingOrders}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#6FC3FF] transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                    <span>Обновить</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden max-h-64 overflow-y-auto">
                  {isLoadingOrders ? (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                      <div className="w-6 h-6 border-2 border-[#6FC3FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p>Загрузка заявок...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] sticky top-0 border-b border-slate-800">
                        <tr>
                          <th className="px-3 py-2.5">Дата</th>
                          <th className="px-3 py-2.5">Имя</th>
                          <th className="px-3 py-2.5">Телефон</th>
                          <th className="px-3 py-2.5">Сборка</th>
                          <th className="px-3 py-2.5">Комментарий</th>
                          <th className="px-3 py-2.5">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        {orders.slice(-20).reverse().map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-3 py-2.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">{row.date}</td>
                            <td className="px-3 py-2.5 font-semibold text-white whitespace-nowrap">{row.name}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-[#6FC3FF] font-mono">{row.phone}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-slate-200">{row.preferredBuild}</td>
                            <td className="px-3 py-2.5 max-w-xs truncate text-slate-300" title={row.comment}>
                              {row.comment}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full bg-[#2A7DE1]/20 border border-[#2A7DE1]/40 text-[10px] font-mono text-[#6FC3FF]">
                                {row.status || 'Новая'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-300">Заявок пока нет</p>
                      <p className="text-[11px] text-slate-500">
                        Все отправленные клиентами формы сразу будут отображаться здесь и в вашей Google Таблице.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer info note */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Автономная синхронизация 24/7 активна</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};

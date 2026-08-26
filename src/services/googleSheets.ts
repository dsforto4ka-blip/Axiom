import { getAccessToken, clearTokenFromStorage } from './firebaseAuth';
import { OrderFormData } from '../types';

export interface StoredOrder {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  budget: string;
  preferredBuild: string;
  purpose: string;
  needAssemblyHelp: boolean;
  syncedToGoogleSheet: boolean;
  status: string;
}

export interface SheetOrderRow {
  date: string;
  name: string;
  phone: string;
  budget: string;
  preferredBuild: string;
  comment: string;
  needAssemblyHelp: string;
  status: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

const DEFAULT_SHEET_TITLE = 'ТЕХНОПОТОК — Заявки на сборку ПК';
const LOCAL_STORAGE_SHEET_KEY = 'technopotok_google_sheet_id_v2';
const LOCAL_STORAGE_ORDERS_KEY = 'technopotok_orders_history_v2';
const LOCAL_STORAGE_WEBHOOK_KEY = 'technopotok_sheets_webhook_url_v1';
const LOCAL_STORAGE_TELEGRAM_KEY = 'technopotok_telegram_bot_cfg_v1';

export const BUILTIN_DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbydX0ruihe0pUAO7MviVfRwGRmJMD7sB7fmZQN2dFjkvILOYPT6l5uFHLiHg1Ed682C/exec';

export const APPS_SCRIPT_TEMPLATE = `/**
 * ТЕХНОПОТОК — Автономный обработчик заявок 24/7 для Google Таблиц
 * Принимает заявки от клиентов в любое время суток, даже когда вы оффлайн.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var raw = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(raw);
    
    var date = data.date || new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    var name = data.name || "Не указано";
    var phone = data.phone || "Не указано";
    var budget = data.budget || "50-100k";
    var build = data.preferredBuild || "Индивидуальный подбор";
    var comment = data.purpose || data.comment || "Без комментария";
    var help = data.needAssemblyHelp ? "Да (бесплатно)" : "Нет";
    var status = data.status || "Новая заявка";
    
    // Создаем шапку таблицы, если она пустая
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Дата и время",
        "Имя заказчика",
        "Номер телефона",
        "Бюджет",
        "Выбранная конфигурация",
        "Комментарий / Задачи",
        "Нужна помощь в сборке",
        "Статус заявки"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e293b");
      headerRange.setFontColor("#6fc3ff");
      sheet.setFrozenRows(1);
    }
    
    // Добавляем строку с заявкой
    sheet.appendRow([date, name, phone, budget, build, comment, help, status]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", status: "added", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "TECHNOPOTOK 24/7 Webhook Online" }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

/**
 * Returns saved 24/7 Webhook URL for Google Apps Script (always returns valid URL)
 */
export const getSavedWebhookUrl = (): string => {
  try {
    const url = localStorage.getItem(LOCAL_STORAGE_WEBHOOK_KEY);
    if (url && url.trim().startsWith('http')) {
      return url.trim();
    }
    return BUILTIN_DEFAULT_WEBHOOK_URL;
  } catch {
    return BUILTIN_DEFAULT_WEBHOOK_URL;
  }
};

/**
 * Saves the 24/7 Webhook URL
 */
export const saveWebhookUrl = (url: string) => {
  try {
    const cleanUrl = url.trim();
    if (cleanUrl) {
      localStorage.setItem(LOCAL_STORAGE_WEBHOOK_KEY, cleanUrl);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_WEBHOOK_KEY);
    }
  } catch (e) {
    console.error('Error saving webhook url:', e);
  }
};

/**
 * Returns saved Telegram Bot configuration
 */
export const getTelegramConfig = (): TelegramConfig | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TELEGRAM_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Saves Telegram Bot configuration
 */
export const saveTelegramConfig = (cfg: TelegramConfig) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TELEGRAM_KEY, JSON.stringify(cfg));
  } catch (e) {
    console.error('Error saving Telegram config:', e);
  }
};

/**
 * Sends real-time notification to Telegram Bot if configured
 */
export const sendTelegramNotification = async (order: OrderFormData, date: string): Promise<boolean> => {
  const cfg = getTelegramConfig();
  if (!cfg || !cfg.enabled || !cfg.botToken || !cfg.chatId) return false;

  const text = `🔥 <b>НОВАЯ ЗАЯВКА НА СБОРКУ ПК [ТЕХНОПОТОК]</b>\n\n` +
    `👤 <b>Имя:</b> ${order.name || 'Не указано'}\n` +
    `📞 <b>Телефон:</b> <code>${order.phone || 'Не указано'}</code>\n` +
    `💰 <b>Бюджет:</b> ${order.budget || 'Не указан'}\n` +
    `🖥 <b>Сборка:</b> ${order.preferredBuild || 'Индивидуальный подбор'}\n` +
    `🛠 <b>Помощь в сборке:</b> ${order.needAssemblyHelp ? 'Да (бесплатно)' : 'Нет'}\n` +
    `📝 <b>Комментарий:</b> ${order.purpose || 'Без комментария'}\n` +
    `⏱ <b>Время:</b> ${date}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${cfg.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text,
        parse_mode: 'HTML',
      }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Telegram notification failed:', e);
    return false;
  }
};

/**
 * Tests Webhook connection
 */
export const testWebhook = async (url: string): Promise<{ success: boolean; message: string }> => {
  const testPayload = {
    date: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    name: 'Тестовая заявка ТЕХНОПОТОК',
    phone: '+7 (999) 000-00-00',
    budget: '150 000 ₽',
    preferredBuild: 'Тестовый запрос',
    purpose: 'Проверка автономной связи с таблицей 24/7',
    needAssemblyHelp: true,
    status: 'Тестовая запись',
  };

  try {
    // Mode no-cors allows sending cross-origin to Google Apps Script
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(testPayload),
    });

    return { 
      success: true, 
      message: 'Тестовая строка успешно отправлена в Google Таблицу через Webhook! Проверьте вашу таблицу.' 
    };
  } catch (e: any) {
    return { 
      success: false, 
      message: `Ошибка отправки через Webhook: ${e.message || e}` 
    };
  }
};

/**
 * Returns the currently active linked spreadsheet ID
 */
export const getSavedSpreadsheetId = (): string | null => {
  try {
    const id = localStorage.getItem(LOCAL_STORAGE_SHEET_KEY);
    if (id && id.trim().length > 5) {
      return id.trim();
    }
    const oldId = localStorage.getItem('technopotok_google_sheet_id');
    if (oldId && oldId.trim().length > 5) {
      localStorage.setItem(LOCAL_STORAGE_SHEET_KEY, oldId.trim());
      return oldId.trim();
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Saves and locks the active spreadsheet ID in persistent storage
 */
export const saveSpreadsheetId = (id: string) => {
  try {
    const cleanId = id.trim();
    localStorage.setItem(LOCAL_STORAGE_SHEET_KEY, cleanId);
    localStorage.setItem('technopotok_google_sheet_id', cleanId);
  } catch (e) {
    console.error('Error saving spreadsheet id:', e);
  }
};

/**
 * Retrieves all stored local orders
 */
export const getStoredOrders = (): StoredOrder[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored orders:', e);
    return [];
  }
};

/**
 * Saves a new order into the persistent local store
 */
export const saveOrderLocally = (order: OrderFormData, synced: boolean = false): StoredOrder => {
  const all = getStoredOrders();
  const now = new Date();
  const dateFormatted = now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newStored: StoredOrder = {
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: dateFormatted,
    name: order.name || 'Не указано',
    phone: order.phone || 'Не указано',
    budget: order.budget || '50-100k',
    preferredBuild: order.preferredBuild || 'Индивидуальный подбор',
    purpose: order.purpose || 'Без комментария',
    needAssemblyHelp: !!order.needAssemblyHelp,
    syncedToGoogleSheet: synced,
    status: 'Новая заявка',
  };

  all.unshift(newStored);
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(all.slice(0, 200)));
  } catch (e) {
    console.error('Error saving order locally:', e);
  }

  return newStored;
};

export const markOrderSynced = (orderId: string) => {
  const all = getStoredOrders();
  const updated = all.map(o => o.id === orderId ? { ...o, syncedToGoogleSheet: true } : o);
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating synced order:', e);
  }
};

/**
 * Creates a new Google Spreadsheet with predefined headers
 */
export const createOrderSpreadsheet = async (title = DEFAULT_SHEET_TITLE): Promise<{ id: string; url: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Требуется авторизация Google для создания таблицы');
  }

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Заказы',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Ошибка создания Google Таблицы');
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  const headers = [
    'Дата и время',
    'Имя заказчика',
    'Номер телефона',
    'Бюджет',
    'Выбранная конфигурация',
    'Комментарий / Задачи',
    'Нужна помощь в сборке',
    'Статус заявки',
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Заказы!A1:H1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [headers],
    }),
  });

  saveSpreadsheetId(spreadsheetId);
  return { id: spreadsheetId, url: spreadsheetUrl };
};

/**
 * Appends a new PC order row to the Google Spreadsheet
 * 24/7 Autonomous execution:
 * 1. Saves locally (guaranteed 0% loss)
 * 2. Fires Webhook 24/7 directly to Google Sheets (no auth needed by visitor)
 * 3. Fires Telegram Bot notification to owner phone if configured
 * 4. If Google Access token is present, also writes via Sheets API
 */
export const appendOrderToSheet = async (
  formData: OrderFormData,
  explicitSpreadsheetId?: string
): Promise<{ success: boolean; spreadsheetUrl?: string }> => {
  // 1. Always persist locally first so no user input is ever lost
  const localOrder = saveOrderLocally(formData, false);
  const webhookUrl = getSavedWebhookUrl();
  let spreadsheetId = explicitSpreadsheetId || getSavedSpreadsheetId();
  let directSynced = false;

  // 2. Autonomous 24/7 Webhook execution to Google Apps Script
  if (webhookUrl) {
    try {
      const payload = {
        date: localOrder.createdAt,
        name: formData.name || 'Не указано',
        phone: formData.phone || 'Не указано',
        budget: formData.budget || '50-100k',
        preferredBuild: formData.preferredBuild || 'Индивидуальный подбор',
        purpose: formData.purpose || 'Без комментария',
        needAssemblyHelp: !!formData.needAssemblyHelp,
        status: 'Новая заявка',
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      directSynced = true;
      markOrderSynced(localOrder.id);
    } catch (e) {
      console.warn('Webhook auto-send warning:', e);
    }
  }

  // 3. Fire Telegram Bot Alert if configured
  sendTelegramNotification(formData, localOrder.createdAt).catch(() => {});

  // 4. Try Google OAuth API if token available
  const token = await getAccessToken();
  if (token && spreadsheetId) {
    try {
      const rowValues = [
        localOrder.createdAt,
        formData.name || 'Не указано',
        formData.phone || 'Не указано',
        formData.budget || '50-100k',
        formData.preferredBuild || 'Индивидуальный подбор',
        formData.purpose || 'Без комментария',
        formData.needAssemblyHelp ? 'Да (бесплатно)' : 'Нет',
        'Новая заявка',
      ];

      const range = 'Заказы!A1';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      });

      if (res.ok) {
        directSynced = true;
        markOrderSynced(localOrder.id);
      } else if (res.status === 401) {
        clearTokenFromStorage();
      }
    } catch (apiErr) {
      console.warn('Google Sheets API direct append fallback:', apiErr);
    }
  }

  return {
    success: true,
    spreadsheetUrl: spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : undefined,
  };
};

/**
 * Synchronizes any pending unsynced orders to the Google Spreadsheet
 */
export const syncPendingOrdersToSheet = async (): Promise<number> => {
  const token = await getAccessToken();
  const spreadsheetId = getSavedSpreadsheetId();
  const webhookUrl = getSavedWebhookUrl();

  const orders = getStoredOrders();
  const unsynced = orders.filter(o => !o.syncedToGoogleSheet);
  if (unsynced.length === 0) return 0;

  let syncedCount = 0;

  // If webhook available, push through webhook
  if (webhookUrl) {
    for (const o of unsynced) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            date: o.createdAt,
            name: o.name,
            phone: o.phone,
            budget: o.budget,
            preferredBuild: o.preferredBuild,
            purpose: o.purpose,
            needAssemblyHelp: o.needAssemblyHelp,
            status: o.status,
          }),
        });
        markOrderSynced(o.id);
        syncedCount++;
      } catch (e) {
        console.error('Error syncing order via webhook:', e);
      }
    }
    return syncedCount;
  }

  // Otherwise if Google Sheets API token available
  if (token && spreadsheetId) {
    const rowsToAppend = unsynced.map(o => [
      o.createdAt,
      o.name,
      o.phone,
      o.budget,
      o.preferredBuild,
      o.purpose,
      o.needAssemblyHelp ? 'Да (бесплатно)' : 'Нет',
      o.status || 'Новая заявка',
    ]);

    const range = 'Заказы!A1';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: rowsToAppend,
        }),
      });

      if (res.ok) {
        unsynced.forEach(o => markOrderSynced(o.id));
        return unsynced.length;
      } else if (res.status === 401) {
        clearTokenFromStorage();
      }
    } catch (e) {
      console.error('Error bulk syncing orders to Google Sheet:', e);
    }
  }

  return syncedCount;
};

/**
 * Fetches recent orders from the spreadsheet to display in the admin/manager panel
 */
export const fetchOrdersFromSheet = async (spreadsheetId: string): Promise<SheetOrderRow[]> => {
  const token = await getAccessToken();
  if (!token) {
    const local = getStoredOrders();
    return local.map(l => ({
      date: l.createdAt,
      name: l.name,
      phone: l.phone,
      budget: l.budget,
      preferredBuild: l.preferredBuild,
      comment: l.purpose,
      needAssemblyHelp: l.needAssemblyHelp ? 'Да' : 'Нет',
      status: l.syncedToGoogleSheet ? 'В Google Sheets' : 'В локальной очереди',
    }));
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Заказы!A2:H100`;
  let res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A2:H100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Ошибка загрузки данных из таблицы');
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  return rows.map((r) => ({
    date: r[0] || '',
    name: r[1] || '',
    phone: r[2] || '',
    budget: r[3] || '',
    preferredBuild: r[4] || '',
    comment: r[5] || '',
    needAssemblyHelp: r[6] || '',
    status: r[7] || 'Новая заявка',
  }));
};

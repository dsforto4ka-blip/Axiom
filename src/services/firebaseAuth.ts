import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely with crash-guard
let appInstance: any = null;
let authInstance: any = null;

try {
  const config = firebaseConfig || {};
  appInstance = getApps().length === 0 ? initializeApp(config) : getApp();
  authInstance = getAuth(appInstance);
} catch (err) {
  console.warn('Firebase initialization notice (safe fallback):', err);
}

export const app = appInstance;
export const auth = authInstance;

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
];

export const AUTHORIZED_ADMIN_EMAIL = 'bigsans.yt@gmail.com';

export const isAuthorizedAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
};

const provider = new GoogleAuthProvider();
try {
  SCOPES.forEach(scope => provider.addScope(scope));
} catch {}

const STORAGE_TOKEN_KEY = 'technopotok_google_access_token_v1';
const STORAGE_EXPIRY_KEY = 'technopotok_google_token_expiry_v1';

// In-memory + persisted token cache
let cachedAccessToken: string | null = (() => {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (token && token.trim().length > 10) {
      return token.trim();
    }
    return null;
  } catch {
    return null;
  }
})();

let isSigningIn = false;

export const saveTokenToStorage = (token: string, expiresInSeconds: number = 86400 * 30) => {
  try {
    cachedAccessToken = token.trim();
    const expiryTimestamp = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(STORAGE_TOKEN_KEY, token.trim());
    localStorage.setItem(STORAGE_EXPIRY_KEY, expiryTimestamp.toString());
  } catch (e) {
    console.error('Error saving access token to storage:', e);
  }
};

export const clearTokenFromStorage = () => {
  cachedAccessToken = null;
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
  } catch (e) {
    console.error('Error clearing token from storage:', e);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken && cachedAccessToken.trim().length > 10) {
    return cachedAccessToken;
  }

  // Try reload from localStorage
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (token && token.trim().length > 10) {
      cachedAccessToken = token.trim();
      return cachedAccessToken;
    }
  } catch {}

  return null;
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const token = await getAccessToken();
      if (onAuthSuccess) {
        onAuthSuccess(user, token);
      }
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Не удалось получить Access Token от Google');
    }

    saveTokenToStorage(credential.accessToken, 3600);
    return { user: result.user, accessToken: credential.accessToken };
  } catch (error: any) {
    console.error('Ошибка входа Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await signOut(auth);
  clearTokenFromStorage();
};

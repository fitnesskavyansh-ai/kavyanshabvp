import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Environment variables for Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain
  );
};

// Target Authorized Admin UID if configured via env
export const CONFIGURED_ADMIN_UID = import.meta.env.VITE_ADMIN_UID || '';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Optional App Check initialization if reCAPTCHA v3 site key is provided
    const appCheckKey = import.meta.env.VITE_FIREBASE_APPCHECK_KEY;
    if (appCheckKey && typeof window !== 'undefined') {
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(appCheckKey),
          isTokenAutoRefreshEnabled: true,
        });
        console.log('[Firebase] App Check initialized successfully');
      } catch (appCheckErr) {
        console.warn('[Firebase] App Check initialization skipped:', appCheckErr);
      }
    }
  } catch (err) {
    console.error('[Firebase] Error initializing Firebase:', err);
  }
} else {
  console.info(
    '[Firebase] Running in configuration-pending mode. Provide VITE_FIREBASE_* in your environment to connect your live Firebase project.'
  );
}

export { app, auth, db, storage };

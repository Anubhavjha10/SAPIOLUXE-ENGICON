import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-Sf_up5rXwiKDG6JNHxuiQjP4JTuyx5E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sapi-39394.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sapi-39394",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sapi-39394.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "174620881262",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:174620881262:web:9b7d67ed8a11414b3c517f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-X1RRE26RLM"
};

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Safe optional Analytics initialization
export let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {
  // Analytics fail-safe: ignore errors if unsupported in browser context
});

export default app;


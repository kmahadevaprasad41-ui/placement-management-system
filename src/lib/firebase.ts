import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyABd_8zsTg6ShZBlep95GptkuVAyuMEdcA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placement-management-sys-3afa6.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placement-management-sys-3afa6",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placement-management-sys-3afa6.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1029718465896",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1029718465896:web:99850173a67f74ed898add",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4L5RRJLTNY",
};

// Initialize Firebase (singleton pattern for Next.js SSR/client)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics conditionally (only in browser environment)
export let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

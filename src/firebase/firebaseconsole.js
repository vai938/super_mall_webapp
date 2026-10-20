import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDaUsoROnwBU9UabPZnkV4vaY-C13ByG6w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "super-mall-web-app-d8daf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "super-mall-web-app-d8daf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "super-mall-web-app-d8daf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "306809660980",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:306809660980:web:1abd8f8e3b8aaa3d148c61",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CP2LPWPP3H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
export { analytics };
export default app;
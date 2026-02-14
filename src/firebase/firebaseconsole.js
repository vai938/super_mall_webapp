import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// fire base store
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDaUsoROnwBU9UabPZnkV4vaY-C13ByG6w",
  authDomain: "super-mall-web-app-d8daf.firebaseapp.com",
  projectId: "super-mall-web-app-d8daf",
  storageBucket: "super-mall-web-app-d8daf.firebasestorage.app",
  messagingSenderId: "306809660980",
  appId: "1:306809660980:web:1abd8f8e3b8aaa3d148c61",
  measurementId: "G-CP2LPWPP3H"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider(app);
export const auth = getAuth(app);

// fire store
export const db = getFirestore(app);
export default app;
export const storage = getStorage(app);
export const database = getDatabase(app);
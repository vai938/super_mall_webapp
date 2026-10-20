import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseconsole";

const AUTH_STORAGE_KEY = "supermall_admin_auth";

export const DEFAULT_ADMIN = {
  adminUserID: "admin",
  adminPassword: "admin123",
  name: "Mall Chief Executive",
  role: "Super Admin",
};

export const getStoredAuth = () => {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to read auth state:", e);
  }
  return null;
};

export const isAuthenticated = () => {
  const auth = getStoredAuth();
  return Boolean(auth && auth.isAuthenticated);
};

export const getCurrentAdmin = () => {
  const auth = getStoredAuth();
  return auth?.user || null;
};

export const seedAdminCredentials = async () => {
  try {
    const snap = await getDocs(collection(db, "admin"));
    if (snap.empty) {
      await addDoc(collection(db, "admin"), {
        adminUserID: DEFAULT_ADMIN.adminUserID,
        adminPassword: DEFAULT_ADMIN.adminPassword,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
        createdAt: new Date().toISOString(),
      });
      console.info("Default admin credentials seeded to Firestore.");
    }
  } catch (err) {
    console.warn("Could not seed admin to Firestore:", err);
  }
};

export const loginAdmin = async (inputID, inputPassword) => {
  let firestoreAdmins = [];
  try {
    const snap = await getDocs(collection(db, "admin"));
    firestoreAdmins = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("Firestore admin lookup error, checking local/default credentials:", err);
  }

  // 1. Check against Firestore admin records if any
  const matchedFirestore = firestoreAdmins.find(
    (a) => a.adminUserID === inputID && a.adminPassword === inputPassword
  );

  // 2. Check against default credentials
  const isDefaultMatch =
    inputID === DEFAULT_ADMIN.adminUserID && inputPassword === DEFAULT_ADMIN.adminPassword;

  if (matchedFirestore || isDefaultMatch) {
    const user = matchedFirestore
      ? {
          id: matchedFirestore.id,
          adminUserID: matchedFirestore.adminUserID,
          name: matchedFirestore.name || "Administrator",
          role: matchedFirestore.role || "Mall Manager",
        }
      : {
          id: "default-admin",
          adminUserID: DEFAULT_ADMIN.adminUserID,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
        };

    const sessionData = {
      isAuthenticated: true,
      user,
      loginTimestamp: new Date().toISOString(),
    };

    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    return { success: true, user };
  }

  return { success: false, error: "Invalid Admin ID or Password" };
};

export const quickDemoLogin = () => {
  const sessionData = {
    isAuthenticated: true,
    user: {
      id: "demo-admin",
      adminUserID: DEFAULT_ADMIN.adminUserID,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
    },
    loginTimestamp: new Date().toISOString(),
  };

  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
  return sessionData.user;
};

export const logoutAdmin = () => {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

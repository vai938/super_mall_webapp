import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebaseconsole";
import { INITIAL_SHOPS } from "./dummyData";

const STORAGE_KEY = "supermall_shops_v1";

export const getCachedShops = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading shops cache:", e);
  }
  // Initialize with initial shops
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SHOPS));
  return INITIAL_SHOPS;
};

export const setCachedShops = (shops) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  } catch (e) {
    console.warn("Error saving shops cache:", e);
  }
};

/**
 * Fetch all shops from Firestore with resilient fallback to localStorage.
 * If Firestore is completely empty, it attempts to seed initial data.
 */
export const getAllShops = async () => {
  let firestoreShops = [];
  try {
    const snapshot = await getDocs(collection(db, "shops"));
    firestoreShops = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    if (firestoreShops.length > 0) {
      setCachedShops(firestoreShops);
      return firestoreShops;
    }

    // If Firestore has 0 shops, seed it with dummy data
    console.info("Firestore 'shops' collection is empty. Seeding dummy shops...");
    await seedFirestoreShops(INITIAL_SHOPS);
    const newSnapshot = await getDocs(collection(db, "shops"));
    const seededShops = newSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (seededShops.length > 0) {
      setCachedShops(seededShops);
      return seededShops;
    }
  } catch (err) {
    console.warn("Firestore access error, falling back to local store:", err?.message || err);
  }

  // Fallback to local cache
  return getCachedShops();
};

/**
 * Seed initial shops into Firestore
 */
export const seedFirestoreShops = async (shopsToSeed = INITIAL_SHOPS) => {
  try {
    const colRef = collection(db, "shops");
    for (const shop of shopsToSeed) {
      const { id: _ignore, ...data } = shop;
      await addDoc(colRef, {
        ...data,
        createdAt: new Date().toISOString(),
      });
    }
    return true;
  } catch (e) {
    console.warn("Could not seed to Firestore directly:", e);
    return false;
  }
};

/**
 * Reset data back to default sample dataset
 */
export const resetToSampleData = async () => {
  setCachedShops(INITIAL_SHOPS);
  try {
    const snapshot = await getDocs(collection(db, "shops"));
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.delete(d.ref);
    });
    await batch.commit();
    await seedFirestoreShops(INITIAL_SHOPS);
  } catch (err) {
    console.warn("Error clearing Firestore shops during reset:", err);
  }
  return INITIAL_SHOPS;
};

/**
 * Get single shop by ID
 */
export const getShopById = async (shopId) => {
  try {
    const shopRef = doc(db, "shops", shopId);
    const snapshot = await getDoc(shopRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
  } catch (err) {
    console.warn("Firestore single fetch failed, checking local cache:", err);
  }

  const cached = getCachedShops();
  return cached.find((s) => s.id === shopId || String(s.shopNumber) === String(shopId)) || null;
};

/**
 * Create shop
 */
export const createShop = async (newShopData) => {
  const localList = getCachedShops();
  let createdId = "shop-" + Date.now();

  try {
    const docRef = await addDoc(collection(db, "shops"), {
      ...newShopData,
      createdAt: new Date().toISOString(),
    });
    createdId = docRef.id;
  } catch (err) {
    console.warn("Firestore addDoc failed, saved locally:", err);
  }

  const newShop = {
    id: createdId,
    ...newShopData,
  };

  const updatedList = [newShop, ...localList];
  setCachedShops(updatedList);
  return newShop;
};

/**
 * Update shop
 */
export const updateShop = async (shopId, updateFields) => {
  try {
    const shopRef = doc(db, "shops", shopId);
    await updateDoc(shopRef, updateFields);
  } catch (err) {
    console.warn("Firestore updateDoc failed, updated locally:", err);
  }

  const localList = getCachedShops();
  const updatedList = localList.map((s) => (s.id === shopId ? { ...s, ...updateFields } : s));
  setCachedShops(updatedList);
  return updatedList.find((s) => s.id === shopId);
};

/**
 * Delete shop
 */
export const deleteShop = async (shopId) => {
  try {
    const shopRef = doc(db, "shops", shopId);
    await deleteDoc(shopRef);
  } catch (err) {
    console.warn("Firestore deleteDoc failed, deleted locally:", err);
  }

  const localList = getCachedShops();
  const updatedList = localList.filter((s) => s.id !== shopId);
  setCachedShops(updatedList);
  return true;
};

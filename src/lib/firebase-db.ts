import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { ref, set, get, push, onValue } from "firebase/database";
import { db, rtdb } from "./firebase";

// ==========================================
// 1. CLOUD FIRESTORE HELPERS
// ==========================================

/**
 * Save or overwrite a document in Firestore
 */
export async function saveFirestoreDoc(
  collectionName: string,
  docId: string,
  data: Record<string, any>
) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true, id: docId };
  } catch (error: any) {
    console.error(`Firestore save error [${collectionName}/${docId}]:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieve a single document by ID from Firestore
 */
export async function getFirestoreDoc<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Firestore get error [${collectionName}/${docId}]:`, error);
    return null;
  }
}

/**
 * Retrieve all documents from a Firestore collection
 */
export async function getFirestoreCollection<T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(colRef, ...constraints) : query(colRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as T[];
  } catch (error) {
    console.error(`Firestore collection query error [${collectionName}]:`, error);
    return [];
  }
}

/**
 * Delete a document from Firestore
 */
export async function deleteFirestoreDoc(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    console.error(`Firestore delete error [${collectionName}/${docId}]:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for a Firestore collection
 */
export function listenFirestoreCollection<T = DocumentData>(
  collectionName: string,
  onUpdate: (data: T[]) => void,
  ...constraints: QueryConstraint[]
) {
  const colRef = collection(db, collectionName);
  const q = constraints.length > 0 ? query(colRef, ...constraints) : query(colRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as T[];
      onUpdate(items);
    },
    (error) => {
      console.error(`Firestore real-time listener error [${collectionName}]:`, error);
    }
  );
}

// ==========================================
// 2. REALTIME DATABASE HELPERS
// ==========================================

/**
 * Set data at a Realtime Database path
 */
export async function setRealtimeDbData(path: string, data: any) {
  try {
    const dbRef = ref(rtdb, path);
    await set(dbRef, { ...data, updatedAt: Date.now() });
    return { success: true };
  } catch (error: any) {
    console.error(`Realtime DB set error [${path}]:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Push new data to a list in Realtime Database
 */
export async function pushRealtimeDbData(path: string, data: any) {
  try {
    const listRef = ref(rtdb, path);
    const newRef = push(listRef);
    await set(newRef, { ...data, id: newRef.key, createdAt: Date.now() });
    return { success: true, key: newRef.key };
  } catch (error: any) {
    console.error(`Realtime DB push error [${path}]:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Get snapshot from Realtime Database
 */
export async function getRealtimeDbData<T = any>(path: string): Promise<T | null> {
  try {
    const dbRef = ref(rtdb, path);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() as T;
    }
    return null;
  } catch (error) {
    console.error(`Realtime DB get error [${path}]:`, error);
    return null;
  }
}

/**
 * Subscribe to Realtime Database path updates
 */
export function listenRealtimeDbData<T = any>(path: string, onUpdate: (data: T | null) => void) {
  const dbRef = ref(rtdb, path);
  return onValue(
    dbRef,
    (snapshot) => {
      onUpdate(snapshot.exists() ? snapshot.val() : null);
    },
    (error) => {
      console.error(`Realtime DB listener error [${path}]:`, error);
    }
  );
}

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  onSnapshot,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';

export const getCollectionData = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    return results;
  } catch (error) {
    console.warn(`Firestore getCollectionData error for ${collectionName}:`, error);
    return [];
  }
};

export const getDocumentData = async <T>(collectionName: string, id: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.warn(`Firestore getDocumentData error for ${collectionName}/${id}:`, error);
    return null;
  }
};

export const saveDocumentData = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data, { merge: true });
};

export const addDocumentData = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, data);
  return docRef.id;
};

export const deleteDocumentData = async (collectionName: string, id: string): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const subscribeToCollection = <T>(
  collectionName: string,
  callback: (data: T[]) => void
): Unsubscribe => {
  const q = query(collection(db, collectionName));
  return onSnapshot(
    q,
    (snapshot) => {
      const results: T[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });
      callback(results);
    },
    (error) => {
      console.warn(`Firestore real-time subscription error for collection ${collectionName}:`, error);
    }
  );
};

export const subscribeToDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
): Unsubscribe => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.warn(`Firestore real-time subscription error for ${collectionName}/${docId}:`, error);
    }
  );
};


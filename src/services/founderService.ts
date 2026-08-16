import { Founder } from '../types';
import { INITIAL_FOUNDER_DATA } from '../data/mockData';
import { getDocumentData, saveDocumentData, subscribeToDocument } from '../firebase/firestore';

const COLLECTION = 'founder';
const DOC_ID = 'info';

let cachedFounder: Founder = { ...INITIAL_FOUNDER_DATA };

export const getFounderData = async (): Promise<Founder> => {
  try {
    const firestoreData = await getDocumentData<Founder>(COLLECTION, DOC_ID);
    if (firestoreData) {
      cachedFounder = firestoreData;
      return firestoreData;
    }
  } catch (err) {
    console.warn('Using local founder data cache', err);
  }
  return cachedFounder;
};

export const updateFounderData = async (data: Founder): Promise<Founder> => {
  const updated = { ...data, updatedAt: new Date().toISOString() };
  cachedFounder = updated;
  try {
    await saveDocumentData(COLLECTION, DOC_ID, updated);
  } catch (err) {
    console.warn('Firestore update failed, stored locally:', err);
  }
  return updated;
};

export const subscribeToFounderData = (callback: (data: Founder) => void) => {
  return subscribeToDocument<Founder>(COLLECTION, DOC_ID, (data) => {
    if (data) {
      cachedFounder = data;
      callback(data);
    } else {
      callback(cachedFounder);
    }
  });
};


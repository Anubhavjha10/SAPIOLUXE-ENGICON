import { ContactSettings } from '../types';
import { INITIAL_CONTACT_DATA } from '../data/mockData';
import { getDocumentData, saveDocumentData, subscribeToDocument } from '../firebase/firestore';

const COLLECTION = 'contact';
const DOC_ID = 'info';

let cachedContact: ContactSettings = { ...INITIAL_CONTACT_DATA };

export const getContactSettings = async (): Promise<ContactSettings> => {
  try {
    const data = await getDocumentData<ContactSettings>(COLLECTION, DOC_ID);
    if (data) {
      cachedContact = data;
      return data;
    }
  } catch (err) {
    console.warn('Using local contact settings cache', err);
  }
  return cachedContact;
};

export const updateContactSettings = async (data: ContactSettings): Promise<ContactSettings> => {
  const updated = { ...data, updatedAt: new Date().toISOString() };
  cachedContact = updated;
  try {
    await saveDocumentData(COLLECTION, DOC_ID, updated);
  } catch (err) {
    console.warn('Firestore update contact settings failed', err);
  }
  return updated;
};

export const subscribeToContactSettings = (callback: (data: ContactSettings) => void) => {
  return subscribeToDocument<ContactSettings>(COLLECTION, DOC_ID, (data) => {
    if (data) {
      cachedContact = data;
      callback(data);
    } else {
      callback(cachedContact);
    }
  });
};


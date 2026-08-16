import { HomepageContent } from '../types';
import { INITIAL_HOMEPAGE_DATA } from '../data/mockData';
import { getDocumentData, saveDocumentData, subscribeToDocument } from '../firebase/firestore';

const COLLECTION = 'homepage';
const DOC_ID = 'content';

let cachedContent: HomepageContent = { ...INITIAL_HOMEPAGE_DATA };

export const getHomepageContent = async (): Promise<HomepageContent> => {
  try {
    const data = await getDocumentData<HomepageContent>(COLLECTION, DOC_ID);
    if (data) {
      cachedContent = data;
      return data;
    }
  } catch (err) {
    console.warn('Using local homepage content cache', err);
  }
  return cachedContent;
};

export const updateHomepageContent = async (content: HomepageContent): Promise<HomepageContent> => {
  const updated = { ...content, updatedAt: new Date().toISOString() };
  cachedContent = updated;
  try {
    await saveDocumentData(COLLECTION, DOC_ID, updated);
  } catch (err) {
    console.warn('Firestore update homepage content failed', err);
  }
  return updated;
};

export const subscribeToHomepageContent = (callback: (data: HomepageContent) => void) => {
  return subscribeToDocument<HomepageContent>(COLLECTION, DOC_ID, (data) => {
    if (data) {
      cachedContent = data;
      callback(data);
    } else {
      callback(cachedContent);
    }
  });
};


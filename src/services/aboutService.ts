import { AboutPageContent } from '../types';
import { INITIAL_ABOUT_DATA } from '../firebase/seed';
import { getDocumentData, saveDocumentData, subscribeToDocument } from '../firebase/firestore';

const COLLECTION = 'about';
const DOC_ID = 'content';

let cachedAbout: AboutPageContent = { ...INITIAL_ABOUT_DATA };

export const getAboutPageContent = async (): Promise<AboutPageContent> => {
  try {
    const data = await getDocumentData<AboutPageContent>(COLLECTION, DOC_ID);
    if (data) {
      cachedAbout = data;
      return data;
    }
  } catch (err) {
    console.warn('Using local about page cache:', err);
  }
  return cachedAbout;
};

export const updateAboutPageContent = async (content: AboutPageContent): Promise<AboutPageContent> => {
  const updated = { ...content, updatedAt: new Date().toISOString() };
  cachedAbout = updated;
  try {
    await saveDocumentData(COLLECTION, DOC_ID, updated);
  } catch (err) {
    console.warn('Firestore update about content failed:', err);
  }
  return updated;
};

export const subscribeToAboutPageContent = (callback: (data: AboutPageContent) => void) => {
  return subscribeToDocument<AboutPageContent>(COLLECTION, DOC_ID, (data) => {
    if (data) {
      cachedAbout = data;
      callback(data);
    } else {
      callback(cachedAbout);
    }
  });
};

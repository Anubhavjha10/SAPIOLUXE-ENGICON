import { BrandingSettings } from '../types';
import { INITIAL_BRANDING_DATA } from '../firebase/seed';
import { getDocumentData, saveDocumentData, subscribeToDocument } from '../firebase/firestore';

const COLLECTION = 'branding';
const DOC_ID = 'settings';

let cachedBranding: BrandingSettings = { ...INITIAL_BRANDING_DATA };

export const getBrandingSettings = async (): Promise<BrandingSettings> => {
  try {
    const data = await getDocumentData<BrandingSettings>(COLLECTION, DOC_ID);
    if (data) {
      cachedBranding = data;
      return data;
    }
  } catch (err) {
    console.warn('Using local branding cache:', err);
  }
  return cachedBranding;
};

export const updateBrandingSettings = async (settings: BrandingSettings): Promise<BrandingSettings> => {
  const updated = { ...settings, updatedAt: new Date().toISOString() };
  cachedBranding = updated;
  try {
    await saveDocumentData(COLLECTION, DOC_ID, updated);
  } catch (err) {
    console.warn('Firestore update branding settings failed:', err);
  }
  return updated;
};

export const subscribeToBrandingSettings = (callback: (data: BrandingSettings) => void) => {
  return subscribeToDocument<BrandingSettings>(COLLECTION, DOC_ID, (data) => {
    if (data) {
      cachedBranding = data;
      callback(data);
    } else {
      callback(cachedBranding);
    }
  });
};

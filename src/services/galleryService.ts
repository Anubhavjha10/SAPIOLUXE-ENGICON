import { GalleryImage } from '../types';
import { INITIAL_GALLERY_DATA } from '../data/mockData';
import { getCollectionData, saveDocumentData, deleteDocumentData, subscribeToCollection } from '../firebase/firestore';

const COLLECTION = 'gallery';

let cachedGallery: GalleryImage[] = [...INITIAL_GALLERY_DATA];

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const data = await getCollectionData<GalleryImage>(COLLECTION);
    if (data && data.length > 0) {
      cachedGallery = data;
      return cachedGallery;
    }
  } catch (err) {
    console.warn('Using local gallery cache', err);
  }
  return cachedGallery;
};

export const saveGalleryImage = async (img: GalleryImage): Promise<GalleryImage> => {
  const toSave = {
    ...img,
    id: img.id || `gal_${Date.now()}`,
    createdAt: img.createdAt || new Date().toISOString(),
  };

  const idx = cachedGallery.findIndex((item) => item.id === toSave.id);
  if (idx >= 0) {
    cachedGallery[idx] = toSave;
  } else {
    cachedGallery.unshift(toSave);
  }

  try {
    await saveDocumentData(COLLECTION, toSave.id, toSave);
  } catch (err) {
    console.warn('Firestore save gallery image failed', err);
  }
  return toSave;
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  cachedGallery = cachedGallery.filter((item) => item.id !== id);
  try {
    await deleteDocumentData(COLLECTION, id);
  } catch (err) {
    console.warn('Firestore delete gallery image failed', err);
  }
};

export const subscribeToGalleryImages = (callback: (data: GalleryImage[]) => void) => {
  return subscribeToCollection<GalleryImage>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedGallery = data;
      callback(cachedGallery);
    } else {
      callback(cachedGallery);
    }
  });
};


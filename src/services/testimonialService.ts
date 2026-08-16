import { Testimonial } from '../types';
import { INITIAL_TESTIMONIALS_DATA } from '../data/mockData';
import { getCollectionData, saveDocumentData, deleteDocumentData, subscribeToCollection } from '../firebase/firestore';

const COLLECTION = 'testimonials';

let cachedTestimonials: Testimonial[] = [...INITIAL_TESTIMONIALS_DATA];

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const firestoreData = await getCollectionData<Testimonial>(COLLECTION);
    if (firestoreData && firestoreData.length > 0) {
      cachedTestimonials = firestoreData;
      return cachedTestimonials;
    }
  } catch (err) {
    console.warn('Using local testimonials cache', err);
  }
  return cachedTestimonials;
};

export const saveTestimonial = async (t: Testimonial): Promise<Testimonial> => {
  const toSave = {
    ...t,
    id: t.id || `test_${Date.now()}`,
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const idx = cachedTestimonials.findIndex((item) => item.id === toSave.id);
  if (idx >= 0) {
    cachedTestimonials[idx] = toSave;
  } else {
    cachedTestimonials.unshift(toSave);
  }

  try {
    await saveDocumentData(COLLECTION, toSave.id, toSave);
  } catch (err) {
    console.warn('Firestore save testimonial failed', err);
  }
  return toSave;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  cachedTestimonials = cachedTestimonials.filter((item) => item.id !== id);
  try {
    await deleteDocumentData(COLLECTION, id);
  } catch (err) {
    console.warn('Firestore delete testimonial failed', err);
  }
};

export const subscribeToTestimonials = (callback: (data: Testimonial[]) => void) => {
  return subscribeToCollection<Testimonial>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedTestimonials = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(cachedTestimonials);
    } else {
      callback(cachedTestimonials);
    }
  });
};


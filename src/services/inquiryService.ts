import { Inquiry } from '../types';
import { INITIAL_INQUIRIES_DATA } from '../data/mockData';
import { getCollectionData, saveDocumentData, deleteDocumentData, subscribeToCollection } from '../firebase/firestore';

const COLLECTION = 'leads';

let cachedInquiries: Inquiry[] = [...INITIAL_INQUIRIES_DATA];

export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const data = await getCollectionData<Inquiry>(COLLECTION);
    if (data && data.length > 0) {
      cachedInquiries = data;
      return cachedInquiries;
    }
  } catch (err) {
    console.warn('Using local leads cache', err);
  }
  return cachedInquiries;
};

export const submitInquiry = async (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Promise<Inquiry> => {
  const newInquiry: Inquiry = {
    ...inquiry,
    id: `lead_${Date.now()}`,
    status: 'New',
    createdAt: new Date().toISOString().split('T')[0],
    budget: inquiry.budget || inquiry.estimatedBudget || 'Under Consultation',
  };

  cachedInquiries.unshift(newInquiry);

  try {
    await saveDocumentData(COLLECTION, newInquiry.id, newInquiry);
  } catch (err) {
    console.warn('Firestore submit lead failed, saved in memory', err);
  }
  return newInquiry;
};

export const updateInquiryStatus = async (id: string, status: Inquiry['status']): Promise<void> => {
  const idx = cachedInquiries.findIndex((i) => i.id === id);
  if (idx >= 0) {
    cachedInquiries[idx].status = status;
    try {
      await saveDocumentData(COLLECTION, id, cachedInquiries[idx]);
    } catch (err) {
      console.warn('Firestore update lead status failed', err);
    }
  }
};

export const deleteInquiry = async (id: string): Promise<void> => {
  cachedInquiries = cachedInquiries.filter((i) => i.id !== id);
  try {
    await deleteDocumentData(COLLECTION, id);
  } catch (err) {
    console.warn('Firestore delete lead failed', err);
  }
};

export const subscribeToInquiries = (callback: (data: Inquiry[]) => void) => {
  return subscribeToCollection<Inquiry>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedInquiries = data;
      callback(cachedInquiries);
    } else {
      callback(cachedInquiries);
    }
  });
};


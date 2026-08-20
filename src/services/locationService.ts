import { ServiceLocation } from '../types';
import {
  getCollectionData,
  saveDocumentData,
  deleteDocumentData,
  subscribeToCollection,
} from '../firebase/firestore';

const COLLECTION = 'locations';

export const INITIAL_LOCATIONS_DATA: ServiceLocation[] = [
  {
    id: 'loc_odisha',
    name: 'Odisha',
    description: 'Complete turnkey architectural & construction services across Odisha.',
    cities: ['Bhubaneswar', 'Cuttack', 'Baripada', 'Balasore', 'Puri', 'Sambalpur'],
    displayOrder: 1,
    active: true,
  },
  {
    id: 'loc_west_bengal',
    name: 'West Bengal',
    description: 'Premium luxury residential & commercial construction in West Bengal.',
    cities: ['Kolkata', 'Durgapur', 'Siliguri', 'Asansol', 'Kharagpur'],
    displayOrder: 2,
    active: true,
  },
];

let cachedLocations: ServiceLocation[] = [...INITIAL_LOCATIONS_DATA];

export const getLocations = async (): Promise<ServiceLocation[]> => {
  try {
    const data = await getCollectionData<ServiceLocation>(COLLECTION);
    if (data && data.length > 0) {
      cachedLocations = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      return cachedLocations;
    } else {
      // Seed initial data if collection is empty
      for (const item of INITIAL_LOCATIONS_DATA) {
        await saveDocumentData(COLLECTION, item.id, item);
      }
      return INITIAL_LOCATIONS_DATA;
    }
  } catch (err) {
    console.warn('Using local locations fallback cache:', err);
  }
  return cachedLocations;
};

export const saveLocation = async (item: ServiceLocation): Promise<ServiceLocation> => {
  const docId = item.id || `loc_${Date.now()}`;
  const updatedItem: ServiceLocation = {
    ...item,
    id: docId,
    updatedAt: new Date().toISOString(),
  };

  try {
    await saveDocumentData(COLLECTION, docId, updatedItem);
  } catch (err) {
    console.warn('Firestore save location failed:', err);
  }

  const existingIndex = cachedLocations.findIndex((loc) => loc.id === docId);
  if (existingIndex >= 0) {
    cachedLocations[existingIndex] = updatedItem;
  } else {
    cachedLocations.push(updatedItem);
  }
  cachedLocations.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  return updatedItem;
};

export const deleteLocation = async (id: string): Promise<boolean> => {
  try {
    await deleteDocumentData(COLLECTION, id);
    cachedLocations = cachedLocations.filter((loc) => loc.id !== id);
    return true;
  } catch (err) {
    console.warn('Firestore delete location failed:', err);
    return false;
  }
};

export const subscribeToLocations = (callback: (data: ServiceLocation[]) => void) => {
  return subscribeToCollection<ServiceLocation>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedLocations = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      callback(cachedLocations);
    } else {
      callback(cachedLocations);
    }
  });
};

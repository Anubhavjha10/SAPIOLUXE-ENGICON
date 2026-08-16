import { Service } from '../types';
import { INITIAL_SERVICES_DATA } from '../data/mockData';
import { getCollectionData, saveDocumentData, deleteDocumentData, subscribeToCollection } from '../firebase/firestore';

const COLLECTION = 'services';

let cachedServices: Service[] = [...INITIAL_SERVICES_DATA];

export const getServices = async (): Promise<Service[]> => {
  try {
    const firestoreData = await getCollectionData<Service>(COLLECTION);
    if (firestoreData && firestoreData.length > 0) {
      cachedServices = firestoreData.sort((a, b) => a.order - b.order);
      return cachedServices;
    }
  } catch (err) {
    console.warn('Using local services data cache', err);
  }
  return cachedServices;
};

export const saveService = async (service: Service): Promise<Service> => {
  const serviceToSave = {
    ...service,
    id: service.id || `service_${Date.now()}`,
    slug: service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = cachedServices.findIndex((s) => s.id === serviceToSave.id);
  if (existingIndex >= 0) {
    cachedServices[existingIndex] = serviceToSave;
  } else {
    cachedServices.push(serviceToSave);
  }

  try {
    await saveDocumentData(COLLECTION, serviceToSave.id, serviceToSave);
  } catch (err) {
    console.warn('Firestore save service failed, saved in memory', err);
  }
  return serviceToSave;
};

export const deleteService = async (id: string): Promise<void> => {
  cachedServices = cachedServices.filter((s) => s.id !== id);
  try {
    await deleteDocumentData(COLLECTION, id);
  } catch (err) {
    console.warn('Firestore delete service failed', err);
  }
};

export const subscribeToServices = (callback: (data: Service[]) => void) => {
  return subscribeToCollection<Service>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedServices = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(cachedServices);
    } else {
      callback(cachedServices);
    }
  });
};


import { Package } from '../types';
import { INITIAL_PACKAGES_DATA } from '../data/mockData';
import { getCollectionData, getDocumentData, saveDocumentData, deleteDocumentData, subscribeToCollection } from '../firebase/firestore';

const COLLECTION = 'packages';

let cachedPackages: Package[] = [...INITIAL_PACKAGES_DATA];

export const getPackages = async (): Promise<Package[]> => {
  try {
    const firestoreData = await getCollectionData<Package>(COLLECTION);
    if (firestoreData && firestoreData.length > 0) {
      cachedPackages = firestoreData.sort((a, b) => a.order - b.order);
      return cachedPackages;
    }
  } catch (err) {
    console.warn('Using local packages data cache', err);
  }
  return cachedPackages;
};

export const savePackage = async (pkg: Package): Promise<Package> => {
  const pkgToSave = {
    ...pkg,
    id: pkg.id || `package_${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };

  const index = cachedPackages.findIndex((p) => p.id === pkgToSave.id);
  if (index >= 0) {
    cachedPackages[index] = pkgToSave;
  } else {
    cachedPackages.push(pkgToSave);
  }

  try {
    await saveDocumentData(COLLECTION, pkgToSave.id, pkgToSave);

    // If updating a core tier (classic, premium, luxury), sync rate to estimator/config
    if (['classic', 'premium', 'luxury'].includes(pkgToSave.id)) {
      const rate = pkgToSave.ratePerSqFt ?? pkgToSave.pricePerSqFt;
      if (typeof rate === 'number' && rate > 0) {
        try {
          const estDoc = await getDocumentData<any>('estimator', 'config');
          if (estDoc && estDoc.rates) {
            await saveDocumentData('estimator', 'config', {
              ...estDoc,
              rates: {
                ...estDoc.rates,
                [pkgToSave.id]: rate,
              },
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Failed syncing package rate to estimator config', e);
        }
      }
    }
  } catch (err) {
    console.warn('Firestore save package failed, saved locally', err);
  }
  return pkgToSave;
};

export const deletePackage = async (id: string): Promise<void> => {
  cachedPackages = cachedPackages.filter((p) => p.id !== id);
  try {
    await deleteDocumentData(COLLECTION, id);
  } catch (err) {
    console.warn('Firestore delete package failed', err);
  }
};

export const subscribeToPackages = (callback: (data: Package[]) => void) => {
  return subscribeToCollection<Package>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedPackages = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(cachedPackages);
    } else {
      callback(cachedPackages);
    }
  });
};


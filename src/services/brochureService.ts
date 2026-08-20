import { Brochure } from '../types';
import { getCollectionData, saveDocumentData, deleteDocumentData, subscribeToCollection } from '../firebase/firestore';

const COLLECTION = 'brochures';

export const INITIAL_BROCHURES_DATA: Brochure[] = [
  {
    id: 'brochure-1',
    title: 'Residential Construction Brochure',
    description: 'Complete residential construction packages, architectural floor plans & material specifications.',
    driveUrl: 'https://drive.google.com/file/d/1_9j9kL9xZ0y9wP_v5r1M0x5J8_4xZ2b1/view?usp=sharing',
    displayOrder: 1,
    active: true,
  },
  {
    id: 'brochure-2',
    title: 'Commercial & Landmark Fitouts',
    description: 'Detailed corporate office, retail tower & structural engineering capabilities guide.',
    driveUrl: 'https://drive.google.com/file/d/1_9j9kL9xZ0y9wP_v5r1M0x5J8_4xZ2b2/view?usp=sharing',
    displayOrder: 2,
    active: true,
  },
  {
    id: 'brochure-3',
    title: 'Material Quality & Audit Standards',
    description: 'Comprehensive breakdown of 240+ structural inspection checkpoints and material testing protocols.',
    driveUrl: 'https://drive.google.com/file/d/1_9j9kL9xZ0y9wP_v5r1M0x5J8_4xZ2b3/view?usp=sharing',
    displayOrder: 3,
    active: true,
  },
];

let cachedBrochures: Brochure[] = [...INITIAL_BROCHURES_DATA];

export const getBrochures = async (): Promise<Brochure[]> => {
  try {
    const firestoreData = await getCollectionData<Brochure>(COLLECTION);
    if (firestoreData && firestoreData.length > 0) {
      cachedBrochures = firestoreData.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      return cachedBrochures;
    }
  } catch (err) {
    console.warn('Using local brochures cache', err);
  }
  return cachedBrochures;
};

export const saveBrochure = async (brochure: Brochure): Promise<Brochure> => {
  const itemToSave: Brochure = {
    ...brochure,
    id: brochure.id || `brochure_${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };

  const index = cachedBrochures.findIndex((b) => b.id === itemToSave.id);
  if (index >= 0) {
    cachedBrochures[index] = itemToSave;
  } else {
    cachedBrochures.push(itemToSave);
  }

  try {
    await saveDocumentData(COLLECTION, itemToSave.id, itemToSave);
  } catch (err) {
    console.warn('Firestore save brochure failed', err);
  }
  return itemToSave;
};

export const deleteBrochure = async (id: string): Promise<void> => {
  cachedBrochures = cachedBrochures.filter((b) => b.id !== id);
  try {
    await deleteDocumentData(COLLECTION, id);
  } catch (err) {
    console.warn('Firestore delete brochure failed', err);
  }
};

export const subscribeToBrochures = (callback: (data: Brochure[]) => void) => {
  return subscribeToCollection<Brochure>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedBrochures = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      callback(cachedBrochures);
    } else {
      callback(cachedBrochures);
    }
  });
};

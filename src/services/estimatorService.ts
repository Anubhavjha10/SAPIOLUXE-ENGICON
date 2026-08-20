import { EstimatorConfig } from '../types';
import { DEFAULT_ESTIMATOR_CONFIG } from '../utils/estimatorCalculator';
import { getDocumentData, saveDocumentData, subscribeToDocument } from '../firebase/firestore';

const COLLECTION = 'estimator';
const DOC_ID = 'config';

let cachedConfig: EstimatorConfig = { ...DEFAULT_ESTIMATOR_CONFIG };

export const getEstimatorConfig = async (): Promise<EstimatorConfig> => {
  try {
    const data = await getDocumentData<EstimatorConfig>(COLLECTION, DOC_ID);
    if (data) {
      cachedConfig = data;
      return data;
    }
  } catch (err) {
    console.warn('Using local estimator config cache', err);
  }
  return cachedConfig;
};

export const updateEstimatorConfig = async (config: EstimatorConfig): Promise<EstimatorConfig> => {
  const updated = { ...config, updatedAt: new Date().toISOString() };
  cachedConfig = updated;
  try {
    await saveDocumentData(COLLECTION, DOC_ID, updated);

    // Synchronize package rates so both Estimator CMS and Packages CMS reflect the same single source of truth
    if (config.rates) {
      const packageIds: ('classic' | 'premium' | 'luxury')[] = ['classic', 'premium', 'luxury'];
      for (const pkgId of packageIds) {
        const newRate = config.rates[pkgId];
        if (typeof newRate === 'number' && newRate > 0) {
          try {
            const existingPkg = await getDocumentData<any>('packages', pkgId);
            if (existingPkg) {
              await saveDocumentData('packages', pkgId, {
                ...existingPkg,
                pricePerSqFt: newRate,
                ratePerSqFt: newRate,
                updatedAt: new Date().toISOString(),
              });
            }
          } catch (e) {
            console.warn(`Failed to sync rate for package ${pkgId}`, e);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Firestore update estimator config failed', err);
  }
  return updated;
};

export const subscribeToEstimatorConfig = (callback: (data: EstimatorConfig) => void) => {
  return subscribeToDocument<EstimatorConfig>(COLLECTION, DOC_ID, (data) => {
    if (data) {
      cachedConfig = data;
      callback(data);
    } else {
      callback(cachedConfig);
    }
  });
};


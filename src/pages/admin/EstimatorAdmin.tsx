import React, { useState, useEffect } from 'react';
import { getEstimatorConfig, updateEstimatorConfig } from '../../services/estimatorService';
import { EstimatorConfig } from '../../types';
import { Save, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { formatINR } from '../../utils/estimatorCalculator';

export const EstimatorAdmin: React.FC = () => {
  const [config, setConfig] = useState<EstimatorConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getEstimatorConfig().then(setConfig);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    await updateEstimatorConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!config) return <div className="p-8">Loading Estimator Config...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Estimator Engine CMS</h1>
        <p className="font-body-md text-xs text-secondary">
          Configure Base Construction Rates, Floor Multipliers, and Premium Add-ons.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Estimator Config Saved!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface-container-lowest ghost-border p-6 space-y-4">
          <h3 className="font-headline-md text-lg font-bold text-primary">Base Package Rates (₹/sq.ft)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Classic Tier</label>
              <input
                type="number"
                value={config.rates.classic}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    rates: { ...config.rates, classic: Number(e.target.value) },
                  })
                }
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Premium Tier</label>
              <input
                type="number"
                value={config.rates.premium}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    rates: { ...config.rates, premium: Number(e.target.value) },
                  })
                }
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Luxury Tier</label>
              <input
                type="number"
                value={config.rates.luxury}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    rates: { ...config.rates, luxury: Number(e.target.value) },
                  })
                }
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest ghost-border p-6 space-y-4">
          <h3 className="font-headline-md text-lg font-bold text-primary">Floor Area Multipliers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(config.floorMultipliers).map(([floor, mult]) => (
              <div key={floor}>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  Floor {floor}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={mult}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      floorMultipliers: {
                        ...config.floorMultipliers,
                        [floor]: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-8 py-3.5 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors flex items-center gap-2 font-bold"
        >
          <Save className="w-4 h-4" /> Save Estimator Parameters
        </button>
      </form>
    </div>
  );
};

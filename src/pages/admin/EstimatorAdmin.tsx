import React, { useState, useEffect } from 'react';
import { getEstimatorConfig, updateEstimatorConfig } from '../../services/estimatorService';
import { EstimatorConfig, AddOnItem } from '../../types';
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

  const handleUpdateAddOn = (index: number, field: keyof AddOnItem, value: any) => {
    if (!config) return;
    const updatedAddOns = [...(config.addOns || [])];
    updatedAddOns[index] = {
      ...updatedAddOns[index],
      [field]: value,
    };
    setConfig({ ...config, addOns: updatedAddOns });
  };

  const handleAddAddOn = () => {
    if (!config) return;
    const newAddOn: AddOnItem = {
      id: `addon_${Date.now()}`,
      name: 'New Custom Add-on',
      price: 50,
      unit: 'Per Sq.Ft.',
      description: 'Custom premium architectural add-on fitout specification.',
      isDefaultSelected: false,
      active: true,
      quantityBasis: 'builtUpArea',
    };
    setConfig({ ...config, addOns: [...(config.addOns || []), newAddOn] });
  };

  const handleDeleteAddOn = (index: number) => {
    if (!config) return;
    if (window.confirm('Are you sure you want to delete this add-on?')) {
      const updatedAddOns = config.addOns.filter((_, idx) => idx !== index);
      setConfig({ ...config, addOns: updatedAddOns });
    }
  };

  if (!config) return <div className="p-8">Loading Estimator Config...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Estimator Engine CMS</h1>
        <p className="font-body-md text-xs text-secondary">
          Configure Base Construction Rates, Floor Multipliers, and Optional Premium Add-ons.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Estimator Config Saved to Firestore!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Base Package Rates */}
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
                className="w-full bg-surface-container border px-3 py-2 text-sm text-primary"
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
                className="w-full bg-surface-container border px-3 py-2 text-sm text-primary"
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
                className="w-full bg-surface-container border px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>
        </div>

        {/* Floor Multipliers */}
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
                  className="w-full bg-surface-container border px-3 py-2 text-sm text-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Optional Premium Add-ons CMS */}
        <div className="bg-surface-container-lowest ghost-border p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <div>
              <h3 className="font-headline-md text-lg font-bold text-primary">Optional Premium Add-ons</h3>
              <p className="text-xs text-secondary">
                Configure rates and units for optional add-on fitouts. Rates are applied dynamically per sq.ft or as lump sums.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddAddOn}
              className="bg-primary text-on-primary px-4 py-2 text-xs font-label-caps font-bold flex items-center gap-1.5 hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Add-on
            </button>
          </div>

          <div className="space-y-4">
            {(config.addOns || []).map((addon, index) => {
              const unitStr = (addon.unit || '').trim().toLowerCase();
              const isPerSqFt = unitStr.includes('sq') || unitStr.includes('per sq') || unitStr === 'per sq.ft.';
              const displayRate = addon.price > 5000 && isPerSqFt ? Math.round(addon.price / 1500) : addon.price;

              return (
                <div
                  key={addon.id || index}
                  className="bg-surface border border-outline-variant p-4 space-y-3 relative group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="block font-label-caps text-[11px] text-secondary mb-1">
                          Add-on Name
                        </label>
                        <input
                          type="text"
                          value={addon.name || ''}
                          onChange={(e) => handleUpdateAddOn(index, 'name', e.target.value)}
                          className="w-full bg-surface-container border border-outline-variant px-3 py-1.5 text-sm font-semibold text-primary"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-label-caps text-[11px] text-secondary mb-1">
                            Rate {isPerSqFt ? '(₹/sq.ft)' : '(₹ Total)'}
                          </label>
                          <input
                            type="number"
                            value={displayRate}
                            onChange={(e) => handleUpdateAddOn(index, 'price', Number(e.target.value))}
                            className="w-full bg-surface-container border border-outline-variant px-3 py-1.5 text-sm font-mono-technical font-bold text-primary"
                          />
                        </div>

                        <div>
                          <label className="block font-label-caps text-[11px] text-secondary mb-1">
                            Rate Unit
                          </label>
                          <select
                            value={isPerSqFt ? 'Per Sq.Ft.' : 'Lump Sum'}
                            onChange={(e) => handleUpdateAddOn(index, 'unit', e.target.value)}
                            className="w-full bg-surface-container border border-outline-variant px-2 py-1.5 text-xs font-bold text-primary"
                          >
                            <option value="Per Sq.Ft.">Per Sq.Ft.</option>
                            <option value="Lump Sum">Lump Sum</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddOn(index)}
                      className="p-1.5 text-error hover:text-error/80 cursor-pointer mt-5"
                      title="Delete Add-on"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block font-label-caps text-[11px] text-secondary mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={addon.description || ''}
                      onChange={(e) => handleUpdateAddOn(index, 'description', e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant px-3 py-1.5 text-xs text-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-8 py-3.5 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors flex items-center gap-2 font-bold cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Estimator Parameters
        </button>
      </form>
    </div>
  );
};

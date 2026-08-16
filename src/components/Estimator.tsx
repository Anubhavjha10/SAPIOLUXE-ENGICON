import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { EstimatorConfig, EstimatorCalculationInput } from '../types';
import { DEFAULT_ESTIMATOR_CONFIG, calculateEstimate, formatINR } from '../utils/estimatorCalculator';
import { usePackages } from '../hooks/useDataHooks';

interface EstimatorProps {
  config?: EstimatorConfig;
  onOpenConsultationWithEstimate?: (estimateDetails: any) => void;
  showFullDetails?: boolean;
}

export const Estimator: React.FC<EstimatorProps> = ({
  config = DEFAULT_ESTIMATOR_CONFIG,
  onOpenConsultationWithEstimate,
  showFullDetails = false,
}) => {
  const { packages } = usePackages();
  const [plotArea, setPlotArea] = useState<number>(1500);
  const [floorCount, setFloorCount] = useState<'G' | 'G+1' | 'G+2' | 'G+3'>('G+1');
  const [packageId, setPackageId] = useState<'classic' | 'premium' | 'luxury'>('premium');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([
    'modular_kitchen',
    'elevation_design',
    'plan_sanction',
  ]);

  // Construct active config by incorporating Firestore package rates safely
  const activeConfig: EstimatorConfig = useMemo(() => {
    const defaultRates = {
      classic: 1400,
      premium: 1750,
      luxury: 2200,
    };
    const baseRates = {
      ...defaultRates,
      ...(config?.rates || {}),
    };

    if (Array.isArray(packages)) {
      packages.forEach((pkg) => {
        if (pkg && (pkg.id === 'classic' || pkg.id === 'premium' || pkg.id === 'luxury')) {
          const rate = pkg.ratePerSqFt ?? pkg.pricePerSqFt;
          if (typeof rate === 'number' && rate > 0) {
            baseRates[pkg.id as 'classic' | 'premium' | 'luxury'] = rate;
          }
        }
      });
    }

    return {
      rates: baseRates,
      floorMultipliers: config?.floorMultipliers || DEFAULT_ESTIMATOR_CONFIG.floorMultipliers,
      addOns: config?.addOns || DEFAULT_ESTIMATOR_CONFIG.addOns,
    };
  }, [config, packages]);

  const input: EstimatorCalculationInput = useMemo(
    () => ({
      location: 'Bhubaneswar',
      plotArea,
      floorCount,
      packageId,
      selectedAddOnIds,
    }),
    [plotArea, floorCount, packageId, selectedAddOnIds]
  );

  const result = useMemo(() => calculateEstimate(input, activeConfig), [input, activeConfig]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConsultation = () => {
    if (onOpenConsultationWithEstimate) {
      onOpenConsultationWithEstimate(result);
    }
  };

  const classicRate = activeConfig.rates?.classic ?? 1400;
  const premiumRate = activeConfig.rates?.premium ?? 1750;
  const luxuryRate = activeConfig.rates?.luxury ?? 2200;

  return (
    <div className="glass-panel p-6 md:p-8 relative">
      <h3 className="font-headline-md text-headline-md text-primary mb-6 border-b technical-line pb-4 flex justify-between items-center">
        <span>Instant Cost Estimator</span>
        <Calculator className="w-6 h-6 text-tertiary-fixed-dim" />
      </h3>

      <div className="space-y-6">
        {/* Plot Area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-label-caps text-label-caps text-secondary block uppercase tracking-widest">
              Plot Area (Sq.Ft)
            </label>
            <span className="font-mono-technical text-xs text-on-surface-variant font-semibold">
              {plotArea} sq.ft
            </span>
          </div>
          <input
            className="w-full bg-transparent border-0 border-b technical-line font-headline-md text-headline-md text-primary px-0 focus:ring-0 focus:border-tertiary-fixed-dim transition-colors cursor-pointer"
            type="number"
            min={500}
            max={50000}
            step={50}
            value={plotArea}
            onChange={(e) => setPlotArea(Number(e.target.value))}
          />
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={plotArea}
            onChange={(e) => setPlotArea(Number(e.target.value))}
            className="w-full mt-2 accent-tertiary-fixed-dim bg-surface-container h-1 rounded-none cursor-pointer"
          />
        </div>

        {/* Number of Floors */}
        <div>
          <label className="font-label-caps text-label-caps text-secondary block mb-2 uppercase tracking-widest">
            Number of Floors
          </label>
          <div className="grid grid-cols-4 gap-2 p-1 bg-surface-container">
            {(['G', 'G+1', 'G+2', 'G+3'] as const).map((floor) => (
              <button
                key={floor}
                type="button"
                onClick={() => setFloorCount(floor)}
                className={`py-2 font-label-caps text-label-caps transition-all cursor-pointer ${
                  floorCount === floor
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-secondary hover:bg-surface-variant'
                }`}
              >
                {floor}
              </button>
            ))}
          </div>
        </div>

        {/* Package Selector */}
        <div>
          <label className="font-label-caps text-label-caps text-secondary block mb-2 uppercase tracking-widest">
            Construction Package
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'classic', label: 'Classic', rate: classicRate },
              { id: 'premium', label: 'Premium', rate: premiumRate },
              { id: 'luxury', label: 'Luxury', rate: luxuryRate },
            ].map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setPackageId(pkg.id as any)}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  packageId === pkg.id
                    ? 'border-tertiary-fixed-dim bg-primary text-on-primary'
                    : 'border-outline/20 text-on-surface hover:border-outline'
                }`}
              >
                <div className="font-headline-md text-sm font-semibold">{pkg.label}</div>
                <div
                  className={`font-mono-technical text-xs ${
                    packageId === pkg.id ? 'text-tertiary-fixed-dim' : 'text-secondary'
                  }`}
                >
                  ₹{(pkg.rate ?? 0).toLocaleString()}/sq.ft
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons selection (Expanded on Estimator Page or when showFullDetails is true) */}
        {showFullDetails && (
          <div className="pt-4 border-t technical-line">
            <label className="font-label-caps text-label-caps text-secondary block mb-3 uppercase tracking-widest">
              Optional Premium Add-ons
            </label>
            <div className="space-y-2">
              {(activeConfig.addOns || []).map((addon) => {
                const isChecked = selectedAddOnIds.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-3 border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'border-tertiary-fixed-dim bg-surface-container-high/50'
                        : 'border-outline-variant/30 hover:border-outline-variant'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 flex items-center justify-center border ${
                          isChecked
                            ? 'bg-tertiary-fixed-dim border-tertiary-fixed-dim text-tertiary-container'
                            : 'border-outline text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-body-md text-sm font-semibold text-primary">
                          {addon.name}
                        </div>
                        <div className="font-body-md text-xs text-secondary">{addon.description}</div>
                      </div>
                    </div>
                    <div className="font-mono-technical text-xs font-bold text-tertiary-fixed-dim shrink-0 ml-2">
                      +{formatINR(addon.price || 0)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Estimated Budget Display */}
        <div className="pt-6 border-t technical-line mt-6">
          <span className="font-label-caps text-label-caps text-secondary block mb-1 uppercase tracking-widest">
            Estimated Built-up Budget
          </span>
          <div className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-tertiary-fixed-dim font-bold flex items-baseline gap-2">
            <span>₹ {result?.estimatedTotalLakhs || '0.00'}</span>
            <span className="font-headline-md text-xl text-secondary font-normal">Lakhs</span>
          </div>

          <div className="mt-2 text-xs font-mono-technical text-on-surface-variant space-y-1">
            <p>Built-up Area: {(result?.builtUpArea || 0).toLocaleString()} sq.ft ({floorCount} floors)</p>
            <p>Base Construction: {formatINR(result?.baseConstructionCost || 0)}</p>
            {(result?.addOnsTotal || 0) > 0 && (
              <p>Selected Add-ons ({result?.addOnsBreakdown?.length || 0}): +{formatINR(result.addOnsTotal)}</p>
            )}
          </div>

          <p className="font-body-md text-[11px] text-on-surface-variant mt-3 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-tertiary-fixed-dim shrink-0" />
            <span>*100% Fixed Price Lock Commitment with zero hidden escalation clauses.</span>
          </p>

          <button
            type="button"
            onClick={handleConsultation}
            className="w-full mt-6 bg-primary text-on-primary py-4 px-6 font-label-caps text-label-caps hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lock This Estimate & Consult Principal Engineer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};



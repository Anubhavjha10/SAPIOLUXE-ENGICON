import { EstimatorConfig, EstimatorCalculationInput, EstimatorResult } from '../types';

export const DEFAULT_ESTIMATOR_CONFIG: EstimatorConfig = {
  rates: {
    classic: 1400,
    premium: 1750,
    luxury: 2200,
  },
  floorMultipliers: {
    'G': 1,
    'G+1': 2,
    'G+2': 3,
    'G+3': 4,
  },
  addOns: [
    {
      id: 'compound_wall',
      name: 'Compound Wall & Gate',
      price: 80, // ₹80 / sq.ft
      unit: 'Per Sq.Ft.',
      description: 'RCC boundary wall with heavy forged iron security gate.',
      isDefaultSelected: false,
      quantityBasis: 'plotArea',
    },
    {
      id: 'modular_kitchen',
      name: 'Modular Kitchen Fitout',
      price: 120, // ₹120 / sq.ft
      unit: 'Per Sq.Ft.',
      description: 'Acrylic high-gloss modular cabinets with soft-close hardware.',
      isDefaultSelected: true,
      quantityBasis: 'builtUpArea',
    },
    {
      id: 'elevation_design',
      name: '3D Front Elevation Design',
      price: 50, // ₹50 / sq.ft
      unit: 'Per Sq.Ft.',
      description: 'Custom architectural 3D rendering & structural detailing.',
      isDefaultSelected: true,
      quantityBasis: 'builtUpArea',
    },
    {
      id: 'borewell_tank',
      name: 'Borewell & Water Tank',
      price: 65, // ₹65 / sq.ft
      unit: 'Per Sq.Ft.',
      description: 'Deep subterranean water drilling + 2000L RCC storage tank.',
      isDefaultSelected: false,
      quantityBasis: 'plotArea',
    },
    {
      id: 'false_ceiling',
      name: 'False Ceiling & LED Fitments',
      price: 100, // ₹100 / sq.ft
      unit: 'Per Sq.Ft.',
      description: 'Gypsum designer ceiling with ambient warm COB spotlights.',
      isDefaultSelected: false,
      quantityBasis: 'builtUpArea',
    },
    {
      id: 'plan_sanction',
      name: 'Plan Sanction & Approval',
      price: 25, // ₹25 / sq.ft
      unit: 'Per Sq.Ft.',
      description: 'Complete municipal clearance & BDA/CMC/KMC sanction filing.',
      isDefaultSelected: true,
      quantityBasis: 'builtUpArea',
    },
  ],
};

/**
 * Calculates the total construction estimate based on plot area, floor count, package, and add-ons.
 */
export function calculateEstimate(
  input: EstimatorCalculationInput,
  config: EstimatorConfig = DEFAULT_ESTIMATOR_CONFIG
): EstimatorResult {
  const { plotArea, floorCount, packageId, selectedAddOnIds } = input;

  const validPlotArea = Math.max(100, Math.min(100000, plotArea || 0));
  const floorMultiplier = config.floorMultipliers[floorCount] || 1;
  const builtUpArea = validPlotArea * floorMultiplier;

  const ratesRecord = config.rates as Record<string, number>;
  const ratePerSqFt = ratesRecord[packageId] || config.rates.premium || 1750;
  const baseConstructionCost = builtUpArea * ratePerSqFt;

  const addOnsBreakdown: { id: string; name: string; rate: number; unit: string; quantity: number; cost: number }[] = [];
  let addOnsTotal = 0;

  selectedAddOnIds.forEach((addonId) => {
    const addon = config.addOns.find((item) => item.id === addonId);
    if (addon && addon.active !== false) {
      const unitStr = (addon.unit || '').trim().toLowerCase();
      const isPerSqFt = unitStr.includes('sq') || unitStr.includes('per sq') || unitStr === 'per sq.ft.';
      
      let quantity = 1;
      let effectiveRate = addon.price;

      if (isPerSqFt) {
        // If legacy high price was saved (e.g. 120000), derive per sq.ft rate based on 1500 sq.ft baseline
        if (effectiveRate > 5000) {
          effectiveRate = Math.round(effectiveRate / 1500);
        }
        
        // Dynamic quantity calculation based on area & add-on type
        if (addon.quantityBasis === 'plotArea' || addon.id === 'compound_wall' || addon.id === 'borewell_tank') {
          quantity = validPlotArea;
        } else {
          quantity = builtUpArea;
        }
      }

      const cost = Math.round(quantity * effectiveRate);

      addOnsBreakdown.push({
        id: addon.id,
        name: addon.name,
        rate: effectiveRate,
        unit: addon.unit || (isPerSqFt ? 'Per Sq.Ft.' : 'Lump Sum'),
        quantity,
        cost,
      });
      addOnsTotal += cost;
    }
  });

  const estimatedTotalBudget = baseConstructionCost + addOnsTotal;
  const estimatedTotalLakhs = (estimatedTotalBudget / 100000).toFixed(2);

  return {
    plotArea: validPlotArea,
    floorCount,
    builtUpArea,
    ratePerSqFt,
    baseConstructionCost,
    addOnsBreakdown,
    addOnsTotal,
    locationAdjustment: 0,
    estimatedTotalBudget,
    estimatedTotalLakhs,
    categoryBreakdown: [],
  };
}

/**
 * Formats a number to INR currency string (e.g., ₹ 44,90,000)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

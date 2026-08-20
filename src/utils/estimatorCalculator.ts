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
      price: 120000, // +₹1.2L
      unit: 'Fixed',
      description: 'RCC boundary wall with heavy forged iron security gate.',
      isDefaultSelected: false,
    },
    {
      id: 'modular_kitchen',
      name: 'Modular Kitchen Fitout',
      price: 180000, // +₹1.8L
      unit: 'Fixed',
      description: 'Acrylic high-gloss modular cabinets with soft-close hardware.',
      isDefaultSelected: true,
    },
    {
      id: 'elevation_design',
      name: '3D Front Elevation Design',
      price: 75000, // +₹75k
      unit: 'Fixed',
      description: 'Custom architectural 3D rendering & structural detailing.',
      isDefaultSelected: true,
    },
    {
      id: 'borewell_tank',
      name: 'Borewell & Water Tank',
      price: 95000, // +₹95k
      unit: 'Fixed',
      description: 'Deep subterranean water drilling + 2000L RCC storage tank.',
      isDefaultSelected: false,
    },
    {
      id: 'false_ceiling',
      name: 'False Ceiling & LED Fitments',
      price: 150000, // +₹1.5L
      unit: 'Fixed',
      description: 'Gypsum designer ceiling with ambient warm COB spotlights.',
      isDefaultSelected: false,
    },
    {
      id: 'plan_sanction',
      name: 'Plan Sanction & Approval',
      price: 35000, // +₹35k
      unit: 'Fixed',
      description: 'Complete municipal clearance & BDA/CMC/KMC sanction filing.',
      isDefaultSelected: true,
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

  const addOnsBreakdown: { id: string; name: string; cost: number }[] = [];
  let addOnsTotal = 0;

  selectedAddOnIds.forEach((addonId) => {
    const addon = config.addOns.find((item) => item.id === addonId);
    if (addon) {
      addOnsBreakdown.push({
        id: addon.id,
        name: addon.name,
        cost: addon.price,
      });
      addOnsTotal += addon.price;
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

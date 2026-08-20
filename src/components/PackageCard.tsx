import React from 'react';
import { Check, Shield, Wrench } from 'lucide-react';
import { Package } from '../types';
import { formatINR } from '../utils/estimatorCalculator';

interface PackageCardProps {
  pkg: Package;
  onSelectPackage?: (pkgId: string) => void;
  isSelected?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelectPackage, isSelected }) => {
  const isHighlighted = pkg.id === 'premium' || pkg.isPopular || isSelected;

  const rawWarranty = pkg.structuralWarranty || '20 Years';
  const warrantyDisplay = rawWarranty.toLowerCase().includes('warranty')
    ? rawWarranty
    : `${rawWarranty} Structural Warranty`;

  const rawMaintenance = pkg.freeMaintenance || '1 Year Free Maintenance';
  const maintenanceDisplay = rawMaintenance.toLowerCase().includes('maintenance')
    ? rawMaintenance
    : `${rawMaintenance} Free Maintenance`;

  return (
    <div
      className={`glass-panel p-6 flex flex-col justify-between min-h-[320px] transition-all duration-300 ${
        isHighlighted
          ? 'border border-[#E9B84F] shadow-[0_10px_30px_rgba(112,82,200,0.35)] transform md:-translate-y-4 relative z-10'
          : 'bg-surface/80 text-on-background border border-outline-variant/30'
      }`}
      style={
        isHighlighted
          ? { background: 'linear-gradient(145deg, #30246B 0%, #18234F 100%)' }
          : undefined
      }
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <span
            className={`font-label-caps text-label-caps block uppercase tracking-widest ${
              isHighlighted ? 'text-white/80 font-semibold' : 'text-secondary'
            }`}
          >
            {pkg.tier}
          </span>
          {pkg.isPopular && (
            <span className="px-2.5 py-1 text-[10px] font-label-caps bg-[#E9B84F] text-[#18234F] uppercase tracking-wider font-bold shadow-sm">
              MOST POPULAR
            </span>
          )}
        </div>
        <h3
          className={`font-headline-md text-headline-md mb-1 font-bold ${
            isHighlighted ? 'text-white' : 'text-primary'
          }`}
        >
          {pkg.name}
        </h3>
        <p
          className={`font-mono-technical text-mono-technical font-bold ${
            isHighlighted ? 'text-[#F2C15A]' : 'text-on-surface-variant'
          }`}
        >
          {formatINR(pkg.pricePerSqFt)} / sq.ft
        </p>
      </div>

      <p className={`font-body-md text-xs mt-3 ${isHighlighted ? 'text-white/80' : 'text-secondary'}`}>
        {pkg.tagline}
      </p>

      {/* Prominent Package Benefits Box */}
      <div
        className={`mt-4 p-3 rounded space-y-2 text-xs font-bold ${
          isHighlighted
            ? 'bg-white/10 text-[#F2C15A] border border-white/15'
            : 'bg-surface-container/70 text-primary border border-outline-variant/40'
        }`}
      >
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 shrink-0 ${isHighlighted ? 'text-[#F2C15A]' : 'text-tertiary-fixed-dim'}`} />
          <span>{warrantyDisplay}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wrench className={`w-4 h-4 shrink-0 ${isHighlighted ? 'text-[#F2C15A]' : 'text-tertiary-fixed-dim'}`} />
          <span>{maintenanceDisplay}</span>
        </div>
      </div>

      <ul
        className={`font-body-md text-[14px] space-y-2 flex-grow border-t pt-3 mt-4 ${
          isHighlighted ? 'border-white/15 text-white' : 'technical-line text-on-surface-variant'
        }`}
      >
        {pkg.features.slice(0, 4).map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs">
            <Check
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                isHighlighted ? 'text-[#F2C15A]' : 'text-tertiary-fixed-dim'
              }`}
            />
            <span className={isHighlighted ? 'text-white/90 font-medium' : ''}>{feature}</span>
          </li>
        ))}
      </ul>

      {onSelectPackage && (
        <button
          onClick={() => onSelectPackage(pkg.id)}
          className={`w-full mt-6 py-3 px-4 font-label-caps text-label-caps transition-all text-center font-bold cursor-pointer shadow-md ${
            isHighlighted
              ? 'bg-[#E9B84F] text-[#18234F] hover:bg-white hover:text-[#18234F]'
              : 'bg-primary text-on-primary hover:bg-tertiary-fixed-dim hover:text-tertiary-container'
          }`}
        >
          Select {pkg.name} Package
        </button>
      )}
    </div>
  );
};

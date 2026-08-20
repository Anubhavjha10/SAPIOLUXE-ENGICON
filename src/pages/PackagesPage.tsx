import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PackageCard } from '../components/PackageCard';
import { CTASection } from '../components/CTASection';
import { usePackages } from '../hooks/useDataHooks';
import { formatINR } from '../utils/estimatorCalculator';

export const PackagesPage: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const { packages } = usePackages();

  // Filter published packages & sort by display order
  const sortedPackages = useMemo(() => {
    return [...packages]
      .filter((pkg) => pkg.isPublished !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [packages]);

  // Aggregate all unique material specification names across all packages
  const materialSpecNames = useMemo(() => {
    const namesSet = new Set<string>();
    sortedPackages.forEach((pkg) => {
      (pkg.materialSpecs || []).forEach((spec) => {
        if (spec.name && spec.name.trim()) {
          namesSet.add(spec.name.trim());
        }
      });
    });
    return Array.from(namesSet);
  }, [sortedPackages]);

  return (
    <div className="w-full py-12">
      {/* Header */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <div className="border-b technical-line pb-6">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Construction Tiers & Material Specifications
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary font-bold mb-4">
            Curated Material Packages
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Transparent sq.ft rate cards with zero hidden costs. Choose the tier that matches your architectural vision and lifestyle standards.
          </p>
        </div>
      </div>

      {/* Package Cards Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {sortedPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onSelectPackage={onOpenConsultation} />
          ))}
        </div>
      </section>

      {/* Dynamic Side-by-Side Material Comparison Matrix */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="mb-8 border-b technical-line pb-4 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
              Side-by-Side Matrix
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
              Material Specifications Comparison
            </h2>
          </div>
        </div>

        <div className="bg-surface ghost-border overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-primary text-on-primary font-label-caps text-xs uppercase tracking-widest border-b border-outline-variant">
                <th className="p-4 font-bold">Material Specification</th>
                {sortedPackages.map((pkg) => (
                  <th
                    key={pkg.id}
                    className={`p-4 font-bold text-center ${
                      pkg.isPopular ? 'text-tertiary-fixed-dim font-bold bg-[#E9B84F]/10' : ''
                    }`}
                  >
                    {pkg.name} ({formatINR(pkg.pricePerSqFt)}/sq.ft)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-body-md text-xs divide-y divide-outline-variant/30">
              {/* Row 1: Price per Sq.Ft */}
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-bold text-primary">Price per Sq.Ft</td>
                {sortedPackages.map((pkg) => (
                  <td
                    key={pkg.id}
                    className={`p-4 text-center font-bold font-mono-technical ${
                      pkg.isPopular ? 'text-tertiary-fixed-dim bg-tertiary-fixed/10' : 'text-primary'
                    }`}
                  >
                    {formatINR(pkg.pricePerSqFt)} / sq.ft
                  </td>
                ))}
              </tr>

              {/* Row 2: Structural Warranty */}
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-bold text-primary">Structural Warranty</td>
                {sortedPackages.map((pkg) => (
                  <td
                    key={pkg.id}
                    className={`p-4 text-center font-medium ${
                      pkg.isPopular ? 'text-primary font-semibold bg-tertiary-fixed/10' : 'text-on-surface-variant'
                    }`}
                  >
                    {pkg.structuralWarranty || '20 Years'}
                  </td>
                ))}
              </tr>

              {/* Row 3: Free Maintenance */}
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-4 font-bold text-primary">Free Maintenance</td>
                {sortedPackages.map((pkg) => (
                  <td
                    key={pkg.id}
                    className={`p-4 text-center font-medium ${
                      pkg.isPopular ? 'text-primary font-semibold bg-tertiary-fixed/10' : 'text-on-surface-variant'
                    }`}
                  >
                    {pkg.freeMaintenance || '1 Year Free Maintenance'}
                  </td>
                ))}
              </tr>

              {/* Dynamic Auto-Generated Material Specification Rows */}
              {materialSpecNames.map((specName, idx) => (
                <tr key={idx} className="hover:bg-surface-container/50 transition-colors">
                  <td className="p-4 font-bold text-primary">{specName}</td>
                  {sortedPackages.map((pkg) => {
                    const match = pkg.materialSpecs?.find(
                      (s) => s.name?.trim().toLowerCase() === specName.toLowerCase()
                    );
                    return (
                      <td
                        key={pkg.id}
                        className={`p-4 text-center ${
                          pkg.isPopular ? 'text-primary font-semibold bg-tertiary-fixed/10' : 'text-on-surface-variant'
                        }`}
                      >
                        {match?.value || '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CTASection onOpenConsultation={onOpenConsultation} />
    </div>
  );
};

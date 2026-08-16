import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PackageCard } from '../components/PackageCard';
import { CTASection } from '../components/CTASection';
import { getPackages } from '../services/packageService';
import { Package } from '../types';
import { Check, X, Shield, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/estimatorCalculator';

export const PackagesPage: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  const comparisonRows = [
    { label: 'Structural Steel', classic: 'Tata Tiscon Fe550D', premium: 'Tata Tiscon Super-D', luxury: 'Primary Jindal / Tata Panther' },
    { label: 'Cement Grade', classic: 'UltraTech / Dalmia 43 Grade', premium: 'UltraTech Super / ACC Gold', luxury: 'UltraTech Weather Plus' },
    { label: 'Flooring Spec', classic: 'Vitrified 4x2 Tiles', premium: 'Italian Marble / Glazed 6x3', luxury: 'Bespoke Botticino Italian' },
    { label: 'Sanitary & Fittings', classic: 'Jaquar / Cera Standard', premium: 'Kohler Wall-Hung & Grohe', luxury: 'Toto Smart Toilets & Hansgrohe' },
    { label: 'Smart Home Wiring', classic: 'Essential Conduit Wiring', premium: 'Smart Home Ready (IoT)', luxury: 'Schneider KNX Full Automation' },
    { label: 'Paint & Finishes', classic: 'Asian Paints Apex Exterior', premium: 'Asian Paints Royale Luxury', luxury: 'PU & Venetian Stucco Plaster' },
    { label: 'Structural Warranty', classic: '10 Years', premium: '20 Years + 5-Yr Free Maint.', luxury: 'Lifetime Structural Guarantee' },
  ];

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
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onSelectPackage={onOpenConsultation} />
          ))}
        </div>
      </section>

      {/* Detailed Material Comparison Matrix */}
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
                <th className="p-4 font-bold text-center">Classic (₹1,400/sq.ft)</th>
                <th className="p-4 font-bold text-center text-tertiary-fixed-dim">Premium (₹1,750/sq.ft)</th>
                <th className="p-4 font-bold text-center">Luxury (₹2,200/sq.ft)</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-xs divide-y divide-outline-variant/30">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container/50 transition-colors">
                  <td className="p-4 font-bold text-primary">{row.label}</td>
                  <td className="p-4 text-center text-on-surface-variant">{row.classic}</td>
                  <td className="p-4 text-center text-primary font-semibold bg-tertiary-fixed/10">
                    {row.premium}
                  </td>
                  <td className="p-4 text-center text-primary font-bold">{row.luxury}</td>
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

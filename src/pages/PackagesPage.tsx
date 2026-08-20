import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PackageCard } from '../components/PackageCard';
import { CTASection } from '../components/CTASection';
import { usePackages, useBrochures } from '../hooks/useDataHooks';
import { Brochure } from '../types';
import { formatINR } from '../utils/estimatorCalculator';
import { getDrivePreviewUrl, getDriveDownloadUrl } from '../utils/driveUrlHelper';
import { FileText, Eye, Download, X } from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const { packages } = usePackages();
  const { brochures } = useBrochures();

  const [previewBrochure, setPreviewBrochure] = useState<Brochure | null>(null);

  // Filter published packages & sort by display order
  const sortedPackages = useMemo(() => {
    return [...packages]
      .filter((pkg) => pkg.isPublished !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [packages]);

  // Filter active brochures & sort by display order
  const activeBrochures = useMemo(() => {
    return [...brochures]
      .filter((b) => b.active !== false)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [brochures]);

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

      {/* Downloadable Brochures Section */}
      {activeBrochures.length > 0 && (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
          <div className="mb-8 border-b technical-line pb-4 flex justify-between items-end">
            <div>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
                Documentation & Specification Guides
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
                Download Our Brochures
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {activeBrochures.map((brochure) => (
              <div
                key={brochure.id}
                className="bg-surface ghost-border p-6 flex flex-col justify-between hover:border-tertiary-fixed-dim/50 transition-all group shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <FileText className="w-6 h-6 text-tertiary-fixed-dim group-hover:text-tertiary-fixed-dim" />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg font-bold text-primary mb-1">
                      {brochure.title}
                    </h3>
                    {brochure.description && (
                      <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                        {brochure.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t technical-line mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPreviewBrochure(brochure)}
                    className="flex-1 bg-surface-container border border-outline-variant hover:border-primary text-primary py-2.5 px-4 font-label-caps text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-4 h-4 text-tertiary-fixed-dim" />
                    <span>View</span>
                  </button>
                  <a
                    href={getDriveDownloadUrl(brochure.driveUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex-1 bg-primary text-on-primary hover:bg-tertiary-fixed-dim hover:text-tertiary-container py-2.5 px-4 font-label-caps text-xs font-bold flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ↓</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PDF Viewer Modal */}
      {previewBrochure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-outline-variant w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="p-4 bg-primary text-on-primary flex justify-between items-center border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-tertiary-fixed-dim" />
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-primary">
                    {previewBrochure.title}
                  </h3>
                  <p className="font-body-md text-xs text-surface-variant hidden sm:block">
                    Interactive PDF Document Viewer
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={getDriveDownloadUrl(previewBrochure.driveUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="bg-tertiary-fixed-dim text-tertiary-container px-3.5 py-1.5 font-label-caps text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewBrochure(null)}
                  className="p-1.5 text-surface-variant hover:text-on-primary rounded-sm transition-colors cursor-pointer"
                  aria-label="Close document preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body: Google Drive Preview iframe */}
            <div className="flex-1 bg-surface-container-lowest relative overflow-hidden">
              <iframe
                src={getDrivePreviewUrl(previewBrochure.driveUrl)}
                className="w-full h-full border-0"
                title={previewBrochure.title}
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}

      <CTASection onOpenConsultation={onOpenConsultation} />
    </div>
  );
};

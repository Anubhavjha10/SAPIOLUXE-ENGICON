import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ServiceCard } from '../components/ServiceCard';
import { CTASection } from '../components/CTASection';
import { useServices } from '../hooks/useDataHooks';

export const ServicesPage: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const { services } = useServices();

  return (
    <div className="w-full py-12">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <div className="border-b technical-line pb-6">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            End-to-End Civil & Architectural Expertise
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary font-bold mb-4">
            Turnkey Services
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            From initial BIM structural modeling and soil testing to bespoke villa construction and luxury interior fitouts across Odisha.
          </p>
        </div>
      </div>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} onSelectService={onOpenConsultation} />
          ))}
        </div>
      </section>

      <CTASection onOpenConsultation={onOpenConsultation} />
    </div>
  );
};

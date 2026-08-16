import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FounderSection } from '../components/FounderSection';
import { StatsSection } from '../components/StatsSection';
import { CTASection } from '../components/CTASection';
import { getFounderData } from '../services/founderService';
import { Founder } from '../types';
import { ShieldCheck, Award, Layers, Milestone } from 'lucide-react';

export const About: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [founder, setFounder] = useState<Founder | null>(null);

  useEffect(() => {
    getFounderData().then(setFounder);
  }, []);

  const timelineMilestones = [
    { year: '2006', title: 'Foundation Laid', desc: 'Established in Bhubaneswar as a boutique structural engineering consultancy.' },
    { year: '2012', title: 'Commercial Expansion', desc: 'Delivered initial landmark 10-story corporate headquarters in Infocity.' },
    { year: '2018', title: 'Ultra-Luxury Residential Launch', desc: 'Introduced fixed-price contract modeling and 240+ point quality audits.' },
    { year: '2024', title: 'Odisha Leadership', desc: 'Surpassed 50+ flagship completed landmarks with 100% on-time delivery record.' },
  ];

  return (
    <div className="w-full py-12">
      {/* About Leadership Hero */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16">
        <div className="border-b technical-line pb-8">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-3 block">
            Architectural Heritage & Leadership
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary font-bold mb-6">
            Engineering Unshakable Permanence.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Sapioluxe Engicon was founded on a simple premise: civil engineering should combine heavy structural durability with refined editorial luxury. We eliminate ambiguity through fixed-price transparency and rigorous charter engineering.
          </p>
        </div>
      </section>

      {/* Founder Desk Section */}
      {founder && <FounderSection founder={founder} />}

      {/* Core Engineering Pillars */}
      <section className="bg-surface-container py-section-gap w-full px-margin-mobile md:px-margin-desktop mb-section-gap border-t border-b technical-line">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
              Our Core Philosophy
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
              The Four Pillars of Sapioluxe
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="bg-surface p-6 ghost-border space-y-3">
              <ShieldCheck className="w-8 h-8 text-tertiary-fixed-dim" />
              <h3 className="font-headline-md text-lg font-bold text-primary">Structural Integrity</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Earthquake-resistant RCC design exceeding IS 456 & 1893 seismic codes for Eastern India.
              </p>
            </div>

            <div className="bg-surface p-6 ghost-border space-y-3">
              <Award className="w-8 h-8 text-tertiary-fixed-dim" />
              <h3 className="font-headline-md text-lg font-bold text-primary">240-Point Audits</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Independent milestone inspections covering foundation compaction, rebar density, and concrete curing.
              </p>
            </div>

            <div className="bg-surface p-6 ghost-border space-y-3">
              <Layers className="w-8 h-8 text-tertiary-fixed-dim" />
              <h3 className="font-headline-md text-lg font-bold text-primary">Fixed Price Lock</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Legally binding cost modeling with guaranteed zero escalations on steel, cement, or material rates.
              </p>
            </div>

            <div className="bg-surface p-6 ghost-border space-y-3">
              <Milestone className="w-8 h-8 text-tertiary-fixed-dim" />
              <h3 className="font-headline-md text-lg font-bold text-primary">On-Time Handover</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Structured Primavera scheduling ensuring timely project completion with daily client video updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sapioluxe Quality Standards Dark Section */}
      <StatsSection />

      {/* Timeline / Evolution Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="mb-12 border-b technical-line pb-4 text-center">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Firm Evolution
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Milestones of Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          {timelineMilestones.map((m, idx) => (
            <div key={idx} className="border-l-2 border-tertiary-fixed-dim pl-6 py-2 space-y-2">
              <span className="font-mono-technical text-2xl font-bold text-tertiary-fixed-dim block">
                {m.year}
              </span>
              <h4 className="font-headline-md text-base font-bold text-primary">{m.title}</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <CTASection onOpenConsultation={onOpenConsultation} />
    </div>
  );
};

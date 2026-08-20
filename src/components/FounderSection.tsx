import React from 'react';
import { Quote } from 'lucide-react';
import { Founder } from '../types';
import { useFounder } from '../hooks/useDataHooks';

interface FounderSectionProps {
  founder?: Founder;
}

export const FounderSection: React.FC<FounderSectionProps> = ({
  founder: propFounder,
}) => {
  const { founder: hookFounder } = useFounder();
  const founder = propFounder || hookFounder;

  if (!founder) return null;
  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        {/* Left Column: Founder Desk Text */}
        <div className="md:col-span-6 order-2 md:order-1">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-4 block">
            The Founder's Desk
          </span>
          <blockquote className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight mb-8">
            "{founder.quote}"
          </blockquote>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
            {founder.bio}
          </p>

          <div className="space-y-3 mb-8 border-t technical-line pt-6">
            {founder.specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-3 text-sm font-body-md text-on-surface">
                <div className="w-1.5 h-1.5 bg-tertiary-fixed-dim shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 border-t technical-line pt-6">
            <div>
              <h4 className="font-headline-md text-[20px] font-bold text-primary">{founder.name}</h4>
              <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
                {founder.title}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Editorial Portrait */}
        <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 mb-8 md:mb-0">
          <div className="relative w-full aspect-[4/5] bg-surface-variant overflow-hidden ghost-border group">
            <img
              src={founder.image}
              alt={founder.name}
              className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95] group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            {/* Quote Icon Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex justify-between items-end">
              <div>
                <span className="font-mono-technical text-xs text-tertiary-fixed-dim tracking-widest block uppercase">
                  LEADERSHIP & STRUCTURAL INTEGRITY
                </span>
                <span className="font-headline-md text-white font-bold">{founder.name}</span>
              </div>
              <Quote className="w-12 h-12 text-tertiary-fixed-dim opacity-40 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

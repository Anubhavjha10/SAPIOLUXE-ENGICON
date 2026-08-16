import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelectService?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectService }) => {
  return (
    <div
      onClick={() => onSelectService && onSelectService(service)}
      className="group cursor-pointer bg-surface/60 border border-outline-variant/30 hover:border-tertiary-fixed-dim transition-all duration-300 p-6 flex flex-col justify-between"
    >
      <div>
        <div className="w-full aspect-[16/9] bg-surface-variant mb-6 overflow-hidden relative">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-md px-3 py-1 text-[10px] font-label-caps text-tertiary-fixed-dim uppercase tracking-widest">
            {service.category}
          </div>
        </div>

        <h3 className="font-headline-md text-[22px] font-bold text-primary mb-2 group-hover:text-tertiary-fixed-dim transition-colors">
          {service.title}
        </h3>
        <p className="font-body-md text-secondary text-xs mb-4 font-medium">
          {service.subtitle}
        </p>

        <p className="font-body-md text-on-surface-variant text-sm mb-6 line-clamp-3">
          {service.description}
        </p>

        {service.features && (
          <ul className="space-y-2 mb-6 border-t technical-line pt-4">
            {service.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-on-surface">
                <CheckCircle2 className="w-3.5 h-3.5 text-tertiary-fixed-dim shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between items-center border-t technical-line pt-4 mt-auto">
        <span className="font-mono-technical text-xs text-secondary">
          {service.startingPrice || 'Custom Quotation'}
        </span>
        <span className="font-label-caps text-xs text-primary group-hover:text-tertiary-fixed-dim flex items-center gap-1 font-semibold transition-colors">
          Learn More <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="glass-panel p-8 flex flex-col justify-between relative h-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex text-tertiary-fixed-dim">
            {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <Quote className="w-8 h-8 text-secondary opacity-30" />
        </div>

        <p className="font-body-md text-on-surface-variant text-sm italic leading-relaxed mb-4">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="pt-4 border-t technical-line mt-auto">
        <h4 className="font-headline-md text-base font-bold text-primary">{testimonial.author}</h4>
        <p className="font-label-caps text-xs text-secondary">{testimonial.role}</p>
        <p className="font-mono-technical text-[11px] text-tertiary-fixed-dim mt-1">
          {testimonial.location} {testimonial.projectRef && `• ${testimonial.projectRef}`}
        </p>
      </div>
    </div>
  );
};

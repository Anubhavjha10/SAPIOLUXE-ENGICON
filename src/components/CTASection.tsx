import React from 'react';

interface CTASectionProps {
  onOpenConsultation?: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onOpenConsultation,
  title = "Let's Build Something That Lasts.",
  subtitle = "Schedule a complimentary consultation with our principal engineers to discuss your vision, site blueprints, and budget modeling.",
  buttonText = "Request a Consultation",
}) => {
  return (
    <section className="bg-surface-container py-section-gap w-full px-margin-mobile md:px-margin-desktop text-center border-t border-b technical-line">
      <div className="max-w-3xl mx-auto">
        <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-4 block">
          Start Your Project
        </span>
        <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary mb-8 font-bold">
          {title}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
          {subtitle}
        </p>
        <button
          onClick={onOpenConsultation}
          className="bg-primary text-on-primary px-10 py-5 font-label-caps text-label-caps hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all duration-300 shadow-md"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};

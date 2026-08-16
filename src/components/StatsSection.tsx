import React from 'react';

export const StatsSection: React.FC = () => {
  const standards = [
    {
      num: '01',
      title: 'Structural Safety',
      desc: 'Earthquake-resistant designs engineered beyond standard codes, ensuring absolute safety for generations.',
    },
    {
      num: '02',
      title: 'Fixed Price Lock',
      desc: 'Transparent cost modeling with zero hidden escalations. The price we quote is the price you pay.',
    },
    {
      num: '03',
      title: '240+ Quality Audits',
      desc: 'Rigorous multi-point inspections at every major construction milestone by independent quality assurance engineers.',
    },
    {
      num: '04',
      title: 'Premium Material Sourcing',
      desc: 'Direct procurement from top-tier manufacturers ensuring authenticity and superior longevity of finishes.',
    },
    {
      num: '05',
      title: 'On-Time Delivery Guarantee',
      desc: 'Advanced project management methodologies ensuring strict adherence to timelines without compromising quality.',
    },
    {
      num: '06',
      title: 'Lifetime Support',
      desc: 'Comprehensive warranty coverage and dedicated post-handover maintenance services for complete peace of mind.',
    },
  ];

  return (
    <section className="bg-primary text-on-primary py-section-gap w-full px-margin-mobile md:px-margin-desktop mb-section-gap">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-[0.2em] mb-4 block">
            The Sapioluxe Standard
          </span>
          <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-primary font-bold">
            Uncompromising Quality
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-gutter gap-y-16">
          {standards.map((item, idx) => (
            <div
              key={idx}
              className={`relative ${
                idx % 3 !== 2 ? 'md:border-r border-outline-variant/20 md:pr-gutter' : ''
              } ${idx % 3 !== 0 ? 'md:pl-gutter' : ''}`}
            >
              <span className="font-mono-technical text-[48px] text-surface-tint opacity-30 absolute -top-8 -left-2 font-bold select-none">
                {item.num}
              </span>
              <h3 className="font-headline-md text-headline-md text-tertiary-fixed-dim mb-3 relative z-10 font-semibold">
                {item.title}
              </h3>
              <p className="font-body-md text-surface-variant relative z-10 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

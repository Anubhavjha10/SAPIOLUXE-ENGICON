import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Estimator } from '../components/Estimator';
import { CTASection } from '../components/CTASection';
import { useEstimator } from '../hooks/useDataHooks';
import { ShieldCheck, Download, Calculator, CheckCircle2 } from 'lucide-react';

import { formatINR } from '../utils/estimatorCalculator';

export const EstimatorPage: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: (estimate?: any) => void }>();
  const { config } = useEstimator();

  const classicRate = config.rates?.classic ?? 1400;
  const premiumRate = config.rates?.premium ?? 1750;
  const luxuryRate = config.rates?.luxury ?? 2200;

  return (
    <div className="w-full py-12">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <div className="border-b technical-line pb-6">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Transparent Pricing Engine
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary font-bold mb-4">
            Instant Turnkey Cost Calculator
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Customize your plot size, floor height, material tier, and luxury fitouts to receive an immediate budget estimate with fixed-price structural protection.
          </p>
        </div>
      </div>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Main Interactive Estimator Widget */}
          <div className="lg:col-span-8">
            <Estimator
              config={config}
              onOpenConsultationWithEstimate={(est) => onOpenConsultation(est)}
              showFullDetails={true}
            />
          </div>

          {/* Right Info Box & Pricing Commitments */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary text-on-primary p-6 space-y-4 shadow-xl">
              <span className="font-label-caps text-xs text-tertiary-fixed-dim uppercase tracking-widest block font-bold">
                100% FIXED PRICE LOCK
              </span>
              <h3 className="font-headline-md text-xl font-bold text-on-primary">
                Zero Cost Escalation Guarantee
              </h3>
              <p className="font-body-md text-xs text-surface-variant leading-relaxed">
                Unlike unorganized contractors, Sapioluxe Engicon locks raw material rates (steel, cement, sand, gravel) at contract signing. No mid-construction price hikes.
              </p>
              <ul className="space-y-2 border-t border-outline/30 pt-4 text-xs font-body-md text-surface-bright">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tertiary-fixed-dim shrink-0" />
                  <span>240+ Independent Quality Audits Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tertiary-fixed-dim shrink-0" />
                  <span>BDA & Municipal Approval Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tertiary-fixed-dim shrink-0" />
                  <span>Comprehensive Structural Warranty</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 space-y-3">
              <div className="flex items-center gap-3 text-primary font-bold">
                <Calculator className="w-5 h-5 text-tertiary-fixed-dim" />
                <h4 className="font-headline-md text-base">Rate Card Summary</h4>
              </div>
              <div className="space-y-2 text-xs font-mono-technical text-on-surface-variant border-t technical-line pt-3">
                <div className="flex justify-between">
                  <span>Classic Tier:</span>
                  <span className="font-bold text-primary">{formatINR(classicRate)} / sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Tier:</span>
                  <span className="font-bold text-tertiary-fixed-dim">{formatINR(premiumRate)} / sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Luxury Tier:</span>
                  <span className="font-bold text-primary">{formatINR(luxuryRate)} / sq.ft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection onOpenConsultation={onOpenConsultation} />
    </div>
  );
};

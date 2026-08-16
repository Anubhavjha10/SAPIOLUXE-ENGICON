import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ArrowRight, Check, Calculate, Architecture, FormatQuote } from 'lucide-react';
import { VideoHero } from '../components/VideoHero';
import { PackageCard } from '../components/PackageCard';
import { Estimator } from '../components/Estimator';
import { FounderSection } from '../components/FounderSection';
import { StatsSection } from '../components/StatsSection';
import { ServiceCard } from '../components/ServiceCard';
import { ProjectCard } from '../components/ProjectCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { CTASection } from '../components/CTASection';

import { useHomepage, usePackages, useServices, useProjects, useTestimonials } from '../hooks/useDataHooks';

export const Home: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: (estimate?: any) => void }>();

  const { data: homepageData } = useHomepage();
  const { packages } = usePackages();
  const { services } = useServices();
  const { projects } = useProjects();
  const { testimonials } = useTestimonials();

  return (
    <div className="w-full">
      {/* 1 & 2 & 3. Hero Section with Cinematic Video / Shader Background */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center pt-28 pb-20 overflow-hidden bg-primary">
        <VideoHero videoUrl={homepageData?.heroVideoUrl} />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
          <div className="md:col-span-8 md:col-start-1">
            <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-[0.2em] mb-4 block font-bold">
              {homepageData?.heroTagline || "ODISHA'S PREMIER CONSTRUCTION FIRM"}
            </span>

            <h1 className="font-display-xl text-headline-lg-mobile md:text-display-xl text-white mb-6 leading-tight font-bold whitespace-pre-line drop-shadow-md">
              {homepageData?.heroTitle || 'Building Better.\nEngineering Legacies.'}
            </h1>

            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mb-10 leading-relaxed drop-shadow-sm font-normal">
              {homepageData?.heroSubtitle ||
                'Precision engineering meets uncompromising luxury. We deliver turnkey residential and commercial projects across Odisha, setting new standards in structural integrity and aesthetic perfection.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onOpenConsultation()}
                className="bg-tertiary-fixed-dim text-tertiary-container px-8 py-4 font-label-caps text-label-caps hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-md cursor-pointer"
              >
                <span>{homepageData?.heroCtaPrimary || 'Get Free Consultation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/projects"
                className="border border-white/40 bg-white/10 backdrop-blur-sm text-white px-8 py-4 font-label-caps text-label-caps hover:bg-white hover:text-primary transition-all duration-300 text-center flex items-center justify-center font-semibold"
              >
                {homepageData?.heroCtaSecondary || 'Explore Our Projects'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 8. Packages & Instant Estimator Container (Positioned clearly after Hero) */}
      <section className="relative py-12 md:py-16 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Package Cards */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-unit">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectPackage={() => onOpenConsultation()}
              />
            ))}
          </div>

          {/* Instant Cost Estimator Widget */}
          <div className="md:col-span-5">
            <Estimator
              onOpenConsultationWithEstimate={(est) => onOpenConsultation(est)}
              showFullDetails={false}
            />
          </div>
        </div>
      </section>

      {/* 6. Founder Desk */}
      <FounderSection />

      {/* 7 & 11. Sapioluxe Standard & Trust Statistics */}
      <StatsSection />

      {/* 9. Comprehensive Capabilities / Services */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="mb-12 border-b technical-line pb-4 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
              Our Expertise
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
              Turnkey Capabilities
            </h2>
          </div>
          <Link
            to="/services"
            className="hidden md:flex font-label-caps text-label-caps text-primary items-center gap-2 hover:text-tertiary-fixed-dim transition-colors"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {services.slice(0, 3).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={() => onOpenConsultation()}
            />
          ))}
        </div>

        {/* Centered CTA Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-tertiary-fixed-dim text-tertiary-container px-8 py-3.5 font-label-caps text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-md cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. Featured Project Portfolio Showcase */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="mb-12 border-b technical-line pb-4 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
              Odisha Landmarks
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
              Project Portfolio
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden md:flex font-label-caps text-label-caps text-primary items-center gap-2 hover:text-tertiary-fixed-dim transition-colors"
          >
            <span>View Full Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={() => onOpenConsultation()}
            />
          ))}
        </div>

        {/* Centered CTA Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-tertiary-fixed-dim text-tertiary-container px-8 py-3.5 font-label-caps text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-md cursor-pointer"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 12. Client Testimonials */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="mb-12 border-b technical-line pb-4 text-center">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Client Endorsements
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Trusted by Leaders in Odisha
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      {/* 13. Final CTA Banner */}
      <CTASection onOpenConsultation={() => onOpenConsultation()} />
    </div>
  );
};

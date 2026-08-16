import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-margin-mobile py-24">
      <div className="space-y-6 max-w-md">
        <Building2 className="w-16 h-16 text-tertiary-fixed-dim mx-auto" />
        <span className="font-mono-technical text-6xl font-bold text-primary block">404</span>
        <h1 className="font-headline-lg text-2xl font-bold text-primary">
          Architectural Axis Not Found
        </h1>
        <p className="font-body-md text-xs text-secondary leading-relaxed">
          The structural route or page URI you requested does not exist or has been relocated within our civil blueprint.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

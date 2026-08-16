import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Building2 } from 'lucide-react';
import { useBranding } from '../hooks/useBranding';
import { useContactSettings } from '../hooks/useDataHooks';

export const Footer: React.FC = () => {
  const { brandName, footerLogo, logo, tagline } = useBranding();
  const { contact } = useContactSettings();
  const displayLogo = footerLogo || logo;

  return (
    <footer className="bg-primary text-on-primary w-full relative border-t border-outline-variant/20 px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <Link to="/" className="flex items-center gap-3 group">
            {displayLogo ? (
              <img src={displayLogo} alt={brandName} className="h-10 w-auto max-w-[120px] max-h-10 object-contain shrink-0" />
            ) : (
              <Building2 className="w-7 h-7 text-tertiary-fixed-dim shrink-0" />
            )}
            <span className="font-headline-lg text-lg md:text-xl font-extrabold text-on-primary uppercase tracking-[0.1em]">
              {brandName}
            </span>
          </Link>
          <p className="font-body-md text-sm text-surface-variant leading-relaxed">
            {tagline || 'Precision engineering meets ultra-luxury construction across Odisha.'}
          </p>
          <p className="font-body-md text-xs text-surface-variant/80 leading-relaxed">
            © {new Date().getFullYear()} {brandName}.<br />All rights reserved.<br />Unshakable Structural Quality.
          </p>
        </div>

        {/* Column 1: Navigation */}
        <div className="flex flex-col space-y-3">
          <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-[0.1em] font-bold mb-1">
            Company Navigation
          </span>
          <Link to="/" className="font-body-md text-sm text-surface-variant hover:text-tertiary-fixed-dim hover:underline transition-all">
            Home Overview
          </Link>
          <Link to="/about" className="font-body-md text-sm text-surface-variant hover:text-tertiary-fixed-dim hover:underline transition-all">
            About Founder & Firm
          </Link>
          <Link to="/services" className="font-body-md text-sm text-surface-variant hover:text-tertiary-fixed-dim hover:underline transition-all">
            Turnkey Capabilities
          </Link>
          <Link to="/packages" className="font-body-md text-sm text-surface-variant hover:text-tertiary-fixed-dim hover:underline transition-all">
            Material Packages
          </Link>
          <Link to="/projects" className="font-body-md text-sm text-surface-variant hover:text-tertiary-fixed-dim hover:underline transition-all">
            Project Portfolio
          </Link>
          <Link to="/estimator" className="font-body-md text-sm text-surface-variant hover:text-tertiary-fixed-dim hover:underline transition-all">
            Cost Calculator
          </Link>
        </div>

        {/* Column 2: Legal & Support */}
        <div className="flex flex-col space-y-3">
          <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-[0.1em] font-bold mb-1">
            Standards & Access
          </span>
          <Link to="/contact" className="font-body-md text-sm text-surface-variant hover:text-tertiary-fixed-dim hover:underline transition-all">
            Contact & Survey Request
          </Link>
          <span className="font-body-md text-sm text-surface-variant">
            Terms of Construction
          </span>
          <span className="font-body-md text-sm text-surface-variant">
            240-Point Quality Guarantee
          </span>
          <span className="font-body-md text-sm text-surface-variant">
            Fixed Price Protection
          </span>
          <Link to="/admin" className="font-body-md text-xs text-surface-variant/50 hover:text-tertiary-fixed-dim transition-colors pt-2 block">
            Admin Login
          </Link>
        </div>

        {/* Column 3: Headquarters & Contact */}
        <div className="flex flex-col space-y-3">
          <span className="font-label-caps text-label-caps text-tertiary-fixed-dim uppercase tracking-[0.1em] font-bold mb-1">
            Headquarters & Contact
          </span>
          <p className="font-body-md text-sm text-surface-variant whitespace-pre-line leading-relaxed">
            {contact.address || 'Plot 412, KIIT Square, Patia\nBhubaneswar, Odisha - 751024'}
          </p>
          <div className="flex items-center gap-2 text-surface-variant text-sm pt-1">
            <Phone className="w-4 h-4 text-tertiary-fixed-dim shrink-0" />
            <span>{contact.phone || contact.phonePrimary || '+91 94370 12345'}</span>
          </div>
          <div className="flex items-center gap-2 text-surface-variant text-sm">
            <Mail className="w-4 h-4 text-tertiary-fixed-dim shrink-0" />
            <span>{contact.email || contact.emailPrimary || 'contact@sapioluxe.com'}</span>
          </div>
          <div className="flex items-center gap-2 text-surface-variant text-sm">
            <MapPin className="w-4 h-4 text-tertiary-fixed-dim shrink-0" />
            <span>{contact.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};



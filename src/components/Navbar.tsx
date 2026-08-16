import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Building2 } from 'lucide-react';
import { useBranding } from '../hooks/useBranding';

interface NavbarProps {
  onOpenConsultation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { brandName, logo } = useBranding();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Projects', path: '/projects' },
    { name: 'Estimator', path: '/estimator' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 dark:bg-surface-container-highest/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 py-3'
          : 'bg-surface/80 dark:bg-surface-container-highest/80 backdrop-blur-md border-b border-outline-variant/30 py-4'
      }`}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center w-full">
        {/* Brand Logo & Name */}
        <Link
          to="/"
          className="flex items-center gap-3 font-headline-md text-headline-md font-bold tracking-tight text-primary dark:text-inverse-primary uppercase tracking-[0.1em] group"
        >
          {logo ? (
            <img src={logo} alt={brandName} className="h-9 w-auto max-w-[120px] max-h-9 object-contain shrink-0" />
          ) : (
            <Building2 className="w-6 h-6 text-tertiary-fixed-dim shrink-0" />
          )}
          <span className="text-primary dark:text-inverse-primary text-base sm:text-lg md:text-xl font-extrabold tracking-wider">
            {brandName}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body-md text-body-md transition-colors ${
                  isActive
                    ? 'text-primary dark:text-tertiary-fixed-dim font-semibold border-b-2 border-primary dark:border-tertiary-fixed-dim pb-1'
                    : 'text-secondary dark:text-secondary-fixed hover:text-primary dark:hover:text-tertiary-fixed-dim'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Button Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenConsultation}
            className="bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>Get Free Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-primary p-2 focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant px-margin-mobile py-6 space-y-4 shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block font-body-md text-lg py-2 border-b border-outline-variant/30 ${
                  isActive
                    ? 'text-primary font-bold text-tertiary-fixed-dim pl-2 border-l-2 border-tertiary-fixed-dim'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenConsultation) onOpenConsultation();
              }}
              className="w-full bg-primary text-on-primary py-3 px-4 font-label-caps text-label-caps hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};



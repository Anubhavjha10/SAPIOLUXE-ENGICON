import React, { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Info,
  Settings2,
  PackageCheck,
  Building,
  Calculator,
  MessageSquareQuote,
  Images,
  Home,
  Mail,
  SlidersHorizontal,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Building2,
  Clock,
  ShieldAlert,
  User,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBranding } from '../hooks/useBranding';

export const AdminLayout: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    logout,
    extendSession,
    secondsRemaining,
    showWarningModal,
    formatTime,
  } = useAuth();
  const { brandName, logo } = useBranding();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary text-on-primary flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-tertiary-fixed-dim border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono-technical text-xs tracking-widest text-surface-variant">
            AUTHENTICATING MANAGEMENT PORTAL ACCESS...
          </p>
        </div>
      </div>
    );
  }

  // Auth protection: Unauthenticated requests go to /admin
  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  const sidebarLinks = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Homepage Content', path: '/admin/homepage', icon: Home },
    { name: 'Founder & Desk', path: '/admin/founder', icon: UserCheck },
    { name: 'About Us Content', path: '/admin/about', icon: Info },
    { name: 'Services Catalog', path: '/admin/services', icon: Settings2 },
    { name: 'Construction Packages', path: '/admin/packages', icon: PackageCheck },
    { name: 'Projects Portfolio', path: '/admin/projects', icon: Building },
    { name: 'Cost Estimator Rates', path: '/admin/estimator', icon: Calculator },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Media & Gallery', path: '/admin/gallery', icon: Images },
    { name: 'Contact & Address', path: '/admin/contact', icon: Mail },
    { name: 'Central Branding', path: '/admin/branding', icon: SlidersHorizontal },
    { name: 'Inquiries & Leads', path: '/admin/leads', icon: Users },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background">
      {/* Desktop Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface-container dark:bg-surface-container-highest flex flex-col py-margin-mobile px-4 hidden md:flex z-50 overflow-y-auto">
        <div className="mb-4 flex items-center gap-3 border-b technical-line pb-4">
          {logo ? (
            <img src={logo} alt={brandName} className="h-9 w-9 object-contain rounded" />
          ) : (
            <div className="w-9 h-9 bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim flex items-center justify-center rounded">
              <Building2 className="w-5 h-5" />
            </div>
          )}
          <div className="overflow-hidden">
            <h2 className="font-headline-md font-bold text-primary dark:text-inverse-primary text-sm truncate">
              {brandName} CMS
            </h2>
            <p className="font-label-caps text-[10px] text-on-surface-variant truncate">
              {user?.displayName || 'Executive Portal'}
            </p>
          </div>
        </div>

        {/* Discreet Session Expire Readout */}
        <div className="mb-4 p-2.5 bg-surface-container-high border border-outline-variant/40 rounded space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-mono-technical">
            <User className="w-3 h-3 text-tertiary-fixed-dim shrink-0" />
            <span className="truncate">Logged in as: {user?.email}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono-technical">
            <span className="text-on-surface-variant flex items-center gap-1">
              <Clock className="w-3 h-3 text-tertiary-fixed-dim shrink-0" /> Session expires in:
            </span>
            <span className={`font-bold ${secondsRemaining <= 60 ? 'text-error animate-pulse' : 'text-tertiary-fixed-dim'}`}>
              {formatTime(secondsRemaining)}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 font-medium transition-colors text-xs font-body-md ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-tertiary-fixed-dim' : ''}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-outline-variant space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-xs font-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-tertiary-fixed-dim" />
            <span>View Live Website</span>
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-body-md text-error hover:bg-error-container hover:text-on-error-container transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Administrator</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant px-4 py-3 flex justify-between items-center">
        <span className="font-headline-md font-bold text-primary text-base">{brandName} CMS</span>
        <div className="flex items-center gap-3">
          <span className="font-mono-technical text-xs font-bold text-tertiary-fixed-dim">
            {formatTime(secondsRemaining)}
          </span>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="text-primary p-1 cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex">
          <div className="w-64 bg-surface h-full p-4 overflow-y-auto space-y-2 pt-16">
            <div className="pb-2 border-b border-outline-variant mb-2 text-xs font-mono-technical text-on-surface-variant space-y-1">
              <p className="truncate">User: {user?.email}</p>
              <p className="text-tertiary-fixed-dim font-bold">Session: {formatTime(secondsRemaining)}</p>
            </div>
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-body-md ${
                    isActive ? 'bg-primary text-on-primary font-bold' : 'text-on-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-outline-variant">
              <button
                onClick={() => logout()}
                className="w-full text-left flex items-center gap-2 text-error text-xs p-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out Administrator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto bg-surface-container-lowest p-margin-mobile md:p-margin-desktop pt-16 md:pt-margin-desktop">
        <Outlet />
      </main>

      {/* 60-Second Session Inactivity Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-error/50 p-6 space-y-4 shadow-2xl relative text-on-surface">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
              <div className="w-10 h-10 bg-error/20 text-error flex items-center justify-center rounded-full">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline-md font-bold text-base text-primary uppercase tracking-wider">
                  Session Expiration Warning
                </h3>
                <p className="font-mono-technical text-xs text-error font-bold">
                  Inactivity detected
                </p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed font-body-md">
              Your administrative session will expire in{' '}
              <span className="font-bold text-error font-mono-technical text-sm">
                {secondsRemaining} seconds
              </span>{' '}
              due to inactivity. Would you like to remain signed in to the management portal?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => logout()}
                className="px-4 py-2.5 text-xs font-label-caps text-error border border-error/30 hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
              >
                Logout Now
              </button>
              <button
                type="button"
                onClick={extendSession}
                className="px-5 py-2.5 text-xs font-label-caps bg-tertiary-fixed-dim text-tertiary-container font-bold hover:bg-white hover:text-primary transition-all cursor-pointer shadow-md"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



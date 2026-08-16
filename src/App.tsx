import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { initializeFirstTimeData } from './firebase/seed';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { EstimatorPage } from './pages/EstimatorPage';
import { PackagesPage } from './pages/PackagesPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { FounderAdmin } from './pages/admin/FounderAdmin';
import { AboutAdmin } from './pages/admin/AboutAdmin';
import { ServicesAdmin } from './pages/admin/ServicesAdmin';
import { PackagesAdmin } from './pages/admin/PackagesAdmin';
import { ProjectsAdmin } from './pages/admin/ProjectsAdmin';
import { EstimatorAdmin } from './pages/admin/EstimatorAdmin';
import { TestimonialsAdmin } from './pages/admin/TestimonialsAdmin';
import { GalleryAdmin } from './pages/admin/GalleryAdmin';
import { HomepageAdmin } from './pages/admin/HomepageAdmin';
import { ContactAdmin } from './pages/admin/ContactAdmin';
import { BrandingAdmin } from './pages/admin/BrandingAdmin';
import { LeadsAdmin } from './pages/admin/LeadsAdmin';

const AdminRouteWrapper: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-on-primary p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-tertiary-fixed-dim border-t-transparent rounded-full animate-spin" />
          <p className="font-label-caps text-xs text-surface-variant uppercase tracking-widest font-semibold">
            Verifying Administrator Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <AdminLayout />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/estimator" element={<EstimatorPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login Alias */}
      <Route path="/admin/login" element={<Navigate to="/admin" replace />} />

      {/* Protected CMS Admin Portal Entry Point (/admin) */}
      <Route path="/admin" element={<AdminRouteWrapper />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="founder" element={<FounderAdmin />} />
        <Route path="about" element={<AboutAdmin />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="packages" element={<PackagesAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="estimator" element={<EstimatorAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="homepage" element={<HomepageAdmin />} />
        <Route path="contact" element={<ContactAdmin />} />
        <Route path="branding" element={<BrandingAdmin />} />
        <Route path="settings" element={<BrandingAdmin />} />
        <Route path="leads" element={<LeadsAdmin />} />
        <Route path="inquiries" element={<LeadsAdmin />} />
      </Route>
    </Routes>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    // Idempotent initial seed check for Firestore
    initializeFirstTimeData().catch((err) => {
      console.warn('Initial seeding check completed or skipped:', err);
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;



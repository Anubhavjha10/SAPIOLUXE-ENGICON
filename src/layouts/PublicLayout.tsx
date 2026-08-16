import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ConsultationModal } from '../components/ConsultationModal';

export const PublicLayout: React.FC = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [estimateDetails, setEstimateDetails] = useState<any>(null);

  const handleOpenConsultation = (estimate?: any) => {
    if (estimate) {
      setEstimateDetails(estimate);
    }
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-tertiary-fixed-dim selection:text-tertiary-container">
      <Navbar onOpenConsultation={() => handleOpenConsultation()} />

      <main className="flex-grow pt-16">
        <Outlet context={{ onOpenConsultation: handleOpenConsultation }} />
      </main>

      <Footer />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialEstimate={estimateDetails}
      />
    </div>
  );
};

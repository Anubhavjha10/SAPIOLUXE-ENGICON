import React, { useState } from 'react';
import { Modal } from './Modal';
import { submitInquiry } from '../services/inquiryService';
import { CheckCircle2, Send } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEstimate?: any;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialEstimate,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Bhubaneswar',
    projectType: 'Turnkey Residential Villa',
    plotArea: initialEstimate?.plotArea || 1500,
    budget: initialEstimate ? `₹ ${initialEstimate.estimatedTotalLakhs} Lakhs` : '₹ 45 - 75 Lakhs',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        projectType: formData.projectType,
        plotArea: Number(formData.plotArea),
        estimatedBudget: formData.budget,
        message: formData.message || 'Consultation request submitted from Sapioluxe website modal.',
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="Schedule Technical Consultation">
      {submitted ? (
        <div className="text-center py-8 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-tertiary-fixed-dim mx-auto" />
          <h4 className="font-headline-md text-2xl font-bold text-primary">
            Consultation Request Received!
          </h4>
          <p className="font-body-lg text-sm text-secondary max-w-md mx-auto">
            Thank you, <span className="font-bold text-primary">{formData.name}</span>. Principal Engineer Er. Ranjit Das & team will review your project parameters and reach out within 24 hours.
          </p>
          <button
            onClick={handleReset}
            className="bg-primary text-on-primary px-8 py-3 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors"
          >
            Close & Return
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="font-body-md text-xs text-secondary mb-4">
            Connect directly with Sapioluxe Engicon principal structural engineers for site surveys, blueprint planning, and fixed price commitments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                Full Name *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Er. Subhashree Mohanty"
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                Phone Number *
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 94370 XXXXX"
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                Project Location *
              </label>
              <input
                required
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Bhubaneswar / Cuttack / Puri"
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                Project Type
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
              >
                <option value="Turnkey Residential Villa">Turnkey Residential Villa</option>
                <option value="Commercial Office Building">Commercial Office Building</option>
                <option value="Interior Architecture Fitouts">Interior Architecture Fitouts</option>
                <option value="Civil Design & Structural Audit">Civil Design & Structural Audit</option>
              </select>
            </div>
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                Plot Area (Sq.Ft)
              </label>
              <input
                type="number"
                value={formData.plotArea}
                onChange={(e) => setFormData({ ...formData, plotArea: Number(e.target.value) })}
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
              Additional Details / Site Notes
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Specify requirements, preferred schedule, or site address..."
              className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary py-4 px-6 font-label-caps text-label-caps hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all flex items-center justify-center gap-2 font-bold"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Consultation Request'}</span>
          </button>
        </form>
      )}
    </Modal>
  );
};

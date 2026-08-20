import React, { useState, useEffect, useMemo } from 'react';
import { getContactSettings } from '../services/contactService';
import { submitInquiry } from '../services/inquiryService';
import { useLocations } from '../hooks/useDataHooks';
import { ContactSettings } from '../types';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Globe, Building } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactSettings | null>(null);
  const { locations } = useLocations();

  const activeLocations = useMemo(() => {
    return locations
      .filter((loc) => loc.active !== false)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [locations]);

  // Aggregate location options for form
  const locationOptions = useMemo(() => {
    const opts: string[] = [];
    activeLocations.forEach((loc) => {
      if (loc.cities && loc.cities.length > 0) {
        loc.cities.forEach((city) => {
          opts.push(`${city}, ${loc.name}`);
        });
      } else {
        opts.push(loc.name);
      }
    });
    return opts.length > 0 ? opts : ['Bhubaneswar, Odisha', 'Kolkata, West Bengal'];
  }, [activeLocations]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    projectType: 'Turnkey Residential Villa',
    plotArea: 1800,
    budget: '₹ 45 - 75 Lakhs',
    message: '',
  });

  useEffect(() => {
    if (locationOptions.length > 0 && !formData.location) {
      setFormData((prev) => ({ ...prev, location: locationOptions[0] }));
    }
  }, [locationOptions]);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getContactSettings().then(setContactInfo);
  }, []);

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
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-12">
      {/* Contact Hero */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <div className="border-b technical-line pb-6">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Direct Civil Engineering Consultations
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary font-bold mb-4">
            Connect with Sapioluxe
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Schedule an in-person office meeting at our headquarters or request an immediate site survey with our principal engineers.
          </p>
        </div>
      </div>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 glass-panel p-8">
            <h3 className="font-headline-md text-2xl font-bold text-primary mb-6 border-b technical-line pb-4">
              Project Consultation & Site Survey Form
            </h3>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-tertiary-fixed-dim mx-auto" />
                <h4 className="font-headline-md text-2xl font-bold text-primary">
                  Inquiry Successfully Registered
                </h4>
                <p className="font-body-md text-sm text-secondary max-w-md mx-auto">
                  Thank you, <span className="font-bold text-primary">{formData.name}</span>. Our senior site survey engineer will contact you shortly at <span className="font-mono-technical text-primary">{formData.phone}</span>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      placeholder="e.g. Subhashree Mohanty"
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
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
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
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
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                      Project Service Location *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim font-bold"
                    >
                      {locationOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
                    >
                      <option value="Turnkey Residential Villa">Turnkey Villa</option>
                      <option value="Commercial Office Space">Commercial Space</option>
                      <option value="Interior Architecture">Luxury Interior</option>
                      <option value="Civil Structural Audit">Civil Design Audit</option>
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
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim"
                    >
                      <option value="₹ 25 - 45 Lakhs">₹ 25 - 45 Lakhs</option>
                      <option value="₹ 45 - 75 Lakhs">₹ 45 - 75 Lakhs</option>
                      <option value="₹ 75 Lakhs - 1.5 Cr">₹ 75 Lakhs - 1.5 Cr</option>
                      <option value="₹ 1.5 Cr+">₹ 1.5 Cr+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
                    Message / Special Site Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about plot dimensions, road connectivity, or preferred start date..."
                    className="w-full bg-surface-container border border-outline-variant px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-tertiary-fixed-dim resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary py-4 px-6 font-label-caps text-label-caps hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Contact Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details & Dynamic Locations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-primary text-on-primary p-8 space-y-6 shadow-xl">
              <div>
                <span className="font-label-caps text-xs text-tertiary-fixed-dim uppercase tracking-widest block font-bold mb-2">
                  CIVIL ENGINEERING HEADQUARTERS
                </span>
                <h3 className="font-headline-md text-2xl font-bold text-on-primary">
                  {contactInfo?.headquarters || 'Bhubaneswar Headquarters'}
                </h3>
              </div>

              <div className="space-y-4 border-t border-outline/30 pt-6 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-tertiary-fixed-dim shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Office Address:</span>
                    <p className="text-surface-variant">{contactInfo?.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-tertiary-fixed-dim shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Direct Desk Lines:</span>
                    <p className="text-surface-variant font-mono-technical">
                      {contactInfo?.phonePrimary} / {contactInfo?.phoneSecondary}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-tertiary-fixed-dim shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Official Email:</span>
                    <p className="text-surface-variant font-mono-technical">
                      {contactInfo?.emailPrimary}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-tertiary-fixed-dim shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Working Hours:</span>
                    <p className="text-surface-variant">{contactInfo?.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Active Locations Card */}
            <div className="bg-surface p-6 border border-outline-variant space-y-4">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Globe className="w-5 h-5 text-tertiary-fixed-dim" />
                <h4 className="font-headline-md text-base font-bold text-primary uppercase tracking-wider">
                  Our Service Locations
                </h4>
              </div>

              <div className="space-y-3">
                {activeLocations.map((loc) => (
                  <div key={loc.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-tertiary-fixed-dim shrink-0" />
                      <span className="font-headline-md text-sm font-bold text-primary">
                        {loc.name}
                      </span>
                    </div>
                    {loc.description && (
                      <p className="font-body-md text-xs text-on-surface-variant pl-6">
                        {loc.description}
                      </p>
                    )}
                    {loc.cities && loc.cities.length > 0 && (
                      <div className="pl-6 flex flex-wrap gap-1 pt-1">
                        {loc.cities.map((city, idx) => (
                          <span
                            key={idx}
                            className="bg-surface-container text-primary font-mono-technical text-[10px] px-2 py-0.5 border border-outline-variant"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Embed Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="mb-6 border-b technical-line pb-4">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Navigation Map
          </span>
          <h3 className="font-headline-md text-xl font-bold text-primary">
            Visit Our Headquarters
          </h3>
        </div>

        <div className="w-full h-[400px] bg-surface-variant ghost-border overflow-hidden">
          <iframe
            title="Sapioluxe Engicon Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.6728045952865!2d85.8166!3d20.3552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDIxJzE4LjcyIE4gODXCsDQ5Jz8uOCIgRQ!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
};

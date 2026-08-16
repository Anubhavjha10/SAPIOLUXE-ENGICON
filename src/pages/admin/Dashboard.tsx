import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Users,
  MapPin,
  Settings2,
  Plus,
  Save,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { useProjects, useLeads, useServices, usePackages } from '../../hooks/useDataHooks';
import { getEstimatorConfig, updateEstimatorConfig } from '../../services/estimatorService';
import { Inquiry, EstimatorConfig } from '../../types';
import { useBranding } from '../../hooks/useBranding';

export const Dashboard: React.FC = () => {
  const { projects } = useProjects();
  const { leads, updateStatus } = useLeads();
  const { services } = useServices();
  const { packages } = usePackages();
  const { brandName } = useBranding();

  const [config, setConfig] = useState<EstimatorConfig | null>(null);
  const [rates, setRates] = useState({ classic: 1400, premium: 1750, luxury: 2200 });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const cfg = await getEstimatorConfig();
      setConfig(cfg);
      if (cfg?.rates) {
        setRates({
          classic: cfg.rates.classic || 1400,
          premium: cfg.rates.premium || 1750,
          luxury: cfg.rates.luxury || 2200,
        });
      }
    }
    loadConfig();
  }, []);

  // Update local rate fields when Firestore packages stream changes
  useEffect(() => {
    if (packages.length > 0) {
      const classicPkg = packages.find((p) => p.id === 'classic');
      const premiumPkg = packages.find((p) => p.id === 'premium');
      const luxuryPkg = packages.find((p) => p.id === 'luxury');
      setRates({
        classic: classicPkg?.ratePerSqFt || rates.classic,
        premium: premiumPkg?.ratePerSqFt || rates.premium,
        luxury: luxuryPkg?.ratePerSqFt || rates.luxury,
      });
    }
  }, [packages]);

  const handleUpdateRates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    const updated = {
      ...config,
      rates: {
        classic: Number(rates.classic),
        premium: Number(rates.premium),
        luxury: Number(rates.luxury),
      },
    };
    await updateEstimatorConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    await updateStatus(id, newStatus);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="mb-gutter md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-outline-variant pb-4 gap-4">
        <div>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary font-bold">
            Executive Dashboard Overview
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mt-1">
            {brandName} Operations, Real-Time Construction Metrics & CMS Insights
          </p>
        </div>

        {/* Quick Actions Desktop */}
        <div className="flex gap-3">
          <Link
            to="/admin/projects"
            className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-on-tertiary-fixed transition-colors flex items-center gap-2 font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>
          <Link
            to="/admin/estimator"
            className="bg-transparent text-primary px-6 py-3 font-label-caps text-xs ghost-border hover:bg-surface-container transition-colors flex items-center gap-2 font-bold cursor-pointer"
          >
            <FileText className="w-4 h-4" /> Pricing Config
          </Link>
        </div>
      </header>

      {/* Metrics Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-6 ghost-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-secondary uppercase tracking-widest">
              Total Portfolio Projects
            </span>
            <Building className="w-5 h-5 text-tertiary-fixed-dim" />
          </div>
          <div className="font-display-xl text-5xl font-bold text-primary leading-none">
            {projects.length}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-6 ghost-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-secondary uppercase tracking-widest">
              Active Client Leads
            </span>
            <Users className="w-5 h-5 text-tertiary-fixed-dim" />
          </div>
          <div className="font-display-xl text-5xl font-bold text-primary leading-none">
            {leads.length}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-6 ghost-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-secondary uppercase tracking-widest">
              New Consultations
            </span>
            <MapPin className="w-5 h-5 text-tertiary-fixed-dim" />
          </div>
          <div className="font-display-xl text-5xl font-bold text-primary leading-none">
            {leads.filter((l) => l.status === 'New').length}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-6 ghost-border flex flex-col justify-between h-40 bg-primary text-on-primary">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-xs text-on-primary-container uppercase tracking-widest">
              Turnkey Capabilities
            </span>
            <Settings2 className="w-5 h-5 text-tertiary-fixed" />
          </div>
          <div className="font-display-xl text-5xl font-bold text-on-primary leading-none">
            {services.length}
          </div>
        </div>
      </section>

      {/* Grid Layout for Main Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Recent Inquiries Table */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-end pb-2 border-b border-outline-variant">
            <h2 className="font-headline-lg text-2xl font-bold text-primary">Recent Client Inquiries</h2>
            <Link to="/admin/leads" className="font-mono-technical text-xs text-tertiary-fixed-dim hover:underline">
              View All Leads ({leads.length})
            </Link>
          </div>

          <div className="bg-surface-container-lowest ghost-border overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-caps text-xs text-secondary">
                  <th className="p-4 font-bold">Client Name</th>
                  <th className="p-4 font-bold">Interest / Project</th>
                  <th className="p-4 font-bold">Contact</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold text-right">Status Action</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-xs divide-y divide-outline-variant">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-secondary font-mono-technical">
                      No client leads captured yet.
                    </td>
                  </tr>
                ) : (
                  leads.slice(0, 6).map((inq) => (
                    <tr key={inq.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-4 text-primary font-bold">
                        {inq.name}
                        {inq.plotArea && (
                          <span className="block text-[11px] text-tertiary-fixed-dim font-mono-technical font-normal">
                            {inq.plotArea} Sq.Ft Plot
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-secondary">{inq.projectType || 'Turnkey Construction'}</td>
                      <td className="p-4 text-secondary font-mono-technical">{inq.phone}</td>
                      <td className="p-4 text-secondary font-mono-technical">{inq.createdAt}</td>
                      <td className="p-4 text-right">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                          className={`px-2 py-1 text-xs font-label-caps font-bold border cursor-pointer ${
                            inq.status === 'New'
                              ? 'bg-primary text-on-primary border-primary'
                              : inq.status === 'Contacted'
                              ? 'bg-surface-container-high text-on-surface border-outline'
                              : 'bg-outline/20 text-on-surface border-outline'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="In Review">In Review</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Estimator Base Rates Panel */}
        <section className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex justify-between items-end pb-2 border-b border-outline-variant">
            <h2 className="font-headline-lg text-2xl font-bold text-primary">Estimator Base Rates</h2>
          </div>

          <div className="bg-surface-container-lowest ghost-border p-6 flex-1 flex flex-col justify-between">
            <form onSubmit={handleUpdateRates} className="space-y-6">
              {saveSuccess && (
                <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Package Base Rates Updated!
                </div>
              )}

              <div>
                <label className="block font-label-caps text-xs text-secondary mb-2 uppercase tracking-widest">
                  Classic Package (₹/sq.ft)
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 font-headline-md text-base text-secondary">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={rates.classic}
                    onChange={(e) => setRates({ ...rates, classic: Number(e.target.value) })}
                    className="w-full bg-transparent border-0 border-b border-primary text-right font-headline-md text-xl text-primary focus:ring-0 focus:border-tertiary-fixed-dim px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-xs text-secondary mb-2 uppercase tracking-widest">
                  Premium Package (₹/sq.ft)
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 font-headline-md text-base text-secondary">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={rates.premium}
                    onChange={(e) => setRates({ ...rates, premium: Number(e.target.value) })}
                    className="w-full bg-transparent border-0 border-b border-primary text-right font-headline-md text-xl text-primary focus:ring-0 focus:border-tertiary-fixed-dim px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-xs text-secondary mb-2 uppercase tracking-widest">
                  Luxury Package (₹/sq.ft)
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 font-headline-md text-base text-secondary">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={rates.luxury}
                    onChange={(e) => setRates({ ...rates, luxury: Number(e.target.value) })}
                    className="w-full bg-transparent border-0 border-b border-primary text-right font-headline-md text-xl text-primary focus:ring-0 focus:border-tertiary-fixed-dim px-2 py-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-tertiary-fixed-dim text-tertiary-container px-6 py-3.5 font-label-caps text-xs hover:bg-white hover:text-primary transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Pricing Base Rates
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};


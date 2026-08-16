import React, { useState, useEffect } from 'react';
import { useBranding } from '../../hooks/useBranding';
import { ImageUploader } from '../../components/ImageUploader';
import { Save, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BrandingSettings } from '../../types';

export const BrandingAdmin: React.FC = () => {
  const { branding, update, isLoading } = useBranding();
  const [formData, setFormData] = useState<BrandingSettings>(branding);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (branding) {
      setFormData(branding);
    }
  }, [branding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      await update(formData);
      setSuccessMsg('Branding and dynamic logo settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update branding settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-tertiary-fixed-dim border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold uppercase tracking-wider text-on-surface">
            Central Branding & Corporate Identity
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Manage site-wide company title, tagline, logo assets, and dynamic favicon settings.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 text-xs font-mono-technical flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Identity Text */}
        <div className="bg-surface-container/30 border border-outline-variant/30 p-6 space-y-4">
          <h3 className="font-headline-md font-semibold text-sm uppercase tracking-wider text-tertiary-fixed-dim flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Brand Name & Tagline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase tracking-widest">
                Official Brand Name
              </label>
              <input
                required
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full bg-surface-container text-on-surface border border-outline-variant px-3 py-2.5 text-sm focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase tracking-widest">
                Corporate Tagline / Slogan
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-surface-container text-on-surface border border-outline-variant px-3 py-2.5 text-sm focus:outline-none focus:border-tertiary-fixed-dim"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Logo & Favicon Assets */}
        <div className="bg-surface-container/30 border border-outline-variant/30 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md font-semibold text-sm uppercase tracking-wider text-tertiary-fixed-dim">
              Brand Asset Management (PNG Format Requirement)
            </h3>
            <div className="text-[11px] font-mono-technical text-amber-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> High-Resolution PNGs Only
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Header Main Logo */}
            <div className="space-y-2">
              <label className="block font-label-caps text-xs text-on-surface uppercase tracking-widest font-bold">
                Header Main Logo
              </label>
              <ImageUploader
                value={formData.logo}
                isBrandingAsset={true}
                onUploadSuccess={(res) => setFormData({ ...formData, logo: res.cloudinaryUrl })}
                onRemove={() => setFormData({ ...formData, logo: '' })}
                label="Primary Brand Logo"
              />
            </div>

            {/* Footer Logo */}
            <div className="space-y-2">
              <label className="block font-label-caps text-xs text-on-surface uppercase tracking-widest font-bold">
                Footer Logo
              </label>
              <ImageUploader
                value={formData.footerLogo}
                isBrandingAsset={true}
                onUploadSuccess={(res) => setFormData({ ...formData, footerLogo: res.cloudinaryUrl })}
                onRemove={() => setFormData({ ...formData, footerLogo: '' })}
                label="Footer Brand Mark"
              />
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <label className="block font-label-caps text-xs text-on-surface uppercase tracking-widest font-bold">
                Browser Favicon Icon
              </label>
              <ImageUploader
                value={formData.favicon}
                isBrandingAsset={true}
                onUploadSuccess={(res) => setFormData({ ...formData, favicon: res.cloudinaryUrl })}
                onRemove={() => setFormData({ ...formData, favicon: '' })}
                label="Favicon Mark (32x32)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-tertiary-fixed-dim text-tertiary-container px-8 py-3.5 font-label-caps text-xs hover:bg-white hover:text-primary transition-all font-bold flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save Branding Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

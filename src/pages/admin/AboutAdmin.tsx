import React, { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export const AboutAdmin: React.FC = () => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aboutData, setAboutData] = useState({
    title: 'Engineering Unshakable Permanence.',
    subtitle: 'Sapioluxe Engicon combines heavy structural durability with refined editorial luxury.',
    historyText: 'Established in 2006 in Bhubaneswar as a boutique structural engineering consultancy.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">About Us CMS</h1>
        <p className="font-body-md text-xs text-secondary">Manage company story & philosophy content.</p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> About Page Updated!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Headline Title</label>
          <input
            type="text"
            value={aboutData.title}
            onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Subtitle / Mission Statement</label>
          <textarea
            rows={3}
            value={aboutData.subtitle}
            onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">History & Milestone Text</label>
          <textarea
            rows={4}
            value={aboutData.historyText}
            onChange={(e) => setAboutData({ ...aboutData, historyText: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <button type="submit" className="bg-primary text-on-primary px-8 py-3.5 font-label-caps text-xs font-bold flex items-center gap-2">
          <Save className="w-4 h-4" /> Save About Content
        </button>
      </form>
    </div>
  );
};

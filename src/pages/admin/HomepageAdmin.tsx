import React, { useState, useEffect } from 'react';
import { getHomepageContent, updateHomepageContent } from '../../services/homepageService';
import { HomepageContent } from '../../types';
import { Save, CheckCircle } from 'lucide-react';
import { normalizeVideoUrl } from '../../components/VideoHero';

export const HomepageAdmin: React.FC = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getHomepageContent().then(setContent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    const normalizedContent = {
      ...content,
      heroVideoUrl: normalizeVideoUrl(content.heroVideoUrl),
    };

    await updateHomepageContent(normalizedContent);
    setContent(normalizedContent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!content) return <div className="p-8">Loading Homepage Content...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Homepage Content CMS</h1>
        <p className="font-body-md text-xs text-secondary">
          Manage Hero Headlines, Taglines, Video Media URL, and Banner CTAs.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Homepage Content Updated & Live!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Hero Tagline</label>
          <input
            type="text"
            value={content.heroTagline}
            onChange={(e) => setContent({ ...content, heroTagline: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Main Hero Title</label>
          <textarea
            rows={2}
            value={content.heroTitle}
            onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Hero Subtitle</label>
          <textarea
            rows={3}
            value={content.heroSubtitle}
            onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Background Video URL (.mp4)</label>
          <input
            type="text"
            value={content.heroVideoUrl}
            onChange={(e) => setContent({ ...content, heroVideoUrl: e.target.value })}
            className="w-full bg-surface-container border px-3 py-2 text-xs font-mono-technical"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-8 py-3.5 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors flex items-center gap-2 font-bold"
        >
          <Save className="w-4 h-4" /> Save Homepage Content
        </button>
      </form>
    </div>
  );
};

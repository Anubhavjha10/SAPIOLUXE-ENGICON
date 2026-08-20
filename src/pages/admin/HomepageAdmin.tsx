import React, { useState, useEffect } from 'react';
import { getHomepageContent, updateHomepageContent } from '../../services/homepageService';
import { HomepageContent } from '../../types';
import { Save, CheckCircle, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export const HomepageAdmin: React.FC = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getHomepageContent().then((data) => {
      // Ensure backgroundImages exists with defaults if empty
      if (data) {
        const bgImages = (data.backgroundImages && data.backgroundImages.length > 0)
          ? data.backgroundImages
          : (data.heroBackgroundImages && data.heroBackgroundImages.length > 0)
            ? data.heroBackgroundImages
            : [
                'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=2000&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
                'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80',
              ];
        setContent({ ...data, backgroundImages: bgImages });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    // Filter out empty URLs before saving
    const cleanedImages = (content.backgroundImages || [])
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const updatedContent = {
      ...content,
      backgroundImages: cleanedImages,
      heroBackgroundImages: cleanedImages, // for maximum compatibility
    };

    await updateHomepageContent(updatedContent);
    setContent(updatedContent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdateImage = (index: number, url: string) => {
    if (!content) return;
    const updatedImages = [...(content.backgroundImages || [])];
    updatedImages[index] = url;
    setContent({ ...content, backgroundImages: updatedImages });
  };

  const handleAddImage = () => {
    if (!content) return;
    const updatedImages = [...(content.backgroundImages || []), ''];
    setContent({ ...content, backgroundImages: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    if (!content) return;
    const updatedImages = (content.backgroundImages || []).filter((_, idx) => idx !== index);
    setContent({ ...content, backgroundImages: updatedImages });
  };

  if (!content) return <div className="p-8">Loading Homepage Content...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Homepage Content CMS</h1>
        <p className="font-body-md text-xs text-secondary">
          Manage Hero Headlines, Taglines, Background Slideshow Images, and Banner CTAs.
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
            value={content.heroTagline || ''}
            onChange={(e) => setContent({ ...content, heroTagline: e.target.value })}
            className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Main Hero Title</label>
          <textarea
            rows={2}
            value={content.heroTitle || ''}
            onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
            className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1">Hero Subtitle</label>
          <textarea
            rows={3}
            value={content.heroSubtitle || ''}
            onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
            className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary"
          />
        </div>

        {/* Hero Background Images Slideshow Section */}
        <div className="bg-surface-container-lowest ghost-border p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <div>
              <h3 className="font-headline-md text-lg font-bold text-primary">Hero Background Images</h3>
              <p className="text-xs text-secondary">
                Add 2–4 image URLs (JPG, PNG, WebP, GIF) for the automatic continuous looping hero background.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-primary text-on-primary px-4 py-2 text-xs font-label-caps font-bold flex items-center gap-1.5 hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Image
            </button>
          </div>

          <div className="space-y-4">
            {(content.backgroundImages || []).map((url, index) => (
              <div
                key={index}
                className="bg-surface border border-outline-variant p-4 space-y-2 relative group flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                {/* Image Preview */}
                <div className="w-24 h-16 bg-surface-container border border-outline-variant overflow-hidden shrink-0 flex items-center justify-center relative">
                  {url ? (
                    <img
                      src={url}
                      alt={`Hero Background ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-secondary/40" />
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block font-label-caps text-[11px] text-secondary mb-1">
                    Image {index + 1} URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    placeholder="https://res.cloudinary.com/.../hero-1.jpg"
                    onChange={(e) => handleUpdateImage(index, e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-xs font-mono-technical text-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 text-error hover:text-error/80 cursor-pointer shrink-0 self-end md:self-center"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-8 py-3.5 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors flex items-center gap-2 font-bold cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Homepage Content
        </button>
      </form>
    </div>
  );
};

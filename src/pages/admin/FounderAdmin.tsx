import React, { useState, useEffect } from 'react';
import { getFounderData, updateFounderData } from '../../services/founderService';
import { Founder } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Save, CheckCircle, Plus, Trash2 } from 'lucide-react';

export const FounderAdmin: React.FC = () => {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newSpec, setNewSpec] = useState('');

  useEffect(() => {
    getFounderData().then(setFounder);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!founder) return;
    await updateFounderData(founder);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addSpec = () => {
    if (!newSpec.trim() || !founder) return;
    setFounder({ ...founder, specs: [...founder.specs, newSpec.trim()] });
    setNewSpec('');
  };

  const removeSpec = (index: number) => {
    if (!founder) return;
    setFounder({
      ...founder,
      specs: founder.specs.filter((_, i) => i !== index),
    });
  };

  if (!founder) return <div className="p-8">Loading Founder Desk Data...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Founder's Desk CMS</h1>
        <p className="font-body-md text-xs text-secondary">
          Manage Er. Ranjit Das profile, quotation, bio, and portrait asset.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Founder Desk Updated & Published!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
              Founder Name
            </label>
            <input
              type="text"
              value={founder.name}
              onChange={(e) => setFounder({ ...founder, name: e.target.value })}
              className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary"
            />
          </div>
          <div>
            <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
              Title / Position
            </label>
            <input
              type="text"
              value={founder.title}
              onChange={(e) => setFounder({ ...founder, title: e.target.value })}
              className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
            Featured Quotation
          </label>
          <textarea
            rows={3}
            value={founder.quote}
            onChange={(e) => setFounder({ ...founder, quote: e.target.value })}
            className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary"
          />
        </div>

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest">
            Executive Bio / Story
          </label>
          <textarea
            rows={5}
            value={founder.bio}
            onChange={(e) => setFounder({ ...founder, bio: e.target.value })}
            className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm text-primary"
          />
        </div>

        <ImageUploader
          value={founder.image}
          label="Founder Portrait Image"
          onUploadSuccess={(res) => setFounder({ ...founder, image: res.cloudinaryUrl })}
        />

        <div>
          <label className="block font-label-caps text-xs text-secondary mb-2 uppercase tracking-widest">
            Key Qualifications / Credentials List
          </label>
          <div className="space-y-2 mb-3">
            {founder.specs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-surface-container text-xs">
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="text-error hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              placeholder="e.g. M.Tech Structural Engineering (IIT Kharagpur)"
              className="flex-1 bg-surface-container border border-outline-variant px-3 py-2 text-xs"
            />
            <button
              type="button"
              onClick={addSpec}
              className="bg-primary text-on-primary px-4 py-2 text-xs font-label-caps flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-8 py-3.5 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors flex items-center gap-2 font-bold"
        >
          <Save className="w-4 h-4" /> Save Founder Profile
        </button>
      </form>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAboutPageContent } from '../../hooks/useDataHooks';
import { AboutPageContent, AboutMilestone, AboutVision } from '../../types';
import { Modal } from '../../components/Modal';
import { ImageUploader } from '../../components/ImageUploader';
import { Save, CheckCircle, Plus, Edit2, Trash2, Eye, EyeOff, Milestone, Compass } from 'lucide-react';

export const AboutAdmin: React.FC = () => {
  const { about, update } = useAboutPageContent();
  const [formData, setFormData] = useState<AboutPageContent>({ ...about });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'vision' | 'milestones'>('hero');

  // Milestone modal state
  const [editingMilestone, setEditingMilestone] = useState<Partial<AboutMilestone> | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  useEffect(() => {
    if (about) {
      setFormData({
        ...about,
        vision: about.vision || {
          heading: 'Our Vision',
          title: 'Building a Better Future Through Engineering Excellence',
          description: 'Sapioluxe Engicon envisions setting the benchmark in luxury construction and civil engineering across Eastern India by establishing transparent fixed-price contracts, 240+ point structural quality audits, and timeless architectural craftsmanship.',
          image: '',
          ctaText: 'Explore Projects',
          ctaLink: '/projects',
          active: true,
        },
        milestones: about.milestones || [],
      });
    }
  }, [about]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Milestone CRUD logic
  const handleOpenMilestoneModal = (milestone?: AboutMilestone) => {
    if (milestone) {
      setEditingMilestone({ ...milestone });
    } else {
      const existing = formData.milestones || [];
      setEditingMilestone({
        id: `m_${Date.now()}`,
        year: '2026',
        title: 'New Milestone',
        description: 'Detail the company milestone achievement or expansion event.',
        image: '',
        displayOrder: existing.length + 1,
        active: true,
      });
    }
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone?.title || !editingMilestone?.year) return;

    const currentList = [...(formData.milestones || [])];
    const index = currentList.findIndex((m) => m.id === editingMilestone.id);

    if (index >= 0) {
      currentList[index] = editingMilestone as AboutMilestone;
    } else {
      currentList.push(editingMilestone as AboutMilestone);
    }

    setFormData({
      ...formData,
      milestones: currentList,
    });
    setIsMilestoneModalOpen(false);
  };

  const handleDeleteMilestone = (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      const updated = (formData.milestones || []).filter((m) => m.id !== id);
      setFormData({ ...formData, milestones: updated });
    }
  };

  const handleToggleMilestoneActive = (id: string) => {
    const updated = (formData.milestones || []).map((m) =>
      m.id === id ? { ...m, active: !m.active } : m
    );
    setFormData({ ...formData, milestones: updated });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary">About Us CMS</h1>
          <p className="font-body-md text-xs text-secondary">
            Manage Company History, Hero Story, Our Vision, and Firm Evolution Milestones.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs flex items-center gap-2 font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
        >
          <Save className="w-4 h-4" /> Save All About Content
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> About Page Content Updated Successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-outline-variant">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`py-3 px-6 font-label-caps text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'hero'
              ? 'border-tertiary-fixed-dim text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          Hero & Story
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vision')}
          className={`py-3 px-6 font-label-caps text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'vision'
              ? 'border-tertiary-fixed-dim text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          Our Vision
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('milestones')}
          className={`py-3 px-6 font-label-caps text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'milestones'
              ? 'border-tertiary-fixed-dim text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          Firm Evolution / Milestones ({formData.milestones?.length || 0})
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: HERO & STORY */}
        {activeTab === 'hero' && (
          <div className="space-y-4 bg-surface p-6 border border-outline-variant">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Eyebrow Tagline
              </label>
              <input
                type="text"
                value={formData.heroEyebrow || ''}
                onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                placeholder="e.g. ABOUT SAPIOLUXE ENGICON"
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={formData.heroHeading || ''}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                placeholder="e.g. Engineering Unshakable Permanence."
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Hero Description
              </label>
              <textarea
                rows={3}
                value={formData.heroDescription || ''}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Company Story Paragraph
              </label>
              <textarea
                rows={4}
                value={formData.companyStory || ''}
                onChange={(e) => setFormData({ ...formData, companyStory: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {/* TAB 2: OUR VISION */}
        {activeTab === 'vision' && (
          <div className="space-y-4 bg-surface p-6 border border-outline-variant">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-tertiary-fixed-dim" />
                <h3 className="font-headline-md text-base font-bold text-primary">Our Vision Settings</h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer font-body-md text-xs text-primary font-semibold">
                <input
                  type="checkbox"
                  checked={formData.vision?.active ?? true}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: {
                        ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                        active: e.target.checked,
                      },
                    })
                  }
                  className="accent-tertiary-fixed-dim w-4 h-4"
                />
                <span>Enable Vision Section on About Us Page</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={formData.vision?.heading || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: {
                        ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                        heading: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Our Vision"
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  Vision Title
                </label>
                <input
                  type="text"
                  value={formData.vision?.title || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: {
                        ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Building a Better Future Through Engineering Excellence"
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Vision Description Statement
              </label>
              <textarea
                rows={5}
                value={formData.vision?.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vision: {
                      ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                      description: e.target.value,
                    },
                  })
                }
                placeholder="Write the comprehensive long-term vision of Sapioluxe Engicon..."
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  CTA Button Text (Optional)
                </label>
                <input
                  type="text"
                  value={formData.vision?.ctaText || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: {
                        ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                        ctaText: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Explore Our Projects"
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  CTA Link Destination
                </label>
                <input
                  type="text"
                  value={formData.vision?.ctaLink || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vision: {
                        ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                        ctaLink: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. /projects or /contact"
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <ImageUploader
                label="Vision Section Optional Image"
                value={formData.vision?.image}
                onUploadSuccess={(res) =>
                  setFormData({
                    ...formData,
                    vision: {
                      ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                      image: res.cloudinaryUrl,
                    },
                  })
                }
                onRemove={() =>
                  setFormData({
                    ...formData,
                    vision: {
                      ...(formData.vision || { heading: 'Our Vision', title: '', description: '', active: true }),
                      image: '',
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {/* TAB 3: FIRM EVOLUTION MILESTONES */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface p-4 border border-outline-variant">
              <div>
                <h3 className="font-headline-md text-base font-bold text-primary flex items-center gap-2">
                  <Milestone className="w-5 h-5 text-tertiary-fixed-dim" /> Firm Evolution Milestones
                </h3>
                <p className="font-body-md text-xs text-secondary">
                  Add, edit, reorder, or toggle key historical company milestones.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenMilestoneModal()}
                className="bg-primary text-on-primary px-4 py-2 font-label-caps text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
              >
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {(formData.milestones || [])
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className={`bg-surface border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                      m.active !== false ? 'border-outline-variant' : 'border-outline-variant/40 opacity-60'
                    }`}
                  >
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-technical text-lg font-bold text-tertiary-fixed-dim">
                          {m.year}
                        </span>
                        <h4 className="font-headline-md text-base font-bold text-primary">{m.title}</h4>
                        <span className="text-[10px] font-mono-technical text-secondary bg-surface-container px-2 py-0.5 border">
                          Order: {m.displayOrder}
                        </span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">{m.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleMilestoneActive(m.id)}
                        className={`p-2 border cursor-pointer transition-colors ${
                          m.active !== false
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-surface-variant text-secondary border-outline-variant'
                        }`}
                        title={m.active !== false ? 'Active' : 'Disabled'}
                      >
                        {m.active !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenMilestoneModal(m)}
                        className="p-2 border border-outline-variant text-primary hover:text-tertiary-fixed-dim cursor-pointer"
                        title="Edit Milestone"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-2 border border-outline-variant text-error hover:text-error/80 cursor-pointer"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </form>

      {/* Milestone Modal */}
      {isMilestoneModalOpen && editingMilestone && (
        <Modal
          isOpen={isMilestoneModalOpen}
          onClose={() => setIsMilestoneModalOpen(false)}
          title="Edit Company Milestone"
        >
          <form onSubmit={handleSaveMilestone} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  Year / Date
                </label>
                <input
                  required
                  type="text"
                  value={editingMilestone.year || ''}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                  placeholder="e.g. 2018"
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-mono-technical font-bold"
                />
              </div>

              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={editingMilestone.displayOrder || 1}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, displayOrder: Number(e.target.value) })
                  }
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-mono-technical"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-body-md text-xs text-primary font-semibold">
                  <input
                    type="checkbox"
                    checked={editingMilestone.active ?? true}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, active: e.target.checked })
                    }
                    className="accent-tertiary-fixed-dim w-4 h-4"
                  />
                  <span>Active Milestone</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Milestone Title
              </label>
              <input
                required
                type="text"
                value={editingMilestone.title || ''}
                onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                placeholder="e.g. Foundation of Sapioluxe Engicon"
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={editingMilestone.description || ''}
                onChange={(e) =>
                  setEditingMilestone({ ...editingMilestone, description: e.target.value })
                }
                placeholder="Describe this milestone accomplishment..."
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>

            <div>
              <ImageUploader
                label="Milestone Image (Optional)"
                value={editingMilestone.image}
                onUploadSuccess={(res) =>
                  setEditingMilestone({ ...editingMilestone, image: res.cloudinaryUrl })
                }
                onRemove={() => setEditingMilestone({ ...editingMilestone, image: '' })}
              />
            </div>

            <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="px-4 py-2 border border-outline-variant text-secondary text-xs font-label-caps font-bold cursor-pointer hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-on-primary px-6 py-2 font-label-caps text-xs font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
              >
                Save Milestone
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

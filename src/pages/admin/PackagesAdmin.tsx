import React, { useState } from 'react';
import { usePackages } from '../../hooks/useDataHooks';
import { Package, PackageSpec } from '../../types';
import { Modal } from '../../components/Modal';
import { ImageUploader } from '../../components/ImageUploader';
import { Plus, Edit2, Trash2, Shield, Wrench, Sparkles, Check, ListPlus, Layers } from 'lucide-react';

export const PackagesAdmin: React.FC = () => {
  const { packages, save: savePkg, remove: removePkg } = usePackages();
  const [editingPkg, setEditingPkg] = useState<Partial<Package> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'features' | 'materials'>('basic');

  const [newFeatureText, setNewFeatureText] = useState('');
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPkg({
        ...pkg,
        features: pkg.features ? [...pkg.features] : [],
        materialSpecs: pkg.materialSpecs ? pkg.materialSpecs.map((s) => ({ ...s })) : [],
        structuralWarranty: pkg.structuralWarranty || '20 Years',
        freeMaintenance: pkg.freeMaintenance || '1 Year Free Maintenance',
        isPopular: pkg.isPopular ?? false,
        isPublished: pkg.isPublished ?? true,
      });
    } else {
      setEditingPkg({
        id: `pkg_${Date.now()}`,
        name: 'New Custom Package',
        tier: `TIER 0${packages.length + 1}`,
        pricePerSqFt: 1800,
        unit: '₹/sq.ft',
        tagline: 'Custom material tier specification',
        structuralWarranty: '20 Years',
        freeMaintenance: '1 Year Free Maintenance',
        badge: '',
        features: [
          'Standard Premium Cement & Fe550 TMT Steel',
          'Standard Finishes & Vitrified Flooring',
          '20-Year Structural Warranty',
          '1-Year Free Maintenance',
        ],
        materialSpecs: [
          { name: 'Steel', value: 'Tata Tiscon Fe550D TMT' },
          { name: 'Cement', value: 'UltraTech / ACC PPC' },
          { name: 'Flooring', value: 'Vitrified 4x2 Tiles' },
          { name: 'Sanitaryware', value: 'Jaquar / Cera Premium' },
          { name: 'Electrical', value: 'Finolex Wires' },
          { name: 'Paint', value: 'Asian Paints Apex Exterior' },
        ],
        isPopular: false,
        order: packages.length + 1,
        isPublished: true,
      });
    }
    setActiveTab('basic');
    setNewFeatureText('');
    setNewSpecName('');
    setNewSpecValue('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg?.name) return;
    await savePkg(editingPkg as Package);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package tier?')) {
      await removePkg(id);
    }
  };

  // Features list management
  const handleAddFeature = () => {
    if (!newFeatureText.trim() || !editingPkg) return;
    const updatedFeatures = [...(editingPkg.features || []), newFeatureText.trim()];
    setEditingPkg({ ...editingPkg, features: updatedFeatures });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPkg?.features) return;
    const updatedFeatures = editingPkg.features.filter((_, idx) => idx !== index);
    setEditingPkg({ ...editingPkg, features: updatedFeatures });
  };

  const handleUpdateFeature = (index: number, val: string) => {
    if (!editingPkg?.features) return;
    const updatedFeatures = [...editingPkg.features];
    updatedFeatures[index] = val;
    setEditingPkg({ ...editingPkg, features: updatedFeatures });
  };

  // Material Specs list management
  const handleAddSpec = () => {
    if (!newSpecName.trim() || !editingPkg) return;
    const updatedSpecs: PackageSpec[] = [
      ...(editingPkg.materialSpecs || []),
      { name: newSpecName.trim(), value: newSpecValue.trim() || 'Standard' },
    ];
    setEditingPkg({ ...editingPkg, materialSpecs: updatedSpecs });
    setNewSpecName('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (index: number) => {
    if (!editingPkg?.materialSpecs) return;
    const updatedSpecs = editingPkg.materialSpecs.filter((_, idx) => idx !== index);
    setEditingPkg({ ...editingPkg, materialSpecs: updatedSpecs });
  };

  const handleUpdateSpec = (index: number, key: 'name' | 'value', val: string) => {
    if (!editingPkg?.materialSpecs) return;
    const updatedSpecs = [...editingPkg.materialSpecs];
    updatedSpecs[index] = { ...updatedSpecs[index], [key]: val };
    setEditingPkg({ ...editingPkg, materialSpecs: updatedSpecs });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary">Packages CMS</h1>
          <p className="font-body-md text-xs text-secondary">
            Manage Material Tiers, Pricing per Sq.Ft, Features, and Side-by-Side Specifications Matrix.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs flex items-center gap-2 font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
        >
          <Plus className="w-4 h-4" /> Add Package Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-surface border p-6 space-y-4 flex flex-col justify-between transition-all ${
              pkg.isPopular
                ? 'border-[#E9B84F] shadow-lg'
                : 'border-outline-variant'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-label-caps text-xs text-secondary uppercase font-semibold">
                  {pkg.tier}
                </span>
                <div className="flex items-center gap-2">
                  {pkg.isPopular && (
                    <span className="px-2 py-0.5 text-[10px] font-label-caps bg-[#E9B84F] text-[#18234F] font-bold uppercase">
                      POPULAR
                    </span>
                  )}
                  <span className="font-mono-technical font-bold text-tertiary-fixed-dim text-sm">
                    ₹{pkg.pricePerSqFt}/sq.ft
                  </span>
                </div>
              </div>

              <h3 className="font-headline-md text-xl font-bold text-primary">{pkg.name}</h3>
              <p className="font-body-md text-xs text-secondary line-clamp-2">{pkg.tagline}</p>

              <div className="pt-2 border-t border-outline-variant/40 space-y-1 text-xs text-primary font-medium">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-tertiary-fixed-dim shrink-0" />
                  <span>{pkg.structuralWarranty || '20 Years'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-tertiary-fixed-dim shrink-0" />
                  <span>{pkg.freeMaintenance || '1 Year Free Maintenance'}</span>
                </div>
              </div>

              <div className="text-[11px] font-mono-technical text-on-surface-variant pt-2 flex justify-between">
                <span>{pkg.features?.length || 0} Features</span>
                <span>{pkg.materialSpecs?.length || 0} Material Specs</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <span className={`text-[10px] font-label-caps px-2 py-0.5 ${pkg.isPublished ? 'bg-emerald-500/10 text-emerald-600 font-bold' : 'bg-surface-variant text-secondary'}`}>
                {pkg.isPublished ? 'PUBLISHED' : 'DRAFT'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(pkg)}
                  className="p-2 text-primary hover:text-tertiary-fixed-dim cursor-pointer"
                  title="Edit Package"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 text-error hover:text-error/80 cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingPkg && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit ${editingPkg.name || 'Package'}`}
        >
          <div className="space-y-6">
            {/* Modal Tabs */}
            <div className="flex border-b border-outline-variant">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-2 px-4 font-label-caps text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'basic'
                    ? 'border-tertiary-fixed-dim text-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`py-2 px-4 font-label-caps text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'features'
                    ? 'border-tertiary-fixed-dim text-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                Features ({editingPkg.features?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('materials')}
                className={`py-2 px-4 font-label-caps text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'materials'
                    ? 'border-tertiary-fixed-dim text-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                Side-by-Side Matrix Specs ({editingPkg.materialSpecs?.length || 0})
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary mb-1">
                        Package Name
                      </label>
                      <input
                        required
                        type="text"
                        value={editingPkg.name || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                        className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-xs text-secondary mb-1">
                        Tier Label
                      </label>
                      <input
                        type="text"
                        value={editingPkg.tier || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, tier: e.target.value })}
                        placeholder="e.g. TIER 01"
                        className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary mb-1">
                        Price per Sq.Ft (₹)
                      </label>
                      <input
                        required
                        type="number"
                        min={0}
                        value={editingPkg.pricePerSqFt || 0}
                        onChange={(e) =>
                          setEditingPkg({ ...editingPkg, pricePerSqFt: Number(e.target.value) })
                        }
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
                        value={editingPkg.order || 1}
                        onChange={(e) => setEditingPkg({ ...editingPkg, order: Number(e.target.value) })}
                        className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary mb-1">
                        Structural Warranty
                      </label>
                      <input
                        type="text"
                        value={editingPkg.structuralWarranty || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, structuralWarranty: e.target.value })}
                        placeholder="e.g. 20 Years"
                        className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-xs text-secondary mb-1">
                        Free Maintenance
                      </label>
                      <input
                        type="text"
                        value={editingPkg.freeMaintenance || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, freeMaintenance: e.target.value })}
                        placeholder="e.g. 1 Year Free Maintenance"
                        className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-secondary mb-1">
                      Tagline / Short Summary
                    </label>
                    <textarea
                      rows={2}
                      value={editingPkg.tagline || ''}
                      onChange={(e) => setEditingPkg({ ...editingPkg, tagline: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-xs text-secondary mb-1">
                        Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingPkg.badge || ''}
                        onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                        placeholder="e.g. MOST POPULAR"
                        className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-6 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer font-body-md text-xs text-primary font-semibold">
                        <input
                          type="checkbox"
                          checked={editingPkg.isPopular || false}
                          onChange={(e) => setEditingPkg({ ...editingPkg, isPopular: e.target.checked })}
                          className="accent-tertiary-fixed-dim w-4 h-4"
                        />
                        <span>Featured / Popular</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-body-md text-xs text-primary font-semibold">
                        <input
                          type="checkbox"
                          checked={editingPkg.isPublished ?? true}
                          onChange={(e) => setEditingPkg({ ...editingPkg, isPublished: e.target.checked })}
                          className="accent-tertiary-fixed-dim w-4 h-4"
                        />
                        <span>Published</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      label="Package Cover Image (Optional)"
                      value={editingPkg.image}
                      onUploadSuccess={(res) => setEditingPkg({ ...editingPkg, image: res.cloudinaryUrl })}
                      onRemove={() => setEditingPkg({ ...editingPkg, image: '' })}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: FEATURES */}
              {activeTab === 'features' && (
                <div className="space-y-4">
                  <p className="font-body-md text-xs text-secondary">
                    Manage key highlight bullet points displayed on the package cards.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="Add a new feature point..."
                      className="flex-grow bg-surface-container border border-outline-variant px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-primary text-on-primary px-4 py-2 font-label-caps text-xs font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {(editingPkg.features || []).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-surface-container/50 p-2 border border-outline-variant/30">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                          className="flex-grow bg-transparent border-b border-transparent focus:border-tertiary-fixed-dim text-xs font-body-md px-1 py-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-error hover:text-error/80 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MATERIAL SPECS (MATRIX) */}
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  <p className="font-body-md text-xs text-secondary">
                    These material specifications drive the dynamic <strong>Side-by-Side Comparison Matrix</strong> on the public Packages Page.
                  </p>

                  <div className="grid grid-cols-5 gap-2 bg-surface-container/60 p-3 border border-outline-variant/50">
                    <input
                      type="text"
                      value={newSpecName}
                      onChange={(e) => setNewSpecName(e.target.value)}
                      placeholder="Material Name (e.g. Steel, Cement, Doors)"
                      className="col-span-2 bg-surface border border-outline-variant px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Spec Description (e.g. Tata Tiscon Fe550D)"
                      className="col-span-2 bg-surface border border-outline-variant px-3 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="bg-primary text-on-primary py-2 font-label-caps text-xs font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {(editingPkg.materialSpecs || []).map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-5 gap-2 items-center bg-surface-container/30 p-2 border border-outline-variant/30">
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => handleUpdateSpec(idx, 'name', e.target.value)}
                          placeholder="Material Name"
                          className="col-span-2 bg-transparent border-b border-outline-variant/40 focus:border-tertiary-fixed-dim text-xs font-bold px-1 py-1"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                          placeholder="Specification"
                          className="col-span-2 bg-transparent border-b border-outline-variant/40 focus:border-tertiary-fixed-dim text-xs px-1 py-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="text-error hover:text-error/80 p-1 flex justify-center cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant text-secondary text-xs font-label-caps font-bold cursor-pointer hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-6 py-2 font-label-caps text-xs font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
                >
                  Save Package to Firestore
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

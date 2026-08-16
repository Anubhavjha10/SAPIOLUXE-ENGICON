import React, { useState, useEffect } from 'react';
import { getPackages, savePackage, deletePackage } from '../../services/packageService';
import { Package } from '../../types';
import { Modal } from '../../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const PackagesAdmin: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [editingPkg, setEditingPkg] = useState<Partial<Package> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const data = await getPackages();
    setPackages(data);
  };

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPkg({ ...pkg });
    } else {
      setEditingPkg({
        id: `pkg_${Date.now()}`,
        name: 'New Custom Package',
        tier: 'Standard Tier',
        pricePerSqFt: 1600,
        tagline: 'Custom material tier specification',
        features: ['Tata Steel Fe550D', 'UltraTech Cement', 'Vitrified Flooring'],
        isPopular: false,
        order: packages.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg?.name) return;
    await savePackage(editingPkg as Package);
    setIsModalOpen(false);
    loadPackages();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary">Packages CMS</h1>
          <p className="font-body-md text-xs text-secondary">Manage Material Tiers and Pricing per Sq.Ft.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs flex items-center gap-2 font-bold"
        >
          <Plus className="w-4 h-4" /> Add Package Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-surface border border-outline-variant p-6 space-y-4">
            <div className="flex justify-between items-start">
              <span className="font-label-caps text-xs text-secondary">{pkg.tier}</span>
              <span className="font-mono-technical font-bold text-tertiary-fixed-dim">
                ₹{pkg.pricePerSqFt}/sq.ft
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-primary">{pkg.name}</h3>
            <p className="font-body-md text-xs text-secondary">{pkg.tagline}</p>

            <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant">
              <button onClick={() => handleOpenModal(pkg)} className="p-2 text-primary">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingPkg && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Material Package"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Package Name</label>
              <input
                required
                type="text"
                value={editingPkg.name || ''}
                onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">Price per Sq.Ft (₹)</label>
                <input
                  type="number"
                  value={editingPkg.pricePerSqFt || 0}
                  onChange={(e) => setEditingPkg({ ...editingPkg, pricePerSqFt: Number(e.target.value) })}
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">Tier Label</label>
                <input
                  type="text"
                  value={editingPkg.tier || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, tier: e.target.value })}
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-on-primary py-3 font-label-caps text-xs font-bold">
              Save Package Rates
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

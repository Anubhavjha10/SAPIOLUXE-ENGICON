import React, { useState } from 'react';
import { useLocations } from '../../hooks/useDataHooks';
import { ServiceLocation } from '../../types';
import { Modal } from '../../components/Modal';
import { Plus, Edit2, Trash2, MapPin, Eye, EyeOff, Check, X } from 'lucide-react';

export const LocationsAdmin: React.FC = () => {
  const { locations, save: saveLoc, remove: removeLoc } = useLocations();
  const [editingLoc, setEditingLoc] = useState<Partial<ServiceLocation> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCityText, setNewCityText] = useState('');

  const handleOpenModal = (loc?: ServiceLocation) => {
    if (loc) {
      setEditingLoc({
        ...loc,
        cities: loc.cities ? [...loc.cities] : [],
        active: loc.active ?? true,
      });
    } else {
      setEditingLoc({
        id: `loc_${Date.now()}`,
        name: '',
        description: '',
        cities: [],
        displayOrder: locations.length + 1,
        active: true,
      });
    }
    setNewCityText('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoc?.name) return;
    await saveLoc(editingLoc as ServiceLocation);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service location?')) {
      await removeLoc(id);
    }
  };

  const handleToggleActive = async (loc: ServiceLocation) => {
    await saveLoc({ ...loc, active: !loc.active });
  };

  // Cities List Management inside modal
  const handleAddCity = () => {
    if (!newCityText.trim() || !editingLoc) return;
    const currentCities = editingLoc.cities || [];
    if (!currentCities.includes(newCityText.trim())) {
      setEditingLoc({
        ...editingLoc,
        cities: [...currentCities, newCityText.trim()],
      });
    }
    setNewCityText('');
  };

  const handleRemoveCity = (cityToRemove: string) => {
    if (!editingLoc?.cities) return;
    setEditingLoc({
      ...editingLoc,
      cities: editingLoc.cities.filter((c) => c !== cityToRemove),
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary">Service Locations</h1>
          <p className="font-body-md text-xs text-secondary">
            Manage firm service availability states, regional cities, and display ordering.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs flex items-center gap-2 font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
        >
          <Plus className="w-4 h-4" /> Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className={`bg-surface border p-6 space-y-4 flex flex-col justify-between transition-all ${
              loc.active ? 'border-outline-variant' : 'border-outline-variant/40 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-tertiary-fixed-dim shrink-0" />
                  <h3 className="font-headline-md text-xl font-bold text-primary">{loc.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-technical bg-surface-container px-2 py-0.5 border border-outline-variant">
                    Order: {loc.displayOrder}
                  </span>
                  <span
                    className={`text-[10px] font-label-caps px-2 py-0.5 font-bold ${
                      loc.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-surface-variant text-secondary'
                    }`}
                  >
                    {loc.active ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>
              </div>

              {loc.description && (
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                  {loc.description}
                </p>
              )}

              {/* Cities Tag List */}
              <div className="pt-2">
                <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest block mb-2">
                  Key Service Cities / Regions ({loc.cities?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(loc.cities || []).map((city, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-container text-primary font-mono-technical text-[11px] px-2.5 py-1 border border-outline-variant/50"
                    >
                      {city}
                    </span>
                  ))}
                  {(!loc.cities || loc.cities.length === 0) && (
                    <span className="text-xs text-secondary italic">No cities listed yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => handleToggleActive(loc)}
                className={`text-xs font-label-caps flex items-center gap-1.5 cursor-pointer font-semibold ${
                  loc.active ? 'text-emerald-600 hover:text-emerald-700' : 'text-secondary hover:text-primary'
                }`}
              >
                {loc.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{loc.active ? 'Active on Website' : 'Hidden from Website'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(loc)}
                  className="p-2 text-primary hover:text-tertiary-fixed-dim cursor-pointer"
                  title="Edit Location"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="p-2 text-error hover:text-error/80 cursor-pointer"
                  title="Delete Location"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Location Modal */}
      {isModalOpen && editingLoc && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingLoc.name ? `Edit Location: ${editingLoc.name}` : 'Add Service Location'}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  Location Name *
                </label>
                <input
                  required
                  type="text"
                  value={editingLoc.name || ''}
                  onChange={(e) => setEditingLoc({ ...editingLoc, name: e.target.value })}
                  placeholder="e.g. Odisha or West Bengal"
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={editingLoc.displayOrder || 1}
                  onChange={(e) =>
                    setEditingLoc({ ...editingLoc, displayOrder: Number(e.target.value) })
                  }
                  className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm font-mono-technical"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Short Description (Optional)
              </label>
              <textarea
                rows={3}
                value={editingLoc.description || ''}
                onChange={(e) => setEditingLoc({ ...editingLoc, description: e.target.value })}
                placeholder="e.g. Complete turnkey residential & commercial construction services across Odisha."
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>

            {/* Cities / Areas Manager */}
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">
                Key Cities / Operational Areas
              </label>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCityText}
                  onChange={(e) => setNewCityText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCity();
                    }
                  }}
                  placeholder="Enter city name (e.g. Bhubaneswar, Kolkata) and press Enter..."
                  className="flex-grow bg-surface-container border border-outline-variant px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCity}
                  className="bg-primary text-on-primary px-4 py-2 font-label-caps text-xs font-bold cursor-pointer hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all"
                >
                  + Add City
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-surface-container/40 border border-outline-variant/40">
                {(editingLoc.cities || []).map((city, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-surface text-primary font-mono-technical text-xs px-2.5 py-1 border border-outline-variant"
                  >
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(city)}
                      className="text-secondary hover:text-error transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {(!editingLoc.cities || editingLoc.cities.length === 0) && (
                  <span className="text-xs text-secondary italic">No cities added yet.</span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-body-md text-xs text-primary font-semibold">
                <input
                  type="checkbox"
                  checked={editingLoc.active ?? true}
                  onChange={(e) => setEditingLoc({ ...editingLoc, active: e.target.checked })}
                  className="accent-tertiary-fixed-dim w-4 h-4"
                />
                <span>Active / Published on Website</span>
              </label>
            </div>

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
                Save Location
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

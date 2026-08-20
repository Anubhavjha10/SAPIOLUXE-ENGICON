import React, { useState, useEffect } from 'react';
import { getServices, saveService, deleteService } from '../../services/serviceService';
import { Service } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Modal } from '../../components/Modal';
import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const ServicesAdmin: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await getServices();
    setServices(data);
  };

  const handleOpenModal = (srv?: Service) => {
    if (srv) {
      setEditingService({ ...srv });
    } else {
      setEditingService({
        id: '',
        title: '',
        subtitle: '',
        category: 'Residential',
        description: '',
        features: [],
        order: services.length + 1,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;
    await saveService(editingService as Service);
    setIsModalOpen(false);
    loadServices();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await deleteService(id);
      loadServices();
    }
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editingService) return;
    const current = editingService.features || [];
    setEditingService({ ...editingService, features: [...current, featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    if (!editingService || !editingService.features) return;
    setEditingService({
      ...editingService,
      features: editingService.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary">Services CMS</h1>
          <p className="font-body-md text-xs text-secondary">
            Manage Turnkey Capabilities and Service Offering Cards.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs flex items-center gap-2 font-bold"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {services.map((srv) => (
          <div key={srv.id} className="bg-surface border border-outline-variant p-5 space-y-3 relative">
            <div className="aspect-[16/9] w-full bg-surface-variant overflow-hidden">
              <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-headline-md text-lg font-bold text-primary">{srv.title}</h3>
            <p className="font-body-md text-xs text-secondary">{srv.subtitle}</p>

            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
              <button
                onClick={() => handleOpenModal(srv)}
                className="p-2 text-primary hover:bg-surface-container"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(srv.id)}
                className="p-2 text-error hover:bg-error-container"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingService && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingService.id ? 'Edit Service' : 'Add Service'}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Title *</label>
              <input
                required
                type="text"
                value={editingService.title || ''}
                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Subtitle</label>
              <input
                type="text"
                value={editingService.subtitle || ''}
                onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Description</label>
              <textarea
                rows={3}
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full bg-surface-container border border-outline-variant px-3 py-2 text-sm"
              />
            </div>

            <ImageUploader
              value={editingService.image}
              label="Service Media Image"
              onUploadSuccess={(res) => setEditingService({ ...editingService, image: res.cloudinaryUrl })}
            />

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-2">Features List</label>
              <div className="space-y-1 mb-2">
                {(editingService.features || []).map((f, i) => (
                  <div key={i} className="flex justify-between items-center bg-surface-container p-2 text-xs">
                    <span>{f}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="text-error">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g. 240+ Quality Audits"
                  className="flex-1 bg-surface-container border px-3 py-1 text-xs"
                />
                <button type="button" onClick={addFeature} className="bg-primary text-on-primary px-3 py-1 text-xs">
                  Add Feature
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-on-primary py-3 font-label-caps text-xs font-bold">
              Save Service Details
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

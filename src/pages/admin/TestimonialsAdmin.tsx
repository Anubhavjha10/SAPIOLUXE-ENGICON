import React, { useState, useEffect } from 'react';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '../../services/testimonialService';
import { Testimonial } from '../../types';
import { Modal } from '../../components/Modal';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

export const TestimonialsAdmin: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    const data = await getTestimonials();
    setTestimonials(data);
  };

  const handleOpenModal = (t?: Testimonial) => {
    if (t) {
      setEditingItem({ ...t });
    } else {
      setEditingItem({
        id: '',
        author: '',
        role: 'Homeowner',
        quote: '',
        rating: 5,
        location: 'Bhubaneswar',
        projectRef: 'Turnkey Villa',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.author) return;
    await saveTestimonial(editingItem as Testimonial);
    setIsModalOpen(false);
    loadTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete client quote?')) {
      await deleteTestimonial(id);
      loadTestimonials();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary">Testimonials CMS</h1>
          <p className="font-body-md text-xs text-secondary">Manage Client Reviews & Endorsements.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs flex items-center gap-2 font-bold"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-surface border border-outline-variant p-6 space-y-3">
            <div className="flex text-tertiary-fixed-dim">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="font-body-md text-xs text-on-surface-variant italic">"{t.quote}"</p>
            <div className="pt-3 border-t border-outline-variant">
              <h4 className="font-bold text-primary text-sm">{t.author}</h4>
              <p className="text-[11px] text-secondary">{t.role} • {t.location}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => handleOpenModal(t)} className="p-1 text-primary">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-1 text-error">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Testimonial"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Author Name *</label>
              <input
                required
                type="text"
                value={editingItem.author || ''}
                onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Role / Designation</label>
              <input
                type="text"
                value={editingItem.role || ''}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Client Quote</label>
              <textarea
                rows={4}
                value={editingItem.quote || ''}
                onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-on-primary py-3 font-label-caps text-xs font-bold">
              Save Review
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

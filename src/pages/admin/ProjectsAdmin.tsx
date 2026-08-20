import React, { useState, useEffect } from 'react';
import { getProjects, saveProject, deleteProject } from '../../services/projectService';
import { Project } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Modal } from '../../components/Modal';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export const ProjectsAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const handleOpenModal = (prj?: Project) => {
    if (prj) {
      setEditingProject({ ...prj });
    } else {
      setEditingProject({
        id: '',
        title: '',
        subtitle: '',
        category: 'Residential',
        location: 'Patia, Bhubaneswar',
        areaSqFt: 3500,
        completionYear: '2024',
        description: '',
        highlights: [],
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    await saveProject(editingProject as Project);
    setIsModalOpen(false);
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this project landmark?')) {
      await deleteProject(id);
      loadProjects();
    }
  };

  const addHighlight = () => {
    if (!highlightInput.trim() || !editingProject) return;
    const current = editingProject.highlights || [];
    setEditingProject({ ...editingProject, highlights: [...current, highlightInput.trim()] });
    setHighlightInput('');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary">Projects Portfolio CMS</h1>
          <p className="font-body-md text-xs text-secondary">
            Manage Completed Projects across Odisha & West Bengal.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-on-primary px-6 py-3 font-label-caps text-xs flex items-center gap-2 font-bold"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {projects.map((prj) => (
          <div key={prj.id} className="bg-surface border border-outline-variant p-5 space-y-3">
            <div className="aspect-[4/3] w-full bg-surface-variant overflow-hidden">
              <img src={prj.image} alt={prj.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-label-caps bg-surface-container px-2 py-0.5 text-secondary uppercase">
                {prj.category}
              </span>
              <h3 className="font-headline-md text-lg font-bold text-primary mt-1">{prj.title}</h3>
              <p className="font-body-md text-xs text-secondary">{prj.location} • {prj.areaSqFt} sq.ft</p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant">
              <button onClick={() => handleOpenModal(prj)} className="p-2 text-primary">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(prj.id)} className="p-2 text-error">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingProject && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject.id ? 'Edit Project' : 'Add New Project Landmark'}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">Category</label>
                <select
                  value={editingProject.category || 'Residential'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Interior">Interior</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">Location</label>
                <input
                  type="text"
                  value={editingProject.location || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">Area (Sq.Ft)</label>
                <input
                  type="number"
                  value={editingProject.areaSqFt || 0}
                  onChange={(e) => setEditingProject({ ...editingProject, areaSqFt: Number(e.target.value) })}
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block font-label-caps text-xs text-secondary mb-1">Year</label>
                <input
                  type="text"
                  value={editingProject.completionYear || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, completionYear: e.target.value })}
                  className="w-full bg-surface-container border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-secondary mb-1">Description</label>
              <textarea
                rows={3}
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full bg-surface-container border px-3 py-2 text-sm"
              />
            </div>

            <ImageUploader
              value={editingProject.image}
              label="Project Main Image"
              onUploadSuccess={(res) => setEditingProject({ ...editingProject, image: res.cloudinaryUrl })}
            />

            <button type="submit" className="w-full bg-primary text-on-primary py-3 font-label-caps text-xs font-bold">
              Save Project Entry
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

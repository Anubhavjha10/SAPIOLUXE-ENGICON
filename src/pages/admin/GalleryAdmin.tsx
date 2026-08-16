import React, { useState, useEffect } from 'react';
import { getGalleryImages, saveGalleryImage, deleteGalleryImage } from '../../services/galleryService';
import { GalleryImage } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Plus, Trash2, Images } from 'lucide-react';

export const GalleryAdmin: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Residential');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const data = await getGalleryImages();
    setImages(data);
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) return;

    await saveGalleryImage({
      id: `gal_${Date.now()}`,
      title: newTitle || 'Sapioluxe Site Media',
      category: newCategory as any,
      cloudinaryUrl: uploadedUrl,
      altText: newTitle || 'Site Construction Action',
      createdAt: new Date().toISOString(),
    });

    setNewTitle('');
    setUploadedUrl(null);
    loadGallery();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete image from CMS gallery?')) {
      await deleteGalleryImage(id);
      loadGallery();
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-outline-variant pb-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary">Gallery & Assets CMS</h1>
        <p className="font-body-md text-xs text-secondary">
          Upload and manage high-resolution site images in the Media Library.
        </p>
      </div>

      <div className="bg-surface-container-lowest ghost-border p-6 max-w-2xl space-y-4">
        <h3 className="font-headline-md text-base font-bold text-primary">Upload New Media Asset</h3>
        <form onSubmit={handleAddImage} className="space-y-4">
          <div>
            <label className="block font-label-caps text-xs text-secondary mb-1">Image Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Patia Luxury Villa Rebar Quality Inspection"
              className="w-full bg-surface-container border px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-label-caps text-xs text-secondary mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-surface-container border px-3 py-2 text-xs"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Interior">Interior</option>
              <option value="Site Action">Site Action</option>
              <option value="Architectural">Architectural</option>
            </select>
          </div>

          <ImageUploader
            value={uploadedUrl || undefined}
            onUploadSuccess={(res) => setUploadedUrl(res.cloudinaryUrl)}
          />

          <button
            type="submit"
            disabled={!uploadedUrl}
            className="w-full bg-primary text-on-primary py-3 font-label-caps text-xs font-bold disabled:opacity-50"
          >
            Publish to Site Gallery
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-[4/3] bg-surface-variant group overflow-hidden ghost-border">
            <img src={img.cloudinaryUrl} alt={img.altText} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
              <span className="text-[10px] font-label-caps bg-primary/80 px-2 py-0.5 self-start">
                {img.category}
              </span>
              <button
                onClick={() => handleDelete(img.id)}
                className="bg-error text-white p-2 self-end hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { GalleryImage } from '../types';

interface GalleryGridProps {
  images: GalleryImage[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ images }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryImage | null>(null);

  const categories = ['All', 'Residential', 'Commercial', 'Interior', 'Site Action', 'Architectural'];

  const filteredImages =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 font-label-caps text-xs transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            onClick={() => setActiveLightboxImage(img)}
            className="group cursor-pointer relative aspect-[4/3] bg-surface-variant overflow-hidden ghost-border"
          >
            <img
              src={img.cloudinaryUrl}
              alt={img.altText}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
              <span className="self-end bg-primary/80 text-[10px] font-label-caps px-2 py-0.5 uppercase tracking-widest text-tertiary-fixed-dim">
                {img.category}
              </span>
              <div>
                <h4 className="font-headline-md text-sm font-bold">{img.title}</h4>
                <p className="font-body-md text-xs text-surface-variant truncate">{img.altText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-6 right-6 text-white p-2 hover:text-tertiary-fixed-dim transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={activeLightboxImage.cloudinaryUrl}
              alt={activeLightboxImage.altText}
              className="max-h-[75vh] w-auto object-contain ghost-border mb-4"
            />
            <div className="text-center text-white">
              <h3 className="font-headline-md text-xl font-bold">{activeLightboxImage.title}</h3>
              <p className="font-body-md text-sm text-secondary">{activeLightboxImage.altText}</p>
              <span className="inline-block mt-2 font-mono-technical text-xs text-tertiary-fixed-dim">
                Category: {activeLightboxImage.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

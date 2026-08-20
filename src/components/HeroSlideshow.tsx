import React, { useState, useEffect } from 'react';
import { BackgroundShader } from './BackgroundShader';

interface HeroSlideshowProps {
  images?: string[];
  intervalMs?: number;
}

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80',
];

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  images,
  intervalMs = 5000,
}) => {
  // Clean and filter valid non-empty URLs
  const activeImages = (images && images.length > 0)
    ? images.map(img => String(img).trim()).filter(img => img.length > 0)
    : DEFAULT_HERO_IMAGES;

  const validImages = activeImages.length > 0 ? activeImages : DEFAULT_HERO_IMAGES;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [validImages.length, intervalMs]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {validImages.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={`${src}-${index}`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={src}
              alt=""
              className={`w-full h-full object-cover filter brightness-[0.8] contrast-[1.05] transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              onError={(e) => {
                // Gracefully hide broken images
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        );
      })}

      {/* Fallback shader if images array is empty */}
      {validImages.length === 0 && (
        <BackgroundShader className="absolute inset-0 w-full h-full object-cover z-0" />
      )}

      {/* Dark luxury overlay matching Sapioluxe Engicon design language */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80 z-20" />
    </div>
  );
};

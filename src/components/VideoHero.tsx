import React from 'react';
import { HeroSlideshow } from './HeroSlideshow';

interface VideoHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  overlayOpacity?: string;
  backgroundImages?: string[];
}

export const normalizeVideoUrl = (url?: string): string => {
  if (!url) return '';
  let cleaned = String(url).trim();
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
};

export const VideoHero: React.FC<VideoHeroProps> = ({
  backgroundImages,
}) => {
  return <HeroSlideshow images={backgroundImages} />;
};

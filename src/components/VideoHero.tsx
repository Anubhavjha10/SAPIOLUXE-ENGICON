import React, { useState, useEffect } from 'react';
import { BackgroundShader } from './BackgroundShader';

interface VideoHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  overlayOpacity?: string;
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
  videoUrl,
  posterUrl,
}) => {
  const [hasVideoError, setHasVideoError] = useState(false);
  const cleanUrl = normalizeVideoUrl(videoUrl);

  // Reset video error state whenever the video URL prop changes
  useEffect(() => {
    setHasVideoError(false);
  }, [cleanUrl]);

  const isValidUrl =
    cleanUrl.length > 0 &&
    (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('/'));

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {!hasVideoError && isValidUrl ? (
        <video
          key={cleanUrl}
          src={cleanUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={posterUrl}
          onError={(e) => {
            console.warn('Hero video load notice (switching to background shader fallback):', cleanUrl, e);
            setHasVideoError(true);
          }}
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.75] contrast-[1.1]"
        />
      ) : (
        <BackgroundShader className="absolute inset-0 w-full h-full object-cover z-0" />
      )}
      {/* Dark luxury overlay matching Stitch styling */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-[1]" />
    </div>
  );
};

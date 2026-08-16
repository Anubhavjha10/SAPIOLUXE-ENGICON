import { useState, useEffect } from 'react';
import { BrandingSettings } from '../types';
import { INITIAL_BRANDING_DATA } from '../firebase/seed';
import { getBrandingSettings, updateBrandingSettings, subscribeToBrandingSettings } from '../services/brandingService';

export const useBranding = () => {
  const [branding, setBranding] = useState<BrandingSettings>(INITIAL_BRANDING_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial fetch
    getBrandingSettings().then((data) => {
      setBranding(data);
      setIsLoading(false);
    });

    // Real-time listener
    const unsubscribe = subscribeToBrandingSettings((data) => {
      setBranding(data);
      setIsLoading(false);

      // Dynamically update Favicon in document <head>
      if (data.favicon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = data.favicon;
      }
    });

    return () => unsubscribe();
  }, []);

  const update = async (newSettings: BrandingSettings) => {
    const updated = await updateBrandingSettings(newSettings);
    setBranding(updated);
    return updated;
  };

  return {
    branding,
    logo: branding.logo || INITIAL_BRANDING_DATA.logo,
    footerLogo: branding.footerLogo || branding.logo || INITIAL_BRANDING_DATA.footerLogo,
    favicon: branding.favicon || INITIAL_BRANDING_DATA.favicon,
    brandName: branding.brandName || INITIAL_BRANDING_DATA.brandName,
    tagline: branding.tagline || INITIAL_BRANDING_DATA.tagline,
    isLoading,
    update,
  };
};

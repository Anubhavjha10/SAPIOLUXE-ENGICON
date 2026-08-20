import { getDocumentData, saveDocumentData, getCollectionData } from './firestore';
import {
  INITIAL_FOUNDER_DATA,
  INITIAL_PACKAGES_DATA,
  INITIAL_SERVICES_DATA,
  INITIAL_PROJECTS_DATA,
  INITIAL_TESTIMONIALS_DATA,
  INITIAL_GALLERY_DATA,
  INITIAL_HOMEPAGE_DATA,
  INITIAL_CONTACT_DATA,
  INITIAL_INQUIRIES_DATA,
} from '../data/mockData';
import { INITIAL_LOCATIONS_DATA } from '../services/locationService';
import { BrandingSettings, AboutPageContent } from '../types';

export const INITIAL_BRANDING_DATA: BrandingSettings = {
  brandName: 'SAPIOLUXE ENGICON',
  tagline: 'PREMIUM ARCHITECTURE & CIVIL ENGINEERING',
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfI1MlTUnDmqA8fh6b1WnzMTzsfUjtdi1PLz8ccGFyggeXyX1Jn7Re0369LfODYzobvm5aX-lDQAHSf9DtjzZeVaU_bWvAOq1vMs5NMP0KcO8LCCw5g90d7uayen1uQ5DEyNbdjXertNvJA3qrB1b0ImAPBdpM69oFenFgeNmmrYte2EOpp4LdP7gKcqoNMPPfJzdkWcwJbcFX21SKFDNvyFG9_eYb5GGaSaR6IwzhmFs7Dcu2dyaL',
  footerLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfI1MlTUnDmqA8fh6b1WnzMTzsfUjtdi1PLz8ccGFyggeXyX1Jn7Re0369LfODYzobvm5aX-lDQAHSf9DtjzZeVaU_bWvAOq1vMs5NMP0KcO8LCCw5g90d7uayen1uQ5DEyNbdjXertNvJA3qrB1b0ImAPBdpM69oFenFgeNmmrYte2EOpp4LdP7gKcqoNMPPfJzdkWcwJbcFX21SKFDNvyFG9_eYb5GGaSaR6IwzhmFs7Dcu2dyaL',
  favicon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfI1MlTUnDmqA8fh6b1WnzMTzsfUjtdi1PLz8ccGFyggeXyX1Jn7Re0369LfODYzobvm5aX-lDQAHSf9DtjzZeVaU_bWvAOq1vMs5NMP0KcO8LCCw5g90d7uayen1uQ5DEyNbdjXertNvJA3qrB1b0ImAPBdpM69oFenFgeNmmrYte2EOpp4LdP7gKcqoNMPPfJzdkWcwJbcFX21SKFDNvyFG9_eYb5GGaSaR6IwzhmFs7Dcu2dyaL',
  lightLogo: '',
  darkLogo: '',
};

export const INITIAL_ABOUT_DATA: AboutPageContent = {
  heroEyebrow: 'ABOUT SAPIOLUXE ENGICON',
  heroHeading: 'Engineering Trust.\nBuilding Perfections.',
  heroDescription: "Sapioluxe Engicon is a premier construction and architectural engineering firm, delivering high-end residential luxury homes and landmark commercial spaces across Odisha & West Bengal.",
  companyStory: 'Founded by Er. Ranjit Das, Sapioluxe Engicon was established with a singular vision: to eliminate compromise in construction. By introducing 240+ structural quality audits, fixed-price contracts, and architectural mastery, we have transformed how Odisha & West Bengal builds.',
  leadershipSection: 'Led by chartered civil engineers and veteran architects, our team brings over 18 years of field excellence to every project.',
  companyStatistics: [
    { label: 'Delivered Projects', value: '50+' },
    { label: 'Structural Warranty', value: '20 Years' },
    { label: 'Milestone Audits', value: '240+' },
    { label: 'On-Time Rate', value: '100%' },
  ],
  corePillars: [
    { id: '1', title: 'Uncompromising Quality', description: '240+ point milestone inspection framework verified by chartered engineers.', icon: 'ShieldCheck', order: 1, active: true },
    { id: '2', title: 'Transparent Pricing', description: 'Detailed BOQ breakdown with guaranteed fixed-price contracts.', icon: 'CheckCircle2', order: 2, active: true },
    { id: '3', title: 'Timely Execution', description: 'Strict milestone-based delivery with penalty-backed timelines.', icon: 'Clock', order: 3, active: true },
    { id: '4', title: 'Luxury Aesthetics', description: 'Seamless integration of structural durability and high-end design.', icon: 'Sparkles', order: 4, active: true },
  ],
  vision: {
    heading: 'Our Vision',
    title: 'Building a Better Future Through Engineering Excellence',
    description: 'Sapioluxe Engicon envisions setting the benchmark in luxury construction and civil engineering across Eastern India (Odisha & West Bengal) by establishing transparent fixed-price contracts, 240+ point structural quality audits, and timeless architectural craftsmanship.',
    image: '',
    ctaText: 'Explore Projects',
    ctaLink: '/projects',
    active: true,
  },
  milestones: [
    { id: 'm1', year: '2006', title: 'Foundation Laid', description: 'Established in Bhubaneswar as a boutique structural engineering consultancy.', displayOrder: 1, active: true },
    { id: 'm2', year: '2012', title: 'Commercial Expansion', description: 'Delivered initial landmark 10-story corporate headquarters in Infocity.', displayOrder: 2, active: true },
    { id: 'm3', year: '2018', title: 'Ultra-Luxury Residential Launch', description: 'Introduced fixed-price contract modeling and 240+ point quality audits.', displayOrder: 3, active: true },
    { id: 'm4', year: '2024', title: 'Regional Leadership', description: 'Surpassed 50+ flagship completed landmarks across Odisha & West Bengal with 100% on-time delivery record.', displayOrder: 4, active: true },
  ],
};

/**
 * Idempotent initializer: Populates Firestore collections with sensible default values
 * ONLY if the documents/collections do not already exist.
 */
export async function initializeFirstTimeData(): Promise<void> {
  try {
    // 1. Homepage Content
    const homepageDoc = await getDocumentData('homepage', 'content');
    if (!homepageDoc) {
      await saveDocumentData('homepage', 'content', INITIAL_HOMEPAGE_DATA);
    }

    // 2. Founder Data
    const founderDoc = await getDocumentData('founder', 'info');
    if (!founderDoc) {
      await saveDocumentData('founder', 'info', INITIAL_FOUNDER_DATA);
    }

    // 3. About Page Content
    const aboutDoc = await getDocumentData('about', 'content');
    if (!aboutDoc) {
      await saveDocumentData('about', 'content', INITIAL_ABOUT_DATA);
    }

    // 4. Branding Settings
    const brandingDoc = await getDocumentData('branding', 'settings');
    if (!brandingDoc) {
      await saveDocumentData('branding', 'settings', INITIAL_BRANDING_DATA);
    }

    // 5. Contact & Site Settings
    const contactDoc = await getDocumentData('contact', 'info');
    if (!contactDoc) {
      await saveDocumentData('contact', 'info', INITIAL_CONTACT_DATA);
    }

    // 6. Services Collection
    const services = await getCollectionData('services');
    if (services.length === 0) {
      for (const service of INITIAL_SERVICES_DATA) {
        await saveDocumentData('services', service.id, service);
      }
    }

    // 7. Packages Collection
    const packages = await getCollectionData('packages');
    if (packages.length === 0) {
      for (const pkg of INITIAL_PACKAGES_DATA) {
        await saveDocumentData('packages', pkg.id, pkg);
      }
    }

    // 8. Projects Collection
    const projects = await getCollectionData('projects');
    if (projects.length === 0) {
      for (const prj of INITIAL_PROJECTS_DATA) {
        await saveDocumentData('projects', prj.id, {
          ...prj,
          slug: prj.id,
          year: prj.completionYear,
          duration: '12 Months',
          services: ['Turnkey Construction', 'Structural Engineering', 'Architectural Design'],
        });
      }
    }

    // 9. Testimonials Collection
    const testimonials = await getCollectionData('testimonials');
    if (testimonials.length === 0) {
      for (const item of INITIAL_TESTIMONIALS_DATA) {
        await saveDocumentData('testimonials', item.id, item);
      }
    }

    // 10. Gallery Collection
    const gallery = await getCollectionData('gallery');
    if (gallery.length === 0) {
      for (const item of INITIAL_GALLERY_DATA) {
        await saveDocumentData('gallery', item.id, item);
      }
    }

    // 11. Service Locations Collection
    const locations = await getCollectionData('locations');
    if (locations.length === 0) {
      for (const loc of INITIAL_LOCATIONS_DATA) {
        await saveDocumentData('locations', loc.id, loc);
      }
    }

    // 12. Leads Collection
    const leads = await getCollectionData('leads');
    if (leads.length === 0) {
      for (const lead of INITIAL_INQUIRIES_DATA) {
        await saveDocumentData('leads', lead.id, lead);
      }
    }
  } catch (err) {
    console.warn('Idempotent Firestore initialization notice:', err);
  }
}

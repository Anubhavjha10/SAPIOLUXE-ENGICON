export interface Founder {
  id?: string;
  name: string;
  title: string;
  quote: string;
  bio: string;
  fullBio?: string;
  deskHeading?: string;
  deskDescription?: string;
  image: string;
  experienceYears: number;
  projectsCompleted: number;
  qualityAudits: number;
  specs: string[];
  updatedAt?: string;
}

export interface Service {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription?: string;
  category: 'Residential' | 'Commercial' | 'Civil' | 'Interior' | 'Consulting';
  features: string[];
  image: string;
  iconName: string;
  startingPrice?: string;
  isPublished: boolean;
  order: number;
  updatedAt?: string;
}

export interface PackageSpec {
  name: string;
  value: string;
}

export interface Package {
  id: string;
  name: 'Classic' | 'Premium' | 'Luxury' | string;
  tier: string; // e.g. TIER 01
  pricePerSqFt: number;
  unit: string; // e.g. "₹/sq.ft"
  tagline: string;
  description?: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  materialSpecs: PackageSpec[];
  image?: string;
  isPublished: boolean;
  order: number;
  updatedAt?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: 'Residential' | 'Commercial' | 'Interior' | 'Civil';
  location: string;
  areaSqFt: number;
  completionYear: string;
  year?: string;
  duration?: string;
  clientName?: string;
  image: string;
  galleryImages?: string[];
  description: string;
  services?: string[];
  highlights: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number; // in INR
  unit: string;  // e.g. "lump sum", "sq.ft"
  description: string;
  isDefaultSelected?: boolean;
  active?: boolean;
}

export interface LocationRate {
  id: string;
  location: string;
  district: string;
  rateAdjustment: number; // percentage or fixed multiplier e.g. 0 (standard), +50 (Rs 50 extra), etc.
  active: boolean;
}

export interface CostBreakdownItem {
  name: string;
  percentage: number;
}

export interface EstimatorConfig {
  rates: {
    classic: number;  // 1400
    premium: number;  // 1750
    luxury: number;   // 2200
  };
  floorMultipliers: Record<string, number>; // "G": 1, "G+1": 2, "G+2": 3, "G+3": 4
  addOns: AddOnItem[];
  locationRates?: LocationRate[];
  costBreakdown?: CostBreakdownItem[];
  updatedAt?: string;
}

export interface EstimatorCalculationInput {
  location: string;
  plotArea: number;
  floorCount: 'G' | 'G+1' | 'G+2' | 'G+3';
  packageId: 'classic' | 'premium' | 'luxury' | string;
  selectedAddOnIds: string[];
}

export interface EstimatorResult {
  plotArea: number;
  floorCount: string;
  builtUpArea: number;
  ratePerSqFt: number;
  baseConstructionCost: number;
  addOnsBreakdown: { id: string; name: string; cost: number }[];
  addOnsTotal: number;
  locationAdjustment: number;
  estimatedTotalBudget: number; // in INR
  estimatedTotalLakhs: string;  // e.g. "44.90"
  categoryBreakdown: { name: string; percentage: number; cost: number }[];
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  projectRef?: string;
  image?: string;
  isFeatured: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Interior' | 'Site Action' | 'Architectural';
  cloudinaryUrl: string;
  publicId?: string;
  altText: string;
  width?: number;
  height?: number;
  mediaType?: 'image' | 'video';
  projectId?: string;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
}

export interface HomepageContent {
  heroTagline: string; // eyebrow
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaPrimaryLink?: string;
  heroCtaSecondary: string;
  heroCtaSecondaryLink?: string;
  heroVideoUrl: string;
  heroPosterUrl?: string;
  heroOverlayIntensity?: number; // 0 to 100
  stats: { label: string; value: string; icon: string }[];
  updatedAt?: string;
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface AboutPageContent {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  companyStory: string;
  leadershipSection: string;
  companyStatistics: { label: string; value: string }[];
  corePillars: Pillar[];
  updatedAt?: string;
}

export interface BrandingSettings {
  logo: string; // PNG format requirement
  favicon: string; // PNG format requirement
  footerLogo: string; // PNG format requirement
  lightLogo?: string;
  darkLogo?: string;
  brandName: string;
  tagline: string;
  updatedAt?: string;
}

export interface ContactSettings {
  headquarters: string;
  address: string;
  phonePrimary: string;
  phoneSecondary?: string;
  emailPrimary: string;
  emailSecondary?: string;
  workingHours: string;
  mapEmbedUrl: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  copyrightText?: string;
  siteTitle?: string;
  metaDescription?: string;
  updatedAt?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  plotArea?: number;
  estimatedBudget?: string;
  budget?: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed';
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'editor';
}


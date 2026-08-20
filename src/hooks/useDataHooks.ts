import { useState, useEffect } from 'react';
import {
  HomepageContent,
  Founder,
  AboutPageContent,
  Service,
  Package,
  Project,
  EstimatorConfig,
  Testimonial,
  GalleryImage,
  ContactSettings,
  Inquiry,
  ServiceLocation,
} from '../types';
import { getHomepageContent, updateHomepageContent, subscribeToHomepageContent } from '../services/homepageService';
import { getFounderData, updateFounderData, subscribeToFounderData } from '../services/founderService';
import { getAboutPageContent, updateAboutPageContent, subscribeToAboutPageContent } from '../services/aboutService';
import { getServices, saveService, deleteService, subscribeToServices } from '../services/serviceService';
import { getPackages, savePackage, deletePackage, subscribeToPackages } from '../services/packageService';
import { getProjects, saveProject, deleteProject, subscribeToProjects } from '../services/projectService';
import { getEstimatorConfig, updateEstimatorConfig, subscribeToEstimatorConfig } from '../services/estimatorService';
import { getTestimonials, saveTestimonial, deleteTestimonial, subscribeToTestimonials } from '../services/testimonialService';
import { getGalleryImages, saveGalleryImage, deleteGalleryImage, subscribeToGalleryImages } from '../services/galleryService';
import { getContactSettings, updateContactSettings, subscribeToContactSettings } from '../services/contactService';
import { getInquiries, submitInquiry, updateInquiryStatus, deleteInquiry, subscribeToInquiries } from '../services/inquiryService';
import { getLocations, saveLocation, deleteLocation, subscribeToLocations, INITIAL_LOCATIONS_DATA } from '../services/locationService';
import {
  INITIAL_HOMEPAGE_DATA,
  INITIAL_FOUNDER_DATA,
  INITIAL_SERVICES_DATA,
  INITIAL_PACKAGES_DATA,
  INITIAL_PROJECTS_DATA,
  INITIAL_TESTIMONIALS_DATA,
  INITIAL_GALLERY_DATA,
  INITIAL_CONTACT_DATA,
  INITIAL_INQUIRIES_DATA,
} from '../data/mockData';
import { INITIAL_ABOUT_DATA } from '../firebase/seed';
import { DEFAULT_ESTIMATOR_CONFIG } from '../utils/estimatorCalculator';

export const useHomepage = () => {
  const [data, setData] = useState<HomepageContent>(INITIAL_HOMEPAGE_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomepageContent().then((res) => {
      setData(res);
      setLoading(false);
    });
    const sub = subscribeToHomepageContent((res) => {
      setData(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const update = async (updated: HomepageContent) => {
    const res = await updateHomepageContent(updated);
    setData(res);
    return res;
  };

  return { data, loading, update };
};

export const useFounder = () => {
  const [data, setData] = useState<Founder>(INITIAL_FOUNDER_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFounderData().then((res) => {
      setData(res);
      setLoading(false);
    });
    const sub = subscribeToFounderData((res) => {
      setData(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const update = async (updated: Founder) => {
    const res = await updateFounderData(updated);
    setData(res);
    return res;
  };

  return { founder: data, data, loading, update };
};

export const useAbout = () => {
  const [data, setData] = useState<AboutPageContent>(INITIAL_ABOUT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutPageContent().then((res) => {
      setData(res);
      setLoading(false);
    });
    const sub = subscribeToAboutPageContent((res) => {
      setData(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const update = async (updated: AboutPageContent) => {
    const res = await updateAboutPageContent(updated);
    setData(res);
    return res;
  };

  return { data, loading, update };
};

export const useServices = () => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then((res) => {
      setServices(res);
      setLoading(false);
    });
    const sub = subscribeToServices((res) => {
      setServices(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const save = async (item: Service) => {
    return await saveService(item);
  };

  const remove = async (id: string) => {
    return await deleteService(id);
  };

  return { services, loading, save, remove };
};

export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPackages().then((res) => {
      setPackages(res);
      setLoading(false);
    });
    const sub = subscribeToPackages((res) => {
      setPackages(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const save = async (item: Package) => {
    return await savePackage(item);
  };

  const remove = async (id: string) => {
    return await deletePackage(id);
  };

  return { packages, loading, save, remove };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(
    INITIAL_PROJECTS_DATA.map((p) => ({
      ...p,
      slug: p.slug || p.id,
      year: p.year || p.completionYear,
      duration: p.duration || '12 Months',
    }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((res) => {
      setProjects(res);
      setLoading(false);
    });
    const sub = subscribeToProjects((res) => {
      setProjects(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const save = async (item: Project) => {
    return await saveProject(item);
  };

  const remove = async (id: string) => {
    return await deleteProject(id);
  };

  return { projects, loading, save, remove };
};

export const useEstimator = () => {
  const [config, setConfig] = useState<EstimatorConfig>(DEFAULT_ESTIMATOR_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEstimatorConfig().then((res) => {
      setConfig(res);
      setLoading(false);
    });
    const sub = subscribeToEstimatorConfig((res) => {
      setConfig(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const update = async (updated: EstimatorConfig) => {
    const res = await updateEstimatorConfig(updated);
    setConfig(res);
    return res;
  };

  return { config, loading, update };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials().then((res) => {
      setTestimonials(res);
      setLoading(false);
    });
    const sub = subscribeToTestimonials((res) => {
      setTestimonials(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const save = async (item: Testimonial) => {
    return await saveTestimonial(item);
  };

  const remove = async (id: string) => {
    return await deleteTestimonial(id);
  };

  return { testimonials, loading, save, remove };
};

export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>(INITIAL_GALLERY_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleryImages().then((res) => {
      setImages(res);
      setLoading(false);
    });
    const sub = subscribeToGalleryImages((res) => {
      setImages(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const save = async (item: GalleryImage) => {
    return await saveGalleryImage(item);
  };

  const remove = async (id: string) => {
    return await deleteGalleryImage(id);
  };

  return { images, loading, save, remove };
};

export const useContactSettings = () => {
  const [contact, setContact] = useState<ContactSettings>(INITIAL_CONTACT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactSettings().then((res) => {
      setContact(res);
      setLoading(false);
    });
    const sub = subscribeToContactSettings((res) => {
      setContact(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const update = async (updated: ContactSettings) => {
    const res = await updateContactSettings(updated);
    setContact(res);
    return res;
  };

  return { contact, loading, update };
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Inquiry[]>(INITIAL_INQUIRIES_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInquiries().then((res) => {
      setLeads(res);
      setLoading(false);
    });
    const sub = subscribeToInquiries((res) => {
      setLeads(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const submitNewLead = async (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
    return await submitInquiry(inquiry);
  };

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    return await updateInquiryStatus(id, status);
  };

  const remove = async (id: string) => {
    return await deleteInquiry(id);
  };

  return { leads, loading, submitNewLead, updateStatus, remove };
};

export const useAboutPageContent = () => {
  const [about, setAbout] = useState<AboutPageContent>(INITIAL_ABOUT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutPageContent().then((res) => {
      if (res) setAbout(res);
      setLoading(false);
    });
    const sub = subscribeToAboutPageContent((res) => {
      if (res) setAbout(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const update = async (updated: AboutPageContent) => {
    const res = await updateAboutPageContent(updated);
    setAbout(res);
    return res;
  };

  return { about, loading, update };
};

export const useLocations = () => {
  const [locations, setLocations] = useState<ServiceLocation[]>(INITIAL_LOCATIONS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocations().then((res) => {
      if (res && res.length > 0) setLocations(res);
      setLoading(false);
    });
    const sub = subscribeToLocations((res) => {
      if (res && res.length > 0) setLocations(res);
      setLoading(false);
    });
    return () => sub();
  }, []);

  const save = async (item: ServiceLocation) => {
    return await saveLocation(item);
  };

  const remove = async (id: string) => {
    return await deleteLocation(id);
  };

  return { locations, loading, save, remove };
};

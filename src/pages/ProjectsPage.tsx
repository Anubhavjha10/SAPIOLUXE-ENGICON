import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ProjectCard } from '../components/ProjectCard';
import { GalleryGrid } from '../components/GalleryGrid';
import { Modal } from '../components/Modal';
import { CTASection } from '../components/CTASection';
import { getProjects } from '../services/projectService';
import { getGalleryImages } from '../services/galleryService';
import { Project, GalleryImage } from '../types';
import { MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { onOpenConsultation } = useOutletContext<{ onOpenConsultation: () => void }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects().then(setProjects);
    getGalleryImages().then(setGalleryImages);
  }, []);

  const categories = ['All', 'Residential', 'Commercial', 'Interior', 'Civil'];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full py-12">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <div className="border-b technical-line pb-6">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Architectural Precision in Odisha & West Bengal
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary font-bold mb-4">
            Completed Project Portfolio
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Explore our delivered luxury villas, corporate towers, and turnkey interior milestones across Odisha & West Bengal.
          </p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 font-label-caps text-xs transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary font-bold shadow-md'
                  : 'bg-surface-container text-secondary hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </section>

      {/* Site Gallery Grid Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        <div className="mb-8 border-b technical-line pb-4">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-2 block">
            Visual Inspection
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
            Site Action & Architectural Gallery
          </h2>
        </div>
        <GalleryGrid images={galleryImages} />
      </section>

      {/* Detailed Project Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="aspect-[16/9] w-full bg-surface-variant overflow-hidden ghost-border">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs font-mono-technical text-secondary bg-surface-container p-4 border border-outline-variant/30">
              <span className="flex items-center gap-1 font-bold text-primary">
                <MapPin className="w-4 h-4 text-tertiary-fixed-dim" /> {selectedProject.location}
              </span>
              <span>Built-up Area: {selectedProject.areaSqFt.toLocaleString()} sq.ft</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-tertiary-fixed-dim" /> Handover {selectedProject.completionYear}
              </span>
            </div>

            <div>
              <h4 className="font-headline-md text-base font-bold text-primary mb-2">Project Overview</h4>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {selectedProject.highlights && (
              <div>
                <h4 className="font-headline-md text-base font-bold text-primary mb-3">Key Highlights</h4>
                <ul className="space-y-2">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-body-md text-on-surface">
                      <CheckCircle2 className="w-4 h-4 text-tertiary-fixed-dim shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedProject(null);
                onOpenConsultation();
              }}
              className="w-full bg-primary text-on-primary py-4 px-6 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-all text-center font-bold"
            >
              Request Similar Project Consultation
            </button>
          </div>
        </Modal>
      )}

      <CTASection onOpenConsultation={onOpenConsultation} />
    </div>
  );
};

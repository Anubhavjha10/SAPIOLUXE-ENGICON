import React from 'react';
import { MapPin, Calendar, Maximize2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelectProject?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  return (
    <div
      onClick={() => onSelectProject && onSelectProject(project)}
      className="group cursor-pointer bg-surface border border-outline-variant/30 hover:border-tertiary-fixed-dim transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div className="relative aspect-[4/3] bg-surface-variant overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />

        <div className="absolute top-3 left-3 bg-primary text-on-primary px-3 py-1 text-[10px] font-label-caps tracking-widest uppercase">
          {project.category}
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/80 text-white p-2">
          <Maximize2 className="w-4 h-4" />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs text-white/90 font-mono-technical bg-primary/70 backdrop-blur-md px-3 py-1.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-tertiary-fixed-dim" />
            {project.location}
          </span>
          <span>{project.areaSqFt.toLocaleString()} sq.ft</span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-headline-md text-[20px] font-bold text-primary mb-1 group-hover:text-tertiary-fixed-dim transition-colors">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className="font-body-md text-xs text-secondary mb-3">{project.subtitle}</p>
          )}

          <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 mb-4">
            {project.description}
          </p>
        </div>

        <div className="pt-4 border-t technical-line flex justify-between items-center text-xs font-mono-technical text-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Handover {project.completionYear}
          </span>
          <span className="text-tertiary-fixed-dim font-bold uppercase tracking-wider">
            View Case Study →
          </span>
        </div>
      </div>
    </div>
  );
};

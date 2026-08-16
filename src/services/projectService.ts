import { Project } from '../types';
import { INITIAL_PROJECTS_DATA } from '../data/mockData';
import { getCollectionData, saveDocumentData, deleteDocumentData, subscribeToCollection } from '../firebase/firestore';

const COLLECTION = 'projects';

let cachedProjects: Project[] = INITIAL_PROJECTS_DATA.map((p) => ({
  ...p,
  slug: p.slug || p.id,
  year: p.year || p.completionYear,
  duration: p.duration || '12 Months',
}));

export const getProjects = async (): Promise<Project[]> => {
  try {
    const firestoreData = await getCollectionData<Project>(COLLECTION);
    if (firestoreData && firestoreData.length > 0) {
      cachedProjects = firestoreData.map((p) => ({
        ...p,
        slug: p.slug || p.id,
        year: p.year || p.completionYear,
        duration: p.duration || '12 Months',
      }));
      return cachedProjects;
    }
  } catch (err) {
    console.warn('Using local projects data cache', err);
  }
  return cachedProjects;
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug || p.id === slug) || null;
};

export const saveProject = async (project: Project): Promise<Project> => {
  const projToSave = {
    ...project,
    id: project.id || `project_${Date.now()}`,
    slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const idx = cachedProjects.findIndex((p) => p.id === projToSave.id);
  if (idx >= 0) {
    cachedProjects[idx] = projToSave;
  } else {
    cachedProjects.unshift(projToSave);
  }

  try {
    await saveDocumentData(COLLECTION, projToSave.id, projToSave);
  } catch (err) {
    console.warn('Firestore save project failed', err);
  }
  return projToSave;
};

export const deleteProject = async (id: string): Promise<void> => {
  cachedProjects = cachedProjects.filter((p) => p.id !== id);
  try {
    await deleteDocumentData(COLLECTION, id);
  } catch (err) {
    console.warn('Firestore delete project failed', err);
  }
};

export const subscribeToProjects = (callback: (data: Project[]) => void) => {
  return subscribeToCollection<Project>(COLLECTION, (data) => {
    if (data && data.length > 0) {
      cachedProjects = data.map((p) => ({
        ...p,
        slug: p.slug || p.id,
        year: p.year || p.completionYear,
        duration: p.duration || '12 Months',
      }));
      callback(cachedProjects);
    } else {
      callback(cachedProjects);
    }
  });
};


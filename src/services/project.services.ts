
import { Project } from "@/types/types";

export class ProjectService {
  private useApi: boolean;
  private endpoint: string;
  private readonly STORAGE_KEY = 'projects_data';

  constructor(useApi = false, endpoint = "/data/projects.json") {
    this.useApi = useApi;
    this.endpoint = endpoint;
    
    // Initialiser le localStorage seulement côté client
    if (typeof window !== 'undefined') {
      this.initLocalStorage();
    }
  }

  private async initLocalStorage() {
    // Vérifier si nous sommes dans un navigateur et si les données existent déjà
    if (typeof window !== 'undefined' && !localStorage.getItem(this.STORAGE_KEY)) {
      try {
        // Charger les données initiales depuis le fichier JSON
        const response = await fetch(this.endpoint);
        if (!response.ok) throw new Error("Erreur réseau");
        const initialData: Project[] = await response.json();
        
        // Stocker dans localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
      } catch (error) {
        console.error("Erreur lors de l'initialisation des données :", error);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
      }
    }
  }

  async fetchAll(): Promise<Project[]> {
    try {
      // Si nous sommes côté serveur, retourner un tableau vide
      if (typeof window === 'undefined') {
        return [];
      }
      
      // Récupérer les données depuis localStorage
      const projectsJSON = localStorage.getItem(this.STORAGE_KEY);
      if (!projectsJSON) {
        await this.initLocalStorage();
        return this.fetchAll();
      }
      
      return JSON.parse(projectsJSON);
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
      return [];
    }
  }

  async fetchById(id: string): Promise<Project | undefined> {
    const projects = await this.fetchAll();
    return projects.find(p => p.id === id);
  }

  async fetchByTitle(title: string): Promise<Project | undefined> {
    const projects = await this.fetchAll();
    return projects.find(p => p.title === title);
  }

  // Méthode pour créer un projet
  async create(project: Project): Promise<Project> {
    try {
      // Vérifier si nous sommes côté serveur
      if (typeof window === 'undefined') {
        throw new Error("Cette opération ne peut être effectuée que côté client");
      }
      
      const projects = await this.fetchAll();
      
      // Vérifier si l'ID existe déjà
      if (projects.some(p => p.id === project.id)) {
        throw new Error(`Un projet avec l'ID ${project.id} existe déjà`);
      }
      
      // Ajouter le projet
      projects.push(project);
      
      // Sauvegarder dans localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
      
      return project;
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
      throw error;
    }
  }

  // Méthode pour supprimer un projet
  async deleteProject(id: string): Promise<boolean> {
    try {
      // Vérifier si nous sommes côté serveur
      if (typeof window === 'undefined') {
        throw new Error("Cette opération ne peut être effectuée que côté client");
      }
      
      const projects = await this.fetchAll();
      
      const initialLength = projects.length;
      const updatedProjects = projects.filter(project => project.id !== id);
      
      if (updatedProjects.length === initialLength) {
        return false; // Aucun projet n'a été supprimé
      }
      
      // Sauvegarder la liste mise à jour
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProjects));
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du projet ${id}:`, error);
      throw error;
    }
  }

  // Méthode pour mettre à jour un projet
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      // Vérifier si nous sommes côté serveur
      if (typeof window === 'undefined') {
        throw new Error("Cette opération ne peut être effectuée que côté client");
      }
      
      const projects = await this.fetchAll();
      const projectIndex = projects.findIndex(p => p.id === id);
      
      if (projectIndex === -1) {
        return null; // Projet non trouvé
      }
      
      // Mettre à jour le projet
      const updatedProject = {
        ...projects[projectIndex],
        ...updates
      };
      
      projects[projectIndex] = updatedProject;
      
      // Sauvegarder dans localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
      
      return updatedProject;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du projet ${id}:`, error);
      throw error;
    }
  }
}
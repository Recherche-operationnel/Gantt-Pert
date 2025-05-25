import { api_url } from "./constant";
import { Project } from "@/types/types";
import axios from "axios";

export class ProjectService {
  private useApi: boolean;
  private endpoint: string;
  private readonly STORAGE_KEY = 'projects_data';

  constructor(useApi = true, endpoint = `${api_url}/projects`) {
    this.useApi = useApi;
    this.endpoint = endpoint;
    
  }

 

  async fetchAll() {
    try {
          const response = await axios.get(this.endpoint);
          // if (!response) throw new Error("Erreur réseau");
    
          return response.data;
        } catch (error) {
          console.error("Erreur lors du chargement des projets :", error);
          return [];
        }
  }


  async fetchById(id: string): Promise<Project | undefined> {
    try{
       const response = await axios.get(`${this.endpoint}/${id}`);
    if (!response) throw new Error("Erreur réseau");
    
    return response.data;
    }catch (error) {
        console.error(`Erreur lors du chargement du projet ${id} :`, error);
        throw error ;
    }
  }

  async fetchByTitle(title: string): Promise<Project | undefined> {
    const projects = await this.fetchAll();
    return projects.find((p: { title: string; }) => p.title === title);
  }

  // Méthode pour créer un projet
  async create(project: Project) {
      
    try {
          const response = await axios.post(this.endpoint,{"title":project.title});
          if (!response) throw new Error("Erreur réseau");
    
          return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
      throw error;
    }
  }

  // Méthode pour supprimer un projet
  async deleteProject(id: number): Promise<boolean> {
    try {
        const response = await axios.delete(`${this.endpoint}/${id}`);
        if (!response) throw new Error("Erreur réseau");
        
        return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du projet ${id}:`, error);
      throw error;
    }
  }

  // Méthode pour mettre à jour un projet
  async updateProject(id: number, updates: Partial<Project>): Promise<Project | null> {
    try {
      // Vérifier si nous sommes côté serveur
      if (typeof window === 'undefined') {
        throw new Error("Cette opération ne peut être effectuée que côté client");
      }
      
      const projects = await this.fetchAll();
      const projectIndex = projects.findIndex((p: { id: number; }) => p.id === id);
      
      if (projectIndex === -1) {
        return null; // Projet non trouvé
      }
      
      // Mettre à jour le projet
      const updatedProject = {
        ...projects[projectIndex],
        ...updates
      };
      
      projects[projectIndex] = updatedProject;
     
    const response = await axios.put(`${this.endpoint}/${id}`,{"title":updatedProject.title});
    if (!response) throw new Error("Erreur réseau");
    
    return response.data;
      
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du projet ${id}:`, error);
      throw error;
    }
  }
}
// src/services/project.services.ts
import { Project } from "@/types/types";

export class ProjectService {
  private useApi: boolean;
  private endpoint: string;

  constructor(useApi = false, endpoint = "/data/projects.json") {
    this.useApi = useApi;
    this.endpoint = endpoint;
  }

  async fetchAll(): Promise<Project[]> {
    try {
      const response = await fetch(this.endpoint);
      if (!response.ok) throw new Error("Erreur réseau");

      const data: Project[] = await response.json();
      return data;
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
}

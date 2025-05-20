// src/services/project.services.ts
import { Activity } from "@/types/types";

export class ActivityService {
  private useApi: boolean;
  private endpoint: string;

  constructor(useApi = false, endpoint = "/data/activities.json") {
    this.useApi = useApi;
    this.endpoint = endpoint;
  }

  async fetchAll(): Promise<Activity[]> {
    try {
      const response = await fetch(this.endpoint);
      if (!response.ok) throw new Error("Erreur réseau");

      const data: Activity[] = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
      return [];
    }
  }

  async fetchById(id: string): Promise<Activity | undefined> {
    const projects = await this.fetchAll();
    return projects.find(p => p.id === id);
  }

  async fetchByTitle(title: string): Promise<Activity | undefined> {
    const projects = await this.fetchAll();
    return projects.find(p => p.title === title);
  }
}

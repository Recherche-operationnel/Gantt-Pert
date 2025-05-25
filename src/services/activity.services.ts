import axios from "axios";
import { Activity } from "@/types/types";
import { api_url } from "./constant";

export class ActivityService {
  private useApi: boolean;
  private endpoint: string;

  constructor(useApi = false, endpoint = `${api_url}/activities`){
    this.useApi = useApi;
    this.endpoint = endpoint;
  }

  async fetchAll(){
    try {
      
        const response = await axios.get(this.endpoint);
          // if (!response) throw new Error("Erreur réseau");
    
        return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des activites :", error);
      return [];
    }
  }

  async fetchById(id: number) {
    const projects = await this.fetchAll();
    const activity = projects.find((p: { id: number; }) => p.id === id)
    const conformActivity = {
      id: activity?.id,
      title: activity?.title,
      duration: activity?.duration,
      dependencies: activity?.dependency_ids,
    }
    return conformActivity;
  }


  async fetchByProjectId(projectId:number){
    try {
        const response = await axios.get(`${this.endpoint}?project_id=${projectId}`);
        if (!response) throw new Error("Erreur réseau");
        const listeIds = response.data.map( (activity: { id: any; })  => activity.id);

        return listeIds;
    } catch (error) {
      console.error("Erreur lors du chargement des activités du projet :", error);
      return [];
    }
  }

  async create(activity: Activity, projectId: number) {
      
    try {
          const response = await axios.post(this.endpoint,{"title":activity.title, "duration": activity.duration, "project_id":projectId, "dependency_ids": activity.dependencies});
          if (!response) throw new Error("Erreur réseau");
    
          return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'activité :", error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
        const response = await axios.delete(`${this.endpoint}/${id}`);
        if (!response) throw new Error("Erreur réseau");
        
        return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'activité ${id}:`, error);
      throw error;
    }
  }
}

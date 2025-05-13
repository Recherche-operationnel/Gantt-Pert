'use client';
import GanttDiagram from "@/components/gantt";
import PertDiagram from "@/components/pertDiagram";
import Standard from "@/components/standard";
import { useEffect, useState } from "react";
import { Project} from "@/types/types";
import { ProjectService } from "@/services/project.services";
import Link from "next/link";

const projectService = new ProjectService();

const ProjectViews = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('standard');
   
  useEffect(() => {
    const loadProject = async () => {
      const data = await projectService.fetchById("P3");
      console.log("Project data:", data);
      setProject(data || null);
    };
    loadProject();
  }, []);

  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div >
      
      <button className="text-blue-600 hover:text-blue-800 mr-4 mt-4 pl-8 pt-8">
        <Link href="/projects">
            ← Retour
        </Link>
        </button>
     
     <div className="flex-1 p-8 bg-background">
        <h1 className="text-3xl font-bold mb-4">{project?.title || 'Titre du Projet'}</h1>
        
        <div className="relative">

          <div className="flex space-x-8 border-b border-gray-200 pb-1">
            {['standard', 'gantt', 'pert'].map((tab) => {
              const label = tab === 'standard' ? 'Standard' 
                          : tab === 'gantt' ? 'Diagramme de Gantt' 
                          : 'Diagramme de PERT';
              
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`relative px-1 py-2 text-lg font-medium ${
                    activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 transition-all duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {activeTab === 'standard' && <Standard />}
        {activeTab === 'gantt' && <GanttDiagram />}
        {activeTab === 'pert' && <PertDiagram />}
      </div>
    </div>
  );
}

export default ProjectViews;
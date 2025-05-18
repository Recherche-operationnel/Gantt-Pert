import { ActivityService } from "@/services/activity.services";
import { ProjectService } from "@/services/project.services";
import { Activity, Project } from "@/types/types";
import { useEffect, useState } from "react";

const projectService = new ProjectService();
const activityService = new ActivityService();

const Pert = () => {
    const [project, setProject] = useState<Project | null>(null);
    const [projectActivities, setProjectActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const loadProjectActivities = async () => {
          const project = await projectService.fetchById("P3");
          const activitiesIds = project?.activities||[];
          console.log("Identifiant des activités du projet P3:", activitiesIds);
          setProject(project || null);
          if(activitiesIds){
            let activities = [];
             for (const id of activitiesIds) {
               const data = await activityService.fetchById(id);
               activities.push(data);
             }
             setProjectActivities(activities.filter((a): a is Activity => a !== undefined))
          }
         
        };
        loadProjectActivities();
  
      }, []);

       const getTaskTitle = (id: Activity['id']) => {
      const task = projectActivities.find(t => t.id === id);
      return task ? task.title : "";
    };
  
      const tasksWithDates = calculateStartEnd(projectActivities);
      const maxDuration = tasksWithDates.length > 0 ? Math.max(...tasksWithDates.map(t => t.end)) : 0;
    const pertData = calculateCriticalPath(projectActivities);

  return (
    <div className="flex flex-col gap-4">
      La vue du diagram de PERT

      <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Diagramme PERT</h2>
            <p className="mb-2">Chemin critique: {pertData.criticalPath.map(id => getTaskTitle(id)).join(" → ")}</p>
            <div className="overflow-x-auto">
              <svg width={Math.max(800, maxDuration * 120)} height={pertData.allTasks.length * 80 + 40} className="border border-gray-200">
                {/* Nœuds PERT */}
                {pertData.allTasks.map((task, index) => {
                  const x = task.ES * 120 + 80;
                  const y = index * 80 + 60;
                  const isCritical = pertData.criticalPath.includes(task.id);
                  
                  return (
                    <g key={task.id}>
                      {/* Rectangle du nœud */}
                      <rect 
                        x={x} 
                        y={y - 30} 
                        width="160" 
                        height="60" 
                        rx="4" 
                        stroke={isCritical ? "#ef4444" : "#3b82f6"} 
                        strokeWidth="2" 
                        fill="white"
                      />
                      
                      {/* Titre de la tâche */}
                      <text x={x + 80} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="500">
                        {task.title}
                      </text>
                      
                      {/* Ligne séparatrice */}
                      <line x1={x} y1={y} x2={x + 160} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                      
                      {/* Informations de temps */}
                      <text x={x + 40} y={y + 20} textAnchor="middle" fontSize="10">
                        {task.ES} - {task.EF}
                      </text>
                      <text x={x + 120} y={y + 20} textAnchor="middle" fontSize="10">
                        {task.LS} - {task.LF}
                      </text>
                      
                      {/* Flèches pour les dépendances */}
                      {task.dependencies.map(depId => {
                        const depTask = pertData.allTasks.find(t => t.id === depId);
                        if (!depTask) return null;
                        
                        const depIndex = pertData.allTasks.findIndex(t => t.id === depId);
                        const startX = depTask.ES * 120 + 240; // Fin du nœud précédent
                        const startY = depIndex * 80 + 60;
                        const endX = x;
                        const endY = y;
                        
                        const isCriticalPath = pertData.criticalPath.includes(depId) && 
                                              pertData.criticalPath.includes(task.id) &&
                                              pertData.criticalPath.indexOf(task.id) === pertData.criticalPath.indexOf(depId) + 1;
                        
                        // Dessiner une ligne avec une flèche à la fin
                        const arrowPath = `M${startX},${startY} L${endX},${endY}`;
                        
                        return (
                          <g key={`${task.id}-${depId}`}>
                            <path 
                              d={arrowPath} 
                              stroke={isCriticalPath ? "#ef4444" : "#3b82f6"} 
                              strokeWidth={isCriticalPath ? "2" : "1"} 
                              fill="none" 
                              markerEnd="url(#arrowhead)" 
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
                
                {/* Définition des marqueurs de flèche */}
                <defs>
                  <marker 
                    id="arrowhead" 
                    markerWidth="10" 
                    markerHeight="7" 
                    refX="10" 
                    refY="3.5" 
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                  </marker>
                </defs>
              </svg>
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                <span>Chemin critique</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span>Autres tâches</span>
              </div>
            </div>
          </div>
        
      
    </div>
  );
}
export default Pert;

const calculateStartEnd = (tasks: Activity[] |null) => {
    let result = [];
    // let startDates = {};
    const startDates: Record<string, number> = {};
    
    // Fonction pour calculer la date de début d'une tâche
    const calculateStart = (taskId: Activity['id']) => {
      if (startDates[taskId] !== undefined) return startDates[taskId];
      
      const task = tasks?.find(t => t.id === taskId);
      if (!task) return 0;
      
      if (task.dependencies.length === 0) {
        startDates[taskId] = 0;
        return 0;
      }
      
      let maxEnd = 0;
      for (const depId of task.dependencies) {
        const depStart = calculateStart(depId);
        const dep = tasks?.find(t => t.id === depId);
        const depEnd = depStart + (dep?.duration||0);
        maxEnd = Math.max(maxEnd, depEnd);
      }
      
      startDates[taskId] = maxEnd;
      return maxEnd;
    };
    
    if(tasks){
      for (const task of tasks) {
        const start = calculateStart(task.id);
        const end = start + task.duration;
        result.push({ ...task, start, end });
      }
    }
    
    return result;
  };

   // Calcul du chemin critique pour PERT
  const calculateCriticalPath = (tasks: Activity[]) => {
    const tasksWithDates = calculateStartEnd(tasks);
    const projectEnd = Math.max(...tasksWithDates.map(t => t.end));
    
    // Calculer le ES (Early Start), EF (Early Finish), LS (Late Start), LF (Late Finish)
    let extendedTasks = tasksWithDates.map(task => {
      return {
        ...task,
        ES: task.start,
        EF: task.start + task.duration,
        LS: 0, // à calculer
        LF: 0, // à calculer
        slack: 0 // à calculer
      };
    });
    
    // Calcul des LS et LF (en partant de la fin)
    for (let i = extendedTasks.length - 1; i >= 0; i--) {
      const task = extendedTasks[i];
      
      if (task.EF === projectEnd) {
        // Tâches finales
        task.LF = projectEnd;
        task.LS = task.LF - task.duration;
      } else {
        // Trouver toutes les tâches qui dépendent de cette tâche
        const successors = extendedTasks.filter(t => 
          t.dependencies.includes(task.id)
        );
        
        if (successors.length > 0) {
          // Le LF est le minimum des LS des successeurs
          task.LF = Math.min(...successors.map(s => s.LS));
          task.LS = task.LF - task.duration;
        } else {
          // Tâches sans successeurs mais pas à la fin du projet
          task.LF = projectEnd;
          task.LS = task.LF - task.duration;
        }
      }
      
      task.slack = task.LS - task.ES;
    }
    
    // Les tâches du chemin critique ont un slack de 0
    const criticalPath = extendedTasks.filter(t => t.slack === 0);
    
    return {
      allTasks: extendedTasks,
      criticalPath: criticalPath.map(t => t.id)
    };
  };
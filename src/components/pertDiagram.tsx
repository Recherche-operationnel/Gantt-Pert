import { ActivityService } from "@/services/activity.services";
import { ProjectService } from "@/services/project.services";
import { Activity, Project } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const projectService = new ProjectService();
const activityService = new ActivityService();

const PertDiagram = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [projectActivities, setProjectActivities] = useState<Activity[]>([]);
  
  const searchParams = useSearchParams();
  console.log("params",searchParams);
  const projectId = searchParams.get('id') || "P3";

      useEffect(() => {
          const loadProjectActivities = async () => {
            const project = await projectService.fetchById(projectId);
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
          if (id === "start") return "Start";
          const task = projectActivities.find(t => t.id === id);
          return task ? task.title : "";
        };
      const pertData = calculateCriticalPath(projectActivities);
    const maxDuration =  Math.max(...pertData.allTasks.map(t => t.EF)) ;
      const taskLevels = getTaskLevels(projectActivities);

      const taskIds = pertData.allTasks.map((t) => t.id);

    const hasSuccessor = new Set<string>();
    pertData.allTasks.forEach((task) => {
      task.dependencies.forEach((dep) => hasSuccessor.add(dep));
    });

    const terminalTasks = taskIds.filter((id) => !hasSuccessor.has(id));
    const finalTask = {
      id: "FIN",
      title: "FIN",
      duration: 0,
      ES: maxDuration,
      EF: maxDuration,
      LS:maxDuration,
      LF: maxDuration,
      dependencies: terminalTasks,
    };

    const tasksWithFinal = [...pertData.allTasks, finalTask];
    const maxLevel = Math.max(...Object.values(taskLevels));
    taskLevels["FIN"] = maxLevel + 1;



    
  return (
    <div className="flex flex-col gap-4">
      La vue du diagram de PERT
        <h2 className="text-xl font-semibold mb-4">Diagramme PERT</h2>
        <p className="mb-2">Chemin critique: {pertData.criticalPath.map(id => getTaskTitle(id)).join(" → ")}</p>
        <div className="w-full min-h-[600px] overflow-auto p-4 bg-white border border-gray-300 shadow">
          <svg
            width={Math.max(800, maxDuration * 120)}
            height={pertData.allTasks.length * 120 + 100} 
          >
                {tasksWithFinal.map((task, index) => {
                  const level = taskLevels[task.id] || 0;
                  const x = level * 180 + 110;
                  const y = index * 120 + 60;
                  const isCritical = pertData.criticalPath.includes(task.id);
                  
                  return (
                    <g key={task.id}>
                      <g key={`node-${task.id}`} transform={`translate(${x}, ${y})`}>
                        
                        {/* Cercle du nœud */}
                        <circle
                          r="30"
                          fill="white"
                          stroke="black"
                          strokeWidth="1"
                        />
                        
                        {/* Ligne horizontale de séparation */}
                        <line
                          x1="-30"
                          y1="0"
                          x2="30"
                          y2="0"
                          stroke="black"
                          strokeWidth="1"
                        />
                        
                        {/* Date au plus tôt */}
                        <text
                          x="-10"
                          y="-8"
                          textAnchor="middle"
                          fontSize="12px"
                        >
                          {task.EF}
                        </text>
                        
                        {/* Date au plus tard */}
                        <text
                          x="10"
                          y="-8"
                          textAnchor="middle"
                          fontSize="12px"
                        >
                          {task.LF}
                        </text>
                        
                        {/* Numéro du sommet */}
                        <text
                          y="13"
                          textAnchor="middle"
                          fontSize="12px"
                        >
                          {index}
                        </text>
                      </g>
                              
                      {/* Flèches pour les dépendances */}
                      {task.dependencies.map(depId => {
                        const depTask = pertData.allTasks.find(t => t.id === depId);
                        if (!depTask) return null;
                        
                        const isWaitingEdge = task.ES > depTask.EF || task.id === "FIN";

                        const depIndex = pertData.allTasks.findIndex(t => t.id === depId);
                        const depLevel = taskLevels[depId] || 0;
                        const startX = depLevel * 180 + 140;
                        const startY = depIndex * 120 + 60;
                        const endX = x - 30;
                        const endY = y;

                        
                        const isCriticalPath = pertData.criticalPath.includes(depId) && 
                                              pertData.criticalPath.includes(task.id) &&
                                              pertData.criticalPath.indexOf(task.id) === pertData.criticalPath.indexOf(depId) + 1;
                        
                        // Dessiner une ligne avec une flèche à la fin
                        const arrowPath = `M${startX},${startY} L${endX},${endY}`;
                        
                        const labelPos = getLabelPosition(startX, startY, endX, endY, isWaitingEdge);
                        return (
                          <g key={`${task.id}-${depId}`}>
                            <path 
                              d={arrowPath} 
                              stroke={isCriticalPath ? "#ef4444": isWaitingEdge? "#6b7280" : "#3b82f6"} 
                              strokeWidth={isCriticalPath ? "2" : "1"} 
                              strokeDasharray={isWaitingEdge ? "5,5" : "0"}
                              fill="none" 
                              markerEnd="url(#arrowhead)" 
                            />
                            <text
                              x={labelPos.x}
                              y={labelPos.y}
                              textAnchor="middle"
                              fill={isWaitingEdge ? "#6b7280" : isCritical ? "red" : "black"}
                              fontSize="12px"
                            >
                              {isWaitingEdge ? "X(0)" : `${task.title}(${task.duration})`}
                            </text>
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
  );
}
export default PertDiagram;


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
    
    // 1. Ajouter un nœud de départ pour les tâches sans dépendances
  const startNode: Activity = {
    id: "start",
    title: "Start",
    duration: 0,
    dependencies: []
  };

const taskIds = tasks.map(t => t.id);

const tasksWithStart = [startNode, ...tasks.map(t => {
  const hasNoDependencies = t.dependencies.length === 0;
  const hasInvalidDependencies = t.dependencies.every(dep => !taskIds.includes(dep));

  if (hasNoDependencies || hasInvalidDependencies) {
    return {
      ...t,
      dependencies: ["start"]
    };
  }

  return t;
})];


    
    const tasksWithDates = calculateStartEnd(tasksWithStart);
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
    console.log(extendedTasks);
    
    return {
      allTasks: extendedTasks,
      criticalPath: criticalPath.map(t => t.id)
    };
  };


  const getTaskLevels = (tasks: Activity[]) => {
  const levels: Record<string, number> = {};
  const visited = new Set<string>();

  const visit = (taskId: string, currentLevel: number) => {
    if (levels[taskId] !== undefined) {
      levels[taskId] = Math.max(levels[taskId], currentLevel);
    } else {
      levels[taskId] = currentLevel;
    }

    visited.add(taskId);

    const successors = tasks.filter(t => t.dependencies.includes(taskId));
    for (const succ of successors) {
      if (!visited.has(succ.id)) {
        visit(succ.id, currentLevel + 1);
      }
    }
  };

  // Commencer par les tâches sans dépendances
  
  const taskIds = tasks.map(t => t.id);
  tasks
    .filter(t => (t.dependencies.length === 0 || t.dependencies.every(dep => !taskIds.includes(dep))))
    .forEach(t => visit(t.id, 1));

  return levels;
};

  // Fonction pour calculer la position de l'étiquette d'un arc
  const getLabelPosition = (x: number, y: number, endx: number, endY: number, isDashed: boolean) => {
    
    if (isDashed) {
      // Position pour l'arc X
      return {
        x: (x + endx) / 2,
        y: (y + endY) / 2 - 20
      };
    } else {
      // Position pour les autres arcs
      return {
        x: (x + endx) / 2,
        y: (y + endY) / 2 - 10
      };
    }
  };
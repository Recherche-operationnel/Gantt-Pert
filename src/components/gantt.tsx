import { Activity, Project } from "@/types/types";
import { useEffect, useState } from "react";
import { ProjectService } from "@/services/project.services";
import { ActivityService } from "@/services/activity.services";

const projectService = new ProjectService();
const activityService = new ActivityService();

const GanttDiagram = () => {
  
  const [project, setProject] = useState<Project | null>(null);
  const [projectActivities, setProjectActivities] = useState<Activity[]>([]);

  // Calculs pour le diagramme de Gantt
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

    const tasksWithDates = calculateStartEnd(projectActivities);
    const maxDuration = tasksWithDates.length > 0 ? Math.max(...tasksWithDates.map(t => t.end)) : 0;

  return (
    <div className="flex flex-col gap-4">
      La vue du diagram de GANTT

      <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Diagramme de Gantt</h2>
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="flex">
                  <div className="w-48 flex-shrink-0"></div>
                  <div className="flex">
                    {Array.from({ length: maxDuration }, (_, i) => (
                      <div key={i} className="w-12 text-center text-xs font-medium text-gray-500">{i + 1}</div>
                    ))}
                  </div>
                </div>
                {tasksWithDates.map((task) => (
                  <div key={task.id} className="flex items-center h-10">
                    <div className="w-48 flex-shrink-0 pr-2 font-medium text-sm truncate">
                      {task.title}
                    </div>
                    <div className="flex relative" style={{ marginLeft: `${task.start * 3}rem` }}>
                      <div 
                        className="h-6 rounded bg-blue-500 text-white text-xs flex items-center justify-center"
                        style={{ width: `${task.duration * 3}rem` }}
                      >
                        {task.duration}jours
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
     
    </div>
  );
}
export default GanttDiagram;


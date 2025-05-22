"use client";
import { useState, useEffect } from "react";
import Modal from "./modal";
import { X } from "lucide-react";
import { Activity, Project } from "@/types/types"
import { ProjectService } from "@/services/project.services";
import { ActivityService } from "@/services/activity.services";
import { useSearchParams } from "next/navigation";

const projectService = new ProjectService();
const activityService = new ActivityService();

const Standard = () => {
  
    const [project, setProject] = useState<Project | null>(null);
    const [projectActivities, setProjectActivities] = useState<Activity[]>([]);
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id') || "P3";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    duration: 0,
    dependencies: [] as string[],
  });
  const [error, setError] = useState("");

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
             console.log("project activities: ",projectActivities);
          }
         
        };
        loadProjectActivities();
  
      }, []);

  const handleAddTask = () => {
    if (newTask.title && newTask.duration > 0) {
      const task: Activity = {
        id: `T${Date.now()}`,
        ...newTask,
      };
      setProjectActivities([...projectActivities, task]);
      setNewTask({ title: "", duration: 0, dependencies: [] });
      setIsModalOpen(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setProjectActivities(projectActivities.filter(task => task.id !== taskId));
  };

  const getDependencyNames = (dependencies: string[]) => {
    return dependencies
      .map(id => projectActivities.find(t => t.id === id)?.title || 'Inconnue')
      .join(", ") || "Aucune";
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;


  return (
    <div className="flex flex-col gap-4">
     
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Tâches</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Ajouter une Tâche
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="px-4 py-3 text-left rounded-tl-lg">Tâche</th>
              <th className="px-4 py-3 text-left">Durée</th>
              <th className="px-4 py-3 text-left">Dépendances</th>
              <th className="px-4 py-3 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {projectActivities.map((task) => (
              <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{task.title}</td>
                <td className="px-4 py-3">{task.duration} jours</td>
                <td className="px-4 py-3">{getDependencyNames(task.dependencies)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 relative">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
          >
            <X className="w-6 h-6" />
          </button>

          <h3 className="text-xl font-semibold mb-4 text-black">Nouvelle Tâche</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-black"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Durée (jours)
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border text-black"
                value={newTask.duration}
                onChange={(e) =>
                  setNewTask({ ...newTask, duration: parseInt(e.target.value) || 0 })
                }
              />
            </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dépendances
              </label>

              {/* Tags des activités sélectionnés */}
              <div className="flex flex-wrap gap-2 border rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500 mb-2">
                {newTask.dependencies.map((id) => {
                  const task = projectActivities.find((t) => t.id === id);
                  return (
                    <span
                      key={id}
                      className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                    >
                      {task?.title || id}
                      <button
                        type="button"
                        onClick={() =>
                          setNewTask({
                            ...newTask,
                            dependencies: newTask.dependencies.filter((dep) => dep !== id),
                          })
                        }
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Sélecteur de dépendance */}
              <select
                className="block w-full border rounded-md px-3 py-2 text-sm text-black bg-white"
                value=""
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (selectedId) {
                    setNewTask({
                      ...newTask,
                      dependencies: [...newTask.dependencies, selectedId],
                    });
                  }
                }}
              >
                <option value="" disabled>
                  Sélectionner une tâche...
                </option>
                {projectActivities
                  .filter((t) => !newTask.dependencies.includes(t.id))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleAddTask}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Créer la Tâche
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
  );
}
export default Standard;
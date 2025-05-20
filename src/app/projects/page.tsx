
'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal";
import { Project } from "@/types/types";
import { ProjectService } from "@/services/project.services";

const projectService = new ProjectService();

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", title: "" });
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [newlyCreatedProjectId, setNewlyCreatedProjectId] = useState<string | null>(null);
  const [newlyEditedProjectId, setNewlyEditedProjectId] = useState<string | null>(null);
  const router = useRouter();

  // Référence pour faire défiler jusqu'au nouveau projet
  const newProjectRef = useRef<HTMLDivElement>(null);
  const editedProjectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  // Effet pour faire défiler jusqu'au projet nouvellement créé ou édité
  useEffect(() => {
    if (newlyCreatedProjectId && newProjectRef.current) {
      newProjectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Réinitialiser l'ID après un certain temps
      const timer = setTimeout(() => {
        setNewlyCreatedProjectId(null);
      }, 5000); // Garde l'effet de surlignage pendant 5 secondes
      
      return () => clearTimeout(timer);
    }
  }, [newlyCreatedProjectId]);

  useEffect(() => {
    if (newlyEditedProjectId && editedProjectRef.current) {
      editedProjectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Réinitialiser l'ID après un certain temps
      const timer = setTimeout(() => {
        setNewlyEditedProjectId(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [newlyEditedProjectId]);

  const loadProjects = async () => {
    try {
      const data = await projectService.fetchAll();
      setProjects(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
      setError("Impossible de charger les projets");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.name || !newProject.title) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      // Générer un ID unique
      const projectId = `P${Date.now()}`;
      
      const projectData: Project = {
        id: projectId,
        name: newProject.name,
        title: newProject.title,
        activities: [] // Initialisation avec un tableau vide
      };
      
      const createdProject = await projectService.create(projectData);
      
      // Mettre à jour l'état local
      setProjects(prevProjects => [...prevProjects, createdProject]);
      
      // Réinitialiser le formulaire et fermer le modal
      setNewProject({ name: "", title: "" });
      setIsModalOpen(false);
      
      // Afficher un message de succès
      setError(null); // Effacer les erreurs précédentes
      setSuccessMessage(`Le projet "${createdProject.title}" a été créé avec succès`);
      
      // Définir l'ID du projet nouvellement créé pour le surlignage
      setNewlyCreatedProjectId(projectId);
      
      // Faire disparaître le message de succès après quelques secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      setError("Une erreur est survenue lors de la création du projet");
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer le clic sur le bouton d'édition
  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Empêche la navigation vers le projet
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  // Mettre à jour le projet
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectToEdit) return;
    
    if (!projectToEdit.name || !projectToEdit.title) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setIsLoading(true);
    try {
      const updatedProject = await projectService.updateProject(projectToEdit.id, projectToEdit);
      
      if (!updatedProject) {
        setError("Impossible de mettre à jour le projet");
        return;
      }
      
      // Mettre à jour l'état local
      setProjects(prevProjects => 
        prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
      );
      
      // Fermer le modal et réinitialiser
      setIsEditModalOpen(false);
      
      // Afficher un message de succès
      setSuccessMessage(`Le projet "${updatedProject.title}" a été mis à jour avec succès`);
      
      // Définir l'ID du projet édité pour le surlignage
      setNewlyEditedProjectId(updatedProject.id);
      
      // Faire disparaître le message de succès après quelques secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du projet:", error);
      setError("Une erreur est survenue lors de la mise à jour du projet");
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer le clic sur le bouton de suppression
  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Empêche la navigation vers le projet
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  // Confirmer et exécuter la suppression
  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    setIsLoading(true);
    try {
      const success = await projectService.deleteProject(projectToDelete);
      if (success) {
        // Mise à jour locale de l'état
        setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete));
        // Afficher un message de succès
        setSuccessMessage("Le projet a été supprimé avec succès");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError("Projet non trouvé ou impossible à supprimer");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Une erreur est survenue lors de la suppression");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  // Vérifier si un projet est nouvellement créé ou édité
  const isHighlightedProject = (projectId: string) => {
    return projectId === newlyCreatedProjectId || projectId === newlyEditedProjectId;
  };

  // Déterminer le message de badge
  const getBadgeText = (projectId: string) => {
    if (projectId === newlyCreatedProjectId) return "Nouveau";
    if (projectId === newlyEditedProjectId) return "Modifié";
    return "";
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      {/* En-tête avec titre et bouton de création */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Liste des projets</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Créer un projet
        </button>
      </div>
      
      {/* Afficher les messages d'erreur */}
      {error && (
        <div className="bg-red-900 text-white p-3 rounded-md mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Afficher les messages de succès */}
      {successMessage && (
        <div className="bg-green-900 text-white p-3 rounded-md mb-4 flex justify-between items-center">
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage(null)} 
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Affichage des projets ou message si aucun projet */}
      {projects.length === 0 ? (
        <div className="text-center p-10 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-300">Aucun projet créé pour le moment</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-indigo-400 underline hover:text-indigo-300"
          >
            Créer votre premier projet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              ref={project.id === newlyCreatedProjectId 
                ? newProjectRef 
                : project.id === newlyEditedProjectId 
                  ? editedProjectRef 
                  : null}
              className={`bg-gray-800 border ${
                isHighlightedProject(project.id)
                  ? 'border-green-500 shadow-lg shadow-green-900/30' 
                  : 'border-gray-700'
              } rounded-lg shadow-sm hover:shadow-md transition-all duration-500 p-6 cursor-pointer relative`}
              onClick={() => router.push(`/projectViews?id=${project.id}`)}
            >
              <h3 className="text-xl font-semibold mb-2 text-white pr-14">{project.title}</h3>
              <p className="text-gray-300">{project.name}</p>
              
              {/* Badge pour projet nouvellement créé ou édité */}
              {isHighlightedProject(project.id) && (
                <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {getBadgeText(project.id)}
                </span>
              )}
              
              {/* Boutons d'actions */}
              <div className="absolute top-3 right-3 flex space-x-2">
                {/* Bouton d'édition */}
                <button
                  onClick={(e) => handleEditClick(e, project)}
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                  aria-label="Modifier le projet"
                >
                  <span className="text-xl">✏️</span>
                </button>
                
                {/* Bouton de suppression */}
                <button
                  onClick={(e) => handleDeleteClick(e, project.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Supprimer le projet"
                >
                  <span className="text-xl">🗑️</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de création de projet */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 bg-gray-900 text-white">
          <h2 className="text-xl font-bold mb-4 text-white">Créer un nouveau projet</h2>
          
          {error && (
            <div className="bg-red-900 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleCreateProject}>
            <div className="mb-4">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
                Nom du projet
              </label>
              <input
                id="projectName"
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Entrez le nom du projet"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-300 mb-1">
                Titre du projet
              </label>
              <input
                id="projectTitle"
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                placeholder="Entrez le titre du projet"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal d'édition de projet */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-6 bg-gray-900 text-white">
          <h2 className="text-xl font-bold mb-4 text-white">Modifier le projet</h2>
          
          {error && (
            <div className="bg-red-900 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {projectToEdit && (
            <form onSubmit={handleUpdateProject}>
              <div className="mb-4">
                <label htmlFor="editProjectName" className="block text-sm font-medium text-gray-300 mb-1">
                  Nom du projet
                </label>
                <input
                  id="editProjectName"
                  type="text"
                  value={projectToEdit.name}
                  onChange={(e) => setProjectToEdit({...projectToEdit, name: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Entrez le nom du projet"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="editProjectTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Titre du projet
                </label>
                <input
                  id="editProjectTitle"
                  type="text"
                  value={projectToEdit.title}
                  onChange={(e) => setProjectToEdit({...projectToEdit, title: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white"
                  placeholder="Entrez le titre du projet"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Modification...' : 'Modifier'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6 bg-gray-900 text-white">
          <h2 className="text-xl font-bold mb-4 text-white">Confirmer la suppression</h2>
          <p className="mb-6">
            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className={`px-4 py-2 bg-red-600 text-white rounded-md ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProjectsPage;
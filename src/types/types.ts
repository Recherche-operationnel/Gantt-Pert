
export interface Project {
    id: string;
    name: string; // Ajout de cette propriété pour corriger l'erreur de build
    title: string;
    activities: string[];
}

export interface Activity {
    id: string;
    title: string;
    duration: number;
    dependencies: string[];
}

export type ViewType = 'standard' | 'gantt' | 'pert';
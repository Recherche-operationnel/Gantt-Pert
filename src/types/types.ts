
export interface Project {
    id: number;
    description: string; // Ajout de cette propriété pour corriger l'erreur de build
    title: string;
    activities: string[];
}

export interface Activity {
    id: number;
    title: string;
    duration: number;
    dependencies: number[];
}

export type ViewType = 'standard' | 'gantt' | 'pert';
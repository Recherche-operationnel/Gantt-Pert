export interface Project {
    id: string;   
    title: string;
    activities: string[];
}

export interface Activity{
    id: string;
    title: string;
    duration: number;
    dependencies: string[];
}

export type ViewType = 'standard' | 'gantt' | 'pert';
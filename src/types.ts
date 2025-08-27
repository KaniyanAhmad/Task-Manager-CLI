
export interface Task {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    completedAt?: Date;
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
}

export type Priority = 'low' | 'medium' | 'high';
export type TaskFilter = 'all' | 'completed' | 'pending';

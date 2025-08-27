export interface Task {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    completedAt?: Date;
}
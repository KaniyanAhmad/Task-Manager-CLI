import { Task, TaskStats, Priority } from '../types';

export const formatters = {
    
    // Formats a single task into a string representation
    task: (task: Task, showId: boolean): string => {
        const status = task.completed ? "[x]" : "[ ]";
        const id = showId ? `(${task.id}) ` : "";
        const priority = formatters.priority(task.priority);
        
        return `${id}${status} ${task.text} ${priority}`;
    },

    // Formats priority into a string representation
    priority: (priority: Priority): string => {
        const priorityMap = {
            'low': '!',
            'medium': '!!',
            'high': '!!!'
        };
    return `${priorityMap[priority]}`;
    },

    // Formats task list into a string representation
    taskList: (tasks: Task[]): string => {
        if (tasks.length === 0) {
            return "No tasks available.";
        }
        return tasks.map(task => formatters.task(task, true)).join('\n');
    },

    // Formats task statistics into a string representation
    stats: (stats: TaskStats): string => {
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        return `
            📊 Task Statistics:
            ├── Total: ${stats.total}
            ├── Completed: ${stats.completed}
            ├── Pending: ${stats.pending}
            └── Completion Rate: ${completionRate}%`;
    },

    // Formats an error message
    error: (message: string): string => {
        return `❗ Error: ${message}`;
    },

    // Add the success formatter
    success: (message: string): string => {
        return `✅ Success: ${message}`;
    }
}
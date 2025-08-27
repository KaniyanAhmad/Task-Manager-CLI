
export class  ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validators = {

    // Validates if the input string is a valid text
    taskText: (text: string): void => {
        if (typeof text !== 'string' || text.trim().length === 0) {
            throw new ValidationError('Task text must be a non-empty string.');
        }
        if (text.length > 255) {
            throw new ValidationError('Task text must not exceed 255 characters.');
        }
    },

    // Validates if the input is a valid task ID (positive integer)
    taskId: (id: string | number): number => {
        const parsedId = typeof id === 'number' ? id : parseInt(id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ValidationError('Task ID must be a positive integer.');
        }
        return parsedId;
    },

    // Validates if the input string is a valid priority
    priority: (priority: string): 'low' | 'medium' | 'high' => {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            throw new ValidationError(`Priority must be one of: ${validPriorities.join(', ')}.`);
        }
        return priority as 'low' | 'medium' | 'high';
    },


    filter: (filter: string): 'all' | 'completed' | 'pending' => {
        const validFilters = ['all', 'completed', 'pending'];
        if (!validFilters.includes(filter)) {
            throw new ValidationError(`Filter must be one of: ${validFilters.join(', ')}.`);
        }
        return filter as 'all' | 'completed' | 'pending';
    }
};
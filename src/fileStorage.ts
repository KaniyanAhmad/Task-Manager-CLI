import * as fs from 'fs/promises';
import * as path from 'path';
import { Task } from './types';

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class FileStorage {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(process.cwd(), filename);
  }

  async loadTasks(): Promise<Task[]> {  // Load tasks from the JSON file
    try {
      await fs.access(this.filePath); // Check if file exists
      const data = await fs.readFile(this.filePath, 'utf-8'); // Read file content
      const tasks: Task[] = JSON.parse(data); // Parse JSON content
      return tasks.map((task: any) => ({  // Ensure date fields are properly converted
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []; // File does not exist, return empty array
      }
      throw new StorageError(`Failed to load tasks: ${(error as Error).message}`); // Rethrow as StorageError
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {  // Save tasks to the JSON file
    try {
      const data = JSON.stringify(tasks, null, 2); // Convert tasks to JSON string
      await fs.writeFile(this.filePath, data, 'utf-8'); // Write to file
    } catch (error) {
      throw new StorageError(`Failed to save tasks: ${(error as Error).message}`); // Rethrow as StorageError
    }
  }

  getFilePath(): string { // Get the file path
    return this.filePath;
  }

  async exists(): Promise<boolean> { // Check if the file exists
    try {
      await fs.access(this.filePath);
      return true;
    } catch {
      return false;
    }  
  }
}
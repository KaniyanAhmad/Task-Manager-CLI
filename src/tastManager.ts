import { Task, TaskStats, Priority, TaskFilter } from './types';
import { FileStorage, StorageError } from './fileStorage';
import { validators, ValidationError } from './utils/validators';

export class TaskManager {
  private storage: FileStorage;
  private tasks: Task[] = [];
  private nextId: number = 1;

  constructor(storage: FileStorage) {
    this.storage = storage;
  }

  // Initialize task manager (load existing tasks)
  async initialize(): Promise<void> {
    try {
      this.tasks = await this.storage.loadTasks();
      
      // Set next ID based on existing tasks
      if (this.tasks.length > 0) {
        this.nextId = Math.max(...this.tasks.map(task => task.id)) + 1;
      }
      
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new Error(`Failed to initialize task manager: ${(error as Error).message}`);
    }
  }

  // Add a new task
  async addTask(text: string, priority: Priority = 'medium'): Promise<Task> {
    // Validate input
    validators.taskText(text);
    
    // Create new task
    const task: Task = {
      id: this.nextId++,
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date()
    };

    // Add to memory
    this.tasks.push(task);
    
    // Save to storage
    await this.storage.saveTasks(this.tasks);
    
    return task;
  }

  // Get all tasks with optional filtering
  getTasks(filter: TaskFilter = 'all'): Task[] {
    switch (filter) {
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      case 'all':
      default:
        return [...this.tasks]; // Return copy to prevent mutation
    }
  }

  // Get task by ID
  getTask(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  // Complete a task
  async completeTask(id: number): Promise<Task> {
    const validId = validators.taskId(id);
    
    const task = this.getTask(validId);
    if (!task) {
      throw new ValidationError(`Task with ID ${validId} not found`);
    }

    if (task.completed) {
      throw new ValidationError(`Task ${validId} is already completed`);
    }

    // Mark as completed
    task.completed = true;
    task.completedAt = new Date();
    
    // Save to storage
    await this.storage.saveTasks(this.tasks);
    
    return task;
  }

  // Uncomplete a task
  async uncompleteTask(id: number): Promise<Task> {
    const validId = validators.taskId(id);
    
    const task = this.getTask(validId);
    if (!task) {
      throw new ValidationError(`Task with ID ${validId} not found`);
    }

    if (!task.completed) {
      throw new ValidationError(`Task ${validId} is not completed`);
    }

    // Mark as not completed
    task.completed = false;
    task.completedAt = undefined;
    
    // Save to storage
    await this.storage.saveTasks(this.tasks);
    
    return task;
  }

  // Delete a task
  async deleteTask(id: number): Promise<Task> {
    const validId = validators.taskId(id);
    
    const taskIndex = this.tasks.findIndex(task => task.id === validId);
    if (taskIndex === -1) {
      throw new ValidationError(`Task with ID ${validId} not found`);
    }

    // Remove from array and ensure we have a task
    const deletedTasks = this.tasks.splice(taskIndex, 1);
    const deletedTask = deletedTasks[0];
    
    if (!deletedTask) {
      throw new Error('Unexpected error: Task not found after splice');
    }
    
    // Save to storage
    await this.storage.saveTasks(this.tasks);
    
    return deletedTask;
  }

  // Edit task text
  async editTask(id: number, newText: string): Promise<Task> {
    const validId = validators.taskId(id);
    validators.taskText(newText);
    
    const task = this.getTask(validId);
    if (!task) {
      throw new ValidationError(`Task with ID ${validId} not found`);
    }

    // Update text
    task.text = newText.trim();
    
    // Save to storage
    await this.storage.saveTasks(this.tasks);
    
    return task;
  }

  // Get task statistics
  getStats(): TaskStats {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending
    };
  }
}
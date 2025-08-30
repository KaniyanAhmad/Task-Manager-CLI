import { TaskManager } from './taskManager';
import { ValidationError } from './utils/validators';
import { StorageError } from './fileStorage';
import { formatters } from './utils/formatters';
import { Priority, TaskFilter } from './types';

export class CLI {
  private taskManager: TaskManager;

  constructor(taskManager: TaskManager) {
    this.taskManager = taskManager;
  }

  // Parse command line arguments and execute commands
  async run(args: string[]): Promise<void> {
    const command = args[0];

    try {
      switch (command) {
        case 'add':
          await this.handleAdd(args.slice(1));
          break;
        case 'list':
          await this.handleList(args.slice(1));
          break;
        case 'complete':
          await this.handleComplete(args.slice(1));
          break;
        case 'uncomplete':
          await this.handleUncomplete(args.slice(1));
          break;
        case 'delete':
          await this.handleDelete(args.slice(1));
          break;
        case 'edit':
          await this.handleEdit(args.slice(1));
          break;
        case 'stats':
          await this.handleStats();
          break;
        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
          break;
        default:
          console.log(formatters.error('Unknown command. Use "help" for available commands.'));
          process.exit(1);
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // Handle "add" command
  private async handleAdd(args: string[]): Promise<void> {
    if (args.length === 0) {
      throw new ValidationError('Please provide task text');
    }

    const text = args.join(' ');
    const task = await this.taskManager.addTask(text);
    
    console.log(formatters.success(`Added task: ${task.text} (ID: ${task.id})`));
  }

  // Handle "list" command
  private async handleList(args: string[]): Promise<void> {
    const filter = (args[0] || 'all') as TaskFilter;
    const tasks = this.taskManager.getTasks(filter);
    
    console.log(formatters.taskList(tasks));
  }

  // Handle "complete" command
  private async handleComplete(args: string[]): Promise<void> {
    if (args.length === 0) {
      throw new ValidationError('Please provide task ID');
    }

    const taskId = parseInt(args[0], 10);
    const task = await this.taskManager.completeTask(taskId);
    
    console.log(formatters.success(`Completed task: ${task.text}`));
  }

  // Handle "uncomplete" command
  private async handleUncomplete(args: string[]): Promise<void> {
    if (args.length === 0) {
      throw new ValidationError('Please provide task ID');
    }

    const taskId = parseInt(args[0], 10);
    const task = await this.taskManager.uncompleteTask(taskId);
    
    console.log(formatters.success(`Uncompleted task: ${task.text}`));
  }

  // Handle "delete" command
  private async handleDelete(args: string[]): Promise<void> {
    if (args.length === 0) {
      throw new ValidationError('Please provide task ID');
    }

    const taskId = parseInt(args[0], 10);
    const task = await this.taskManager.deleteTask(taskId);
    
    console.log(formatters.success(`Deleted task: ${task.text}`));
  }

  // Handle "edit" command
  private async handleEdit(args: string[]): Promise<void> {
    if (args.length < 2) {
      throw new ValidationError('Please provide task ID and new text');
    }

    const taskId = parseInt(args[0], 10);
    const newText = args.slice(1).join(' ');
    
    const task = await this.taskManager.editTask(taskId, newText);
    
    console.log(formatters.success(`Updated task: ${task.text}`));
  }

  // Handle "stats" command
  private async handleStats(): Promise<void> {
    const stats = this.taskManager.getStats();
    console.log(formatters.stats(stats));
  }

  // Show help information
  private showHelp(): void {
    console.log(`
📝 Task Manager CLI

Usage: npm start <command> [options]

Commands:
  add <text>           Add a new task
  list [filter]        List tasks (all|completed|pending)
  complete <id>        Mark task as completed
  uncomplete <id>      Mark task as not completed
  delete <id>          Delete a task
  edit <id> <text>     Edit task text
  stats                Show task statistics
  help                 Show this help message

Examples:
  npm start add "Buy groceries"
  npm start list pending
  npm start complete 1
  npm start delete 2
  npm start edit 3 "Buy organic groceries"
    `);
  }

  // Handle errors gracefully
  private handleError(error: Error): void {
    if (error instanceof ValidationError) {
      console.log(formatters.error(error.message));
      process.exit(1);
    } else if (error instanceof StorageError) {
      console.log(formatters.error(`Storage error: ${error.message}`));
      process.exit(1);
    } else {
      console.log(formatters.error(`Unexpected error: ${error.message}`));
      process.exit(1);
    }
  }
}
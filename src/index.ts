import { TaskManager } from './taskManager';
import { FileStorage } from './fileStorage';
import { CLI } from './cli';

async function main() {
  try {
    // Initialize storage
    const storage = new FileStorage('tasks.json');
    
    // Initialize task manager
    const taskManager = new TaskManager(storage);
    await taskManager.initialize();
    
    // Initialize CLI
    const cli = new CLI(taskManager);
    
    // Get command line arguments (skip 'node' and script name)
    const args = process.argv.slice(2);
    
    // Run the CLI
    await cli.run(args);
    
  } catch (error) {
    console.error('❌ Application failed to start:', (error as Error).message);
    process.exit(1);
  }
}

// Start the application
main();
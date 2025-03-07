import { Command } from 'commander';
import { registerNgrokCommands } from './ngrok';
import { registerAdbCommands } from './adb';

export const registerAllCommands = (program: Command): void => {
  // Register all main commands
  registerNgrokCommands(program);
  registerAdbCommands(program);
}; 
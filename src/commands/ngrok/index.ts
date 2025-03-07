import { Command } from 'commander';
import { registerUrlCommand } from './url';

export const registerNgrokCommands = (program: Command): Command => {
  const ngrokCommand = program
    .command('ngrok')
    .description('Commands related to ngrok');
  
  // Register subcommands
  registerUrlCommand(ngrokCommand);

  return ngrokCommand;
}; 
import { Command } from 'commander';
import { registerUrlCommand } from './url';
import { registerEnvCommand } from './env';

export const registerNgrokCommands = (program: Command): Command => {
  const ngrokCommand = program
    .command('ngrok')
    .description('Commands related to ngrok');
  
  // Register subcommands
  registerUrlCommand(ngrokCommand);
  registerEnvCommand(ngrokCommand);

  return ngrokCommand;
}; 
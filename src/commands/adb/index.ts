import { Command } from 'commander';
import { registerWirelessCommand } from './wireless';
import { registerUnlockCommand } from './unlock';

export const registerAdbCommands = (program: Command): Command => {
  const adbCommand = program
    .command('adb')
    .description('Android Debug Bridge (ADB) related commands');
  
  // Register subcommands
  registerWirelessCommand(adbCommand);
  registerUnlockCommand(adbCommand);

  return adbCommand;
}; 
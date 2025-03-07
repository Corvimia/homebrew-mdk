#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getPackageInfo } from './generated-package-info';
import { registerAllCommands } from './commands';

process.removeAllListeners('warning');

const packageInfo = getPackageInfo();

const program = new Command();

program
  .name(packageInfo.name)
  .description(packageInfo.description)
  .version(packageInfo.version);

program
  .command('version')
  .description('Display the version number')
  .action(() => {
    console.log(chalk.blue(`${packageInfo.name} version:`), chalk.green(packageInfo.version));
  });

// Register all commands
registerAllCommands(program);

program.parse();

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getNgrokUrl } from './ngrok';
// Import from generated file if it exists (for builds), otherwise use the development version
import { getPackageInfo } from './generated-package-info';

// Get package info from the module that will be embedded in the SEA blob
const packageInfo = getPackageInfo();

process.removeAllListeners('warning');


const program = new Command();

program
  .name('mdk')
  .description(`Mia's Dev Kit`)
  .version(packageInfo.version);

program
  .command('version')
  .description('Display the version number')
  .action(() => {
    console.log(chalk.blue('mdk version:'), chalk.green(packageInfo.version));
  });

  program
  .command('ngrok')
  .command('url')
  .description('Extract URL from current ngrok')
  .action(async () => {
    const url = await getNgrokUrl();
    console.log(chalk.blue("ngrok url:"), chalk.green(url));
    // TODO: add it to the current clipboard
  });

program.parse();

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

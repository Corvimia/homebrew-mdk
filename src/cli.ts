#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';

// Use process.cwd() instead of import.meta.url
const packageJsonPath = join(process.cwd(), 'package.json');

// Read package.json
const packageJson = JSON.parse(
  readFileSync(packageJsonPath, 'utf-8')
);

process.removeAllListeners('warning');


const program = new Command();

program
  .name('mdk')
  .description(`Mia's Dev Kit`)
  .version(packageJson.version);

program
  .command('version')
  .description('Display the version number')
  .action(() => {
    console.log(chalk.blue('mdk version:'), chalk.green(packageJson.version));
  });

program.parse();

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
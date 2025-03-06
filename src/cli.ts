#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getNgrokUrl } from './ngrok';
import { setupAdbWireless } from './adb';
import { writeToClipboard } from './utils/clipboard';
import { getPackageInfo } from './generated-package-info';

// Don't import clipboardy at the top level to avoid errors when running simple commands
// We'll import it dynamically only when needed

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

program
  .command('ngrok')
  .command('url')
  .description('Extract URL from current ngrok')
  .action(async () => {
    const url = await getNgrokUrl();
    console.log(chalk.blue("ngrok url:"), chalk.green(url));
    
    try {
      await writeToClipboard(url);
      console.log(chalk.yellow('✓ URL copied to clipboard'));
    } catch (error) {
      console.log(chalk.red('Failed to copy URL to clipboard'));
    }
  });

// Add the adb-wireless command
program
  .command('adb-wireless')
  .description('Switch Android device from USB to wireless ADB debugging')
  .option('-p, --port <port>', 'Specify custom port (default: 5555)')
  .option('-d, --device <serial>', 'Specify device serial number')
  .option('-i, --interface <interface>', 'Specify network interface (default: wlan0)')
  .action(async (options) => {
    try {
      await setupAdbWireless({
        port: options.port ? parseInt(options.port, 10) : undefined,
        device: options.device,
        interface: options.interface
      });
    } catch (error) {
      console.error(chalk.red('Error setting up ADB wireless connection:'), error);
      process.exit(1);
    }
  });

program.parse();

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

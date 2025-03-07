#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getNgrokUrl } from './ngrok';
import { setupAdbWireless } from './adb';
import { writeToClipboard } from './utils/clipboard';
import { getPackageInfo } from './generated-package-info';
import { execSync } from 'child_process';
import { Client } from 'adb-ts';

// Don't import clipboardy at the top level to avoid errors when running simple commands
// We'll import it dynamically only when needed

process.removeAllListeners('warning');

const packageInfo = getPackageInfo();
// Initialize ADB client
const adbClient = new Client();

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

// Add the adb command with subcommands
const adbCommand = program
  .command('adb')
  .description('Android Debug Bridge (ADB) related commands');

// Add the adb wireless subcommand
adbCommand
  .command('wireless')
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

// Add the adb unlock command
adbCommand
  .command('unlock')
  .description('Unlock Android device with swipe and PIN')
  .option('-d, --device <serial>', 'Specify device serial number')
  .action(async (options) => {
    try {
      console.log(chalk.blue('Unlocking device...'));
      
      // Get available devices
      const devices = await adbClient.listDevices();
      
      // Find target device
      let deviceId;
      if (options.device) {
        // Use specified device if provided
        deviceId = options.device;
      } else {
        // Otherwise use first available device
        const availableDevice = devices.find(d => d.state === 'device');
        if (!availableDevice) {
          throw new Error('No connected devices found in ready state');
        }
        deviceId = availableDevice.id;
      }
      
      console.log(chalk.blue(`Using device: ${deviceId}`));
      
      // Perform unlock operations
      console.log(chalk.blue('Swiping to unlock screen...'));
      await adbClient.swipe(deviceId, 100, 1000, 100, 0, { duration: 500 });
      
      // Wait a bit for the swipe to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(chalk.blue('Entering PIN...'));
      await adbClient.text(deviceId, '137950');
      
      // Wait a bit for text input to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(chalk.blue('Pressing Enter...'));
      await adbClient.keyEvent(deviceId, 66); // 66 is the keycode for ENTER
      
      console.log(chalk.green('Device unlocked successfully!'));
    } catch (error) {
      console.error(chalk.red('Error unlocking device:'), error);
      process.exit(1);
    }
  });

program.parse();

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

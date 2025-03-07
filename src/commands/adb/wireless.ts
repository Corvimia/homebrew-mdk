import { Command } from 'commander';
import chalk from 'chalk';
import { setupAdbWireless } from '../../adb';

export const registerWirelessCommand = (program: Command): void => {
  program
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
}; 
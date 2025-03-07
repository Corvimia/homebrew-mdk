import { Command } from 'commander';
import chalk from 'chalk';
import { Client } from 'adb-ts';

// Initialize ADB client
const adbClient = new Client();

export const registerUnlockCommand = (program: Command): void => {
  program
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
}; 
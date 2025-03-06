import { spawn, spawnSync, execSync } from 'child_process';
import chalk from 'chalk';
import { createInterface } from 'readline';

/**
 * Check if a command exists on the system
 */
export const commandExists = (command: string): boolean => {
  try {
    execSync(`command -v ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Interface for ADB wireless connection options
 */
export interface AdbWirelessOptions {
  port?: number;
  device?: string;
  interface?: string;
}

/**
 * Set up ADB wireless connection
 */
export const setupAdbWireless = async (options: AdbWirelessOptions = {}): Promise<void> => {
  const port = options.port || 5555;
  const networkInterface = options.interface || 'wlan0';
  
  // Check if ADB is installed
  if (!commandExists('adb')) {
    console.log(chalk.red('Error: ADB is not installed or not in your PATH'));
    console.log('Please install Android Debug Bridge (ADB) and try again');
    process.exit(1);
  }

  // Get connected devices
  console.log(chalk.blue('Scanning for connected devices...'));
  const devicesOutput = execSync('adb devices').toString().trim();
  const deviceLines = devicesOutput.split('\n').slice(1).filter(line => line.trim() !== '');
  
  if (deviceLines.length === 0) {
    console.log(chalk.red('No devices found. Make sure your device is connected via USB.'));
    process.exit(1);
  }

  // Process devices and extract serials
  const devices = deviceLines.map(line => line.split('\t')[0]);
  let selectedDevice: string;

  // If a specific device was requested, check if it's connected
  if (options.device) {
    if (!devices.includes(options.device)) {
      console.log(chalk.red(`Specified device '${options.device}' not found.`));
      console.log('Available devices:');
      devices.forEach(device => console.log(device));
      process.exit(1);
    } else {
      selectedDevice = options.device;
      console.log(chalk.green(`Using specified device: ${selectedDevice}`));
    }
  } 
  // If multiple devices are connected, let the user choose
  else if (devices.length > 1) {
    console.log(chalk.yellow('Multiple devices found:'));
    devices.forEach((device, index) => {
      console.log(`  ${index + 1}) ${device}`);
    });
    
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      selectedDevice = await new Promise<string>((resolve, reject) => {
        rl.question(chalk.yellow(`Please select a device (1-${devices.length}) or Ctrl+C to cancel: `), (answer) => {
          const selection = parseInt(answer, 10);
          
          if (isNaN(selection) || selection < 1 || selection > devices.length) {
            rl.close();
            reject(new Error('Invalid selection'));
            return;
          }
          
          resolve(devices[selection - 1]);
          rl.close();
        });
      });
      
      console.log(chalk.green(`Selected device: ${selectedDevice}`));
    } catch (error) {
      console.log(chalk.red('Invalid selection.'));
      process.exit(1);
    }
  } 
  // Just one device connected
  else {
    selectedDevice = devices[0];
    console.log(chalk.green(`Using device: ${selectedDevice}`));
  }

  // Enable TCP/IP mode
  console.log(chalk.blue(`Enabling TCP/IP mode on port ${port}...`));
  
  try {
    execSync(`adb -s "${selectedDevice}" tcpip ${port}`);
  } catch (error) {
    console.log(chalk.red('Failed to enable TCP/IP mode. Make sure your device allows debugging.'));
    process.exit(1);
  }

  // Give some time for the command to take effect
  console.log(chalk.blue('Waiting for device to switch modes...'));
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Get device IP address using various methods
  console.log(chalk.blue('Retrieving device IP address...'));
  let ip = '';
  
  try {
    // Try the main method
    ip = execSync(`adb -s "${selectedDevice}" shell ip -f inet addr show ${networkInterface} | grep "inet " | awk '{print $2}' | cut -d/ -f1`).toString().trim();
    
    // If main method doesn't work, try alternatives
    if (!ip) {
      console.log(chalk.yellow('Standard method failed. Trying alternative method...'));
      
      try {
        ip = execSync(`adb -s "${selectedDevice}" shell ifconfig ${networkInterface} 2>/dev/null | grep "inet addr" | awk '{print $2}' | cut -d: -f2`).toString().trim();
      } catch (error) {
        // Ignore errors from this attempt
      }
      
      if (!ip) {
        // Try with netcfg for older Android versions
        try {
          ip = execSync(`adb -s "${selectedDevice}" shell netcfg 2>/dev/null | grep "${networkInterface}" | awk '{print $3}' | cut -d/ -f1`).toString().trim();
        } catch (error) {
          // Ignore errors from this attempt
        }
      }
    }
  } catch (error) {
    // If all methods fail, show available interfaces
    console.log(chalk.red('Failed to retrieve IP address. Make sure your device is connected to Wi-Fi.'));
    console.log(chalk.yellow('Available network interfaces:'));
    const interfaces = execSync(`adb -s "${selectedDevice}" shell ip addr`).toString();
    console.log(interfaces);
    process.exit(1);
  }

  if (!ip) {
    console.log(chalk.red('Failed to retrieve IP address. Make sure your device is connected to Wi-Fi.'));
    process.exit(1);
  }

  console.log(chalk.green(`Device IP: ${ip}`));

  // Connect via Wi-Fi
  console.log(chalk.blue('Connecting to device over Wi-Fi...'));
  
  try {
    execSync(`adb connect "${ip}:${port}"`);
  } catch (error) {
    console.log(chalk.red('Failed to connect to device over Wi-Fi.'));
    process.exit(1);
  }

  // Verify the connection
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const connectedDevices = execSync('adb devices').toString();
  const isConnected = connectedDevices.includes(`${ip}:${port}`) && !connectedDevices.includes(`${ip}:${port}\toffline`);
  
  if (!isConnected) {
    console.log(chalk.red('Device appears to be offline or not connected properly.'));
    console.log(chalk.yellow('You may need to try again or verify your device settings.'));
    process.exit(1);
  }

  console.log(chalk.green('ADB over Wi-Fi setup complete!'));
  console.log(chalk.blue('You can now disconnect the USB cable.'));
  console.log();
  console.log(chalk.yellow('To reconnect later, use:'), `adb connect ${ip}:${port}`);
  console.log(chalk.yellow('To switch back to USB mode, use:'), 'adb usb');
}; 
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import { getNgrokUrl } from '../../ngrok';

export const registerEnvCommand = (program: Command): void => {
  program
    .command('env')
    .description('Update environment variables in a file with the ngrok URL')
    .argument('<file>', 'The file to update')
    .argument('<vars...>', 'Environment variable names to update with ngrok URL')
    .action(async (file, vars, options) => {
      try {
        // Check if file exists
        if (!fs.existsSync(file)) {
          console.log(chalk.red(`File does not exist: ${file}`));
          process.exit(1);
        }

        // Get ngrok URL
        const url = await getNgrokUrl();
        
        console.log(chalk.blue("ngrok url:"), chalk.green(url));
        console.log(chalk.blue(`Updating environment variables in ${file}:`));
        
        // Read file content
        let content = fs.readFileSync(file, 'utf8');
        let updated = false;
        
        // Update each specified environment variable
        for (const varName of vars) {
          console.log(chalk.yellow(`  - ${varName}`));
          
          // Create regex patterns for different env var formats
          const patterns = [
            new RegExp(`(${varName}\\s*=\\s*["']?)([^"'\\s]*)(["\']?)`, 'g'),   // VAR=value, VAR="value", VAR='value'
            new RegExp(`(${varName}:\\s*["']?)([^"'\\s,}]*)(["\']?)`, 'g'),     // VAR: value, VAR: "value", VAR: 'value' (for JSON/YAML)
          ];
          
          let varUpdated = false;
          
          // Try each pattern
          for (const pattern of patterns) {
            if (pattern.test(content)) {
              content = content.replace(pattern, `$1${url}$3`);
              varUpdated = true;
              updated = true;
              break;
            }
          }
          
          if (!varUpdated) {
            console.log(chalk.red(`    Could not find or update ${varName} in the file`));
          }
        }
        
        if (updated) {
          // Write updated content back to file
          fs.writeFileSync(file, content, 'utf8');
          console.log(chalk.green(`✓ Updated environment variables with ngrok URL: ${url}`));
        } else {
          console.log(chalk.red(`No environment variables were updated in ${file}`));
        }
      } catch (error) {
        // Handle the error gracefully
        if (error instanceof Error) {
          console.log(chalk.red(error.message));
        } else {
          console.log(chalk.red('An unknown error occurred'));
        }
        process.exit(1);
      }
    });
}; 
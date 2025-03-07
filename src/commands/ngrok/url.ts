import { Command } from 'commander';
import chalk from 'chalk';
import { getNgrokUrl } from '../../ngrok';
import { writeToClipboard } from '../../utils/clipboard';

export const registerUrlCommand = (program: Command): void => {
  program
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
}; 
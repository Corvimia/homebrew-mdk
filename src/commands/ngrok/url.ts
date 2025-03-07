import { Command } from 'commander';
import chalk from 'chalk';
import { getNgrokUrl } from '../../ngrok';
import { writeToClipboard } from '../../utils/clipboard';

export const registerUrlCommand = (program: Command): void => {
  program
    .command('url')
    .description('Extract URL from current ngrok')
    .action(async () => {
      try {
        const url = await getNgrokUrl();
        console.log(chalk.blue("ngrok url:"), chalk.green(url));
        
        try {
          await writeToClipboard(url);
          console.log(chalk.yellow('✓ URL copied to clipboard'));
        } catch (error) {
          console.log(chalk.red('Failed to copy URL to clipboard'));
        }
      } catch (error) {
        // Handle the error gracefully
        if (error instanceof Error) {
          console.log(chalk.red(error.message));
        } else {
          console.log(chalk.red('An unknown error occurred when trying to get ngrok URL'));
        }
        process.exit(1);
      }
    });
}; 
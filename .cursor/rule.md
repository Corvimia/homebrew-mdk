# Command Execution Rules

## Environment Setup for Commands

When running commands in this project, always follow this procedure:

1. **Use zsh shell**
2. **Load nvm** via source command
3. **Run `nvm use`** to ensure the correct Node.js version (from .nvmrc)
4. **Use `pnpm` for package management**

## Command Pattern

```shell
zsh -c 'source ~/.zshrc && nvm use && pnpm <command>'
```

## Examples

Instead of running:
```
pnpm build
```

Run:
```
zsh -c 'source ~/.zshrc && nvm use && pnpm build'
```

## Common Commands

- Building the project:
  ```
  zsh -c 'source ~/.zshrc && nvm use && pnpm build'
  ```

- Running the bundle script:
  ```
  zsh -c 'source ~/.zshrc && nvm use && pnpm bundle'
  ```

- Installing dependencies:
  ```
  zsh -c 'source ~/.zshrc && nvm use && pnpm install'
  ```

## Why This Is Important

This ensures that:
1. The correct Node.js version is used consistently
2. All package management is done through pnpm
3. The environment is properly configured before commands are executed

Following these rules will prevent environment-related errors and inconsistencies between development environments. 
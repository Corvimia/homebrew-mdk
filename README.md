# mdk
Mia's Dev Kit

## Installation

### Via Homebrew (macOS)

```bash
# Add the tap
brew tap Corvimia/mdk

# Install mdk
brew install mdk
```

## Usage

```bash
# Show available commands
mdk --help

# Check version
mdk version
```

# TODO:
- Github action to do releases
    - triggered on tag
    - runs pnpm i && make package
        - make package needs to create files depending on version
    - create release with the right files
    - update the SHA from mdk.rb && commit
- Figure out how to do version release with homebrew?

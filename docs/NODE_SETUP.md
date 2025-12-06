# Node.js Setup Guide

## Issue: Homebrew Node.js vs NVM Conflict

If you encounter the error:
```
dyld: Library not loaded: /usr/local/opt/simdjson/lib/libsimdjson.26.dylib
```

This means your system is trying to use Homebrew's Node.js (v24.6.0) which has a broken dependency, instead of NVM's Node.js (v18.20.8).

## Solution

### Option 1: Use NVM (Recommended)

1. **Ensure nvm is loaded in your shell:**
   ```bash
   # Add to ~/.zshrc (if using zsh) or ~/.bash_profile (if using bash)
   export NVM_DIR="$HOME/.nvm"
   [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"
   [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"
   ```

2. **Set Node 18 as default:**
   ```bash
   source ~/.nvm/nvm.sh
   nvm use 18
   nvm alias default 18
   ```

3. **Unlink Homebrew Node.js (prevents conflicts):**
   ```bash
   brew unlink node
   ```

4. **Verify:**
   ```bash
   which node  # Should show: /Users/rmartinez/.nvm/versions/node/v18.20.8/bin/node
   node --version  # Should show: v18.20.8
   ```

### Option 2: Fix Homebrew Node.js

If you prefer to use Homebrew Node.js:

```bash
# Reinstall simdjson and Node.js
brew reinstall simdjson
brew reinstall node
```

## Running Tests

After fixing the Node.js issue:

```bash
# Make sure nvm is loaded
source ~/.nvm/nvm.sh

# Run tests
npm test
```

## Troubleshooting

- **If `npm test` still fails, check:**
  ```bash
  which node
  node --version
  ```
  Should show nvm's Node.js, not Homebrew's.

- **If nvm isn't loading automatically:**
  Add the nvm initialization to your shell profile (see Option 1 above).

- **To permanently fix:**
  ```bash
  # Add to ~/.zshrc or ~/.bash_profile
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  ```


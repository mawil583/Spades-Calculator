# Linting Setup and Pre-commit Hooks

## Overview

This project now includes comprehensive linting checks that run automatically before each commit to ensure code quality and consistency.

## What's Included

### ESLint Configuration

- **React App ESLint**: Uses the standard Create React App ESLint configuration
- **File Extensions**: Checks both `.js` and `.jsx` files
- **Auto-fix**: Automatically fixes many common issues
- **Zero Warnings**: Treats warnings as errors - no warnings are permitted

### Pre-commit Hook

The pre-commit hook runs automatically when you commit code and includes:

1. **Lint-staged**: Only lints files that are staged for commit (faster performance)
2. **Tests**: Runs both unit tests and e2e tests if linting passes
3. **Fail-fast**: If linting fails, the commit is blocked

### Lint-staged Configuration

- Automatically fixes linting issues in staged files
- Only processes `.js` and `.jsx` files
- Re-adds fixed files to the staging area

## Available Scripts

### Linting Scripts

```bash
# Lint all source files and auto-fix issues (zero warnings enforced)
npm run lint

# Lint all source files (check only, no auto-fix, zero warnings enforced)
npm run lint:check

# Lint only staged files (used by pre-commit hook, zero warnings enforced)
npm run lint:staged
```

### Testing Scripts

```bash
# Run all tests (unit + e2e)
npm run test

# Run only unit tests
npm run unit

# Run only e2e tests
npm run e2e
```

## How It Works

### Pre-commit Process

1. When you run `git commit`, the pre-commit hook triggers
2. **Lint-staged** runs on only the files you're committing
3. If linting passes, **tests** run
4. If both pass, the commit proceeds
5. If either fails, the commit is blocked

### Example Output

```
🔍 Running lint-staged on changed files...
✅ Linting passed, running tests...
[test output...]
```

## Fixing Linting Issues

### Automatic Fixes

Most linting issues are automatically fixed by the pre-commit hook. If you want to fix them manually:

```bash
# Fix all linting issues in the entire codebase
npm run lint

# Check for issues without fixing them
npm run lint:check
```

### Manual Fixes

If there are issues that can't be auto-fixed:

1. Run `npm run lint:check` to see the issues
2. Fix them manually in your code editor
3. Try committing again

## Common Linting Rules

### React/JSX

- Proper component naming (PascalCase)
- Correct prop types
- Proper hook usage

### JavaScript

- No unused variables
- Proper import/export statements
- Consistent code formatting

### Best Practices

- No console.log in production code
- Proper error handling
- Consistent naming conventions

## Troubleshooting

### Pre-commit Hook Not Running

If the pre-commit hook isn't working:

1. Make sure husky is installed: `npm run prepare`
2. Check that the `.husky/pre-commit` file exists and is executable
3. Verify that lint-staged is installed: `npm list lint-staged`

### Linting Fails

If linting is failing:

1. Check the specific error messages
2. Run `npm run lint` to auto-fix issues
3. Fix any remaining issues manually
4. Try committing again

### Tests Fail

If tests are failing:

1. Run `npm run unit` to see unit test failures
2. Run `npm run e2e` to see e2e test failures
3. Fix the failing tests
4. Try committing again

## Configuration Files

### ESLint Config

Located in `package.json`:

```json
{
  "eslintConfig": {
    "extends": "react-app"
  }
}
```

### Lint-staged Config

Located in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix --max-warnings=0", "git add"]
  }
}
```

### Husky Config

Located in `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged to lint only changed files
echo "🔍 Running lint-staged on changed files..."
npm run lint:staged

# If lint-staged passes, run tests
if [ $? -eq 0 ]; then
  echo "✅ Linting passed, running tests..."
  npm run test
else
  echo "❌ Linting failed. Please fix the issues before committing."
  exit 1
fi
```

## Benefits

1. **Code Quality**: Ensures consistent code style across the project
2. **Bug Prevention**: Catches common issues before they reach production
3. **Team Consistency**: Everyone follows the same coding standards
4. **Automated**: No need to remember to run linting manually
5. **Fast**: Only checks changed files, not the entire codebase
6. **Zero Warnings**: Enforces clean code with no warnings allowed

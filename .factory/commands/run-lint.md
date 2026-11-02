# Command: run-lint

Run ESLint + Prettier checks across the monorepo.

## Commands

```bash
# Lint all projects
nx lint

# Lint a specific project
nx lint web
nx lint api

# Auto-fix lint and formatting issues
nx lint web --fix
nx lint api --fix
```

## Success
No errors reported. Warnings are acceptable but should be noted.
Output ends with:
```
Successfully ran target lint for N projects
```

## On Failure
1. Read the lint error output — it includes file path and rule name
2. Run `nx lint <project> --fix` to auto-fix formatting and auto-fixable lint issues
3. Manually fix any remaining errors (auto-fix cannot resolve all rule violations)
4. Re-run `nx lint <project>`
5. Repeat up to 3 times — if still failing after 3 attempts, stop and report

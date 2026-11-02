# Command: run-build

Build all projects in the monorepo.

## Commands

```bash
# Build all projects
nx build

# Build a specific project
nx build web
nx build api
```

## Success
Build completes with no errors. Output ends with:
```
Successfully ran target build for N projects
```

Compiled output lands in `dist/apps/web/` and `dist/apps/api/`.

## On Failure
1. Read the full error output carefully
2. Identify the file and line number causing the build failure
3. Fix the issue
4. Re-run `nx build <project>`
5. Repeat up to 3 times — if still failing after 3 attempts, stop and report

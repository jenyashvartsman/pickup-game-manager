# Command: run-tests

Run all unit tests across the monorepo.

## Commands

```bash
# Run all tests once (CI mode)
nx run-many --target=test --all --watch=false

# Run tests for a specific project
nx test web --watch=false
nx test api --watch=false
```

## Success
All test suites pass. Output ends with:
```
Successfully ran target test for N projects
```

## On Failure
1. Read the failing spec file(s) identified in the output
2. Read the source file under test
3. Fix the implementation or the test (never delete a failing test)
4. Re-run `nx test <project> --watch=false`
5. Repeat up to 3 times — if still failing after 3 attempts, stop and report

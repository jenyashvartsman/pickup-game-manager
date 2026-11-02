# Command: log-progress

Append one line to `.factory/logs/factory.log`:

```
[YYYY-MM-DD] TASK-NNN | STATUS: done | <one-line summary of what was built>
```

Then update `.factory/status.md`:
1. Move the current task row from **Pending Tasks** to **Completed Tasks** — add today's date in the Date column
2. Advance **Current Task** to the next task number in the Pending Tasks table (or write "All tasks complete" if none remain)
3. Update **Last Note** with a one-line description of what was just completed

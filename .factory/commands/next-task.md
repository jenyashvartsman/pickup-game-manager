# Command: next-task

Read `.factory/status.md` and identify the current task number from the Pending Tasks table.
Read `.factory/tasks/task-NNN.md` for that task.
Read every doc listed in the task's Context section.

Present this brief:

---
**Task NNN — [Title]**
**Objective:** [one paragraph from task file]
**Docs consulted:** [list]
**Files in scope:**
| Action | File |
|--------|------|
| ...    | ...  |

**Acceptance criteria:**
- [ ] ...

**Dependencies:** [task numbers or "none"]
---

Then ask: "Ready to implement — shall I begin?"

On confirmation, execute the task execution cycle:

1. Write all code per the Scope table
2. Run `nx test <project> --watch=false` — fix failures — rerun — must be green
3. Run `nx build <project>` — must succeed
4. Run `nx lint <project>` — must pass
5. Append to `.factory/logs/factory.log`:
   `[YYYY-MM-DD] TASK-NNN | STATUS: done | <one-line summary>`
6. Update `.factory/status.md`:
   - Move task row from Pending Tasks to Completed Tasks (add today's date)
   - Update Current Task to the next pending task number
   - Update Last Note

Loop limit: If fix → retest repeats more than 3 times on the same failure, stop.
Report: what failed, what was attempted, why it is not resolving. Never loop silently.

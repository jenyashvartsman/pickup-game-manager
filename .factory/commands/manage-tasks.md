# Command: manage-tasks

Invoked as:
- `manage-tasks add [title]`
- `manage-tasks delete NNN`
- `manage-tasks modify NNN`

---

## add

Ask the developer for:
1. Objective (one paragraph)
2. Relevant docs to read (check against `.factory/docs/` contents)
3. Scope — files to create or modify (Action + File table)
4. Acceptance criteria (list; always include "Unit tests pass" and "Build succeeds")
5. Dependencies (task numbers or "none")
6. Queue position — after which existing pending task should this be inserted?

Then:
- Determine the next available NNN by reading the highest-numbered file in `.factory/tasks/`
- Write `.factory/tasks/task-NNN.md` using the task-TEMPLATE.md structure, fully populated
- Add a row to the **Pending Tasks** table in `.factory/status.md` at the requested queue position

---

## delete NNN

- Read `.factory/tasks/task-NNN.md` and display its title and objective
- Ask: "Confirm delete task NNN — [Title]? This cannot be undone."
- On confirmation:
  - Delete the file
  - Remove its row from **Pending Tasks** in `.factory/status.md`
- Refuse if the task appears in the **Completed Tasks** table

---

## modify NNN

- Read `.factory/tasks/task-NNN.md` and display its current content
- Ask: "Which sections do you want to change? (Objective / Context / Scope / Acceptance Criteria / Dependencies / Notes)"
- Apply only the requested changes to the file
- If the title changed, update the row in `.factory/status.md` Pending Tasks to match

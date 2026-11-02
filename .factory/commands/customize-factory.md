# Command: customize-factory

Before making any change, read `.factory/FACTORY.md` File Organization to enforce naming conventions and correct file placement.

Handles four categories:

---

## doc

Add, update, or remove a factory doc.

**add:**
- Ask for: filename (kebab-case.md), purpose, which tasks will reference it
- Write the file to `.factory/docs/`
- Add a row to the Active Docs table in `CLAUDE.md`
- Add a checkbox line to the Context section in `.factory/tasks/task-TEMPLATE.md`
- Add the file to the Directory Tree in `.factory/FACTORY.md`

**update:**
- Ask which doc to update and what changes to make
- Apply changes to the doc file only

**remove:**
- Read the doc, display its contents, confirm deletion
- Delete the file
- Remove its row from Active Docs in `CLAUDE.md`
- Remove its checkbox from task-TEMPLATE.md Context section
- Remove it from the Directory Tree in `FACTORY.md`

---

## rule

Change a factory-wide rule.

Supported rules:
- Loop limit (currently: 3 failed fix attempts)
- Domain naming convention
- Task execution cycle steps

Apply the change to both `CLAUDE.md` (Task Execution Cycle / Loop limit section) and `.factory/FACTORY.md` (Task Execution Cycle section).

---

## autonomy

Add or remove commands the AI may run without asking for approval.

- **add:** Ask for the command and when to use it. Add a row to the appropriate table in `CLAUDE.md` AI Autonomy section.
- **remove:** Display current autonomy list. Remove the specified row from `CLAUDE.md`.
- **approval:** Add or remove an item from the "Requires Developer Approval" list in `CLAUDE.md`.

---

## command

Add a new slash command or update an existing one.

**add:**
- Ask for: filename (verb-noun.md), purpose, steps the command should perform
- Write the file to `.factory/commands/`
- Add the file to the Directory Tree in `.factory/FACTORY.md`

**update:**
- Ask which command file to update and what to change
- Apply changes to the command file only

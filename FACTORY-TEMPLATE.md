# AI Factory Setup — Interactive Guide

> Drop this file into any new project root and paste its contents into your AI assistant (Claude Code, Cursor, Aider, Windsurf, or any AI with file-write access).
> The AI will interview you phase by phase and write every factory file to disk.

---

## AI INSTRUCTIONS

You are a **factory setup assistant**. Your job is to guide the developer through setting up the AI Factory Method for a new project by asking questions and generating all factory files directly to disk.

### Rules

1. **Phases are sequential.** Run Phase 0 through Phase 9 in order. Never generate a later phase's files before the current phase is answered.
2. **Ask, then generate.** Present each phase's questions as a numbered list. Wait for the developer's answers before writing any files.
3. **Confirm after each phase.** After writing files, report exactly what was written, then ask: "Ready to continue to Phase N — [Name]?"
4. **Handle skips gracefully.** If the developer says "skip", "default", or "not sure", choose a sensible default, document it in the file under `## Open Questions`, and continue.
5. **Write complete files.** Populate every section of every template with the developer's actual answers. Do not leave placeholder text unfilled.
6. **Create directories as needed** before writing files.
7. **End with a summary.** After Phase 9, output a table of every file generated.

### Context File Name by Tool

| Tool | Context file name |
|------|-------------------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurfrules` |
| Aider | `CONVENTIONS.md` |
| Other / Unknown | `PROJECT-CONTEXT.md` |

### How to Begin

Start your response with exactly this introduction, then immediately ask the Phase 0 questions — do not wait for the developer to prompt you further:

> "I'm your factory setup assistant. I'll guide you through the AI Factory Method setup by asking questions phase by phase and writing every factory file to disk as we go.
>
> **Phase 0 — Bootstrap.** Three quick questions to get started:"

---

## PHASE 0 — Bootstrap

### Questions to ask

1. What is the name of your project?
2. Which AI tool are you using? *(Claude Code / Cursor / GitHub Copilot / Windsurf / Aider / Other)*
3. What is the project root path? *(press Enter or type `.` to use the current directory)*

### After answering — create the scaffold

Run this in a shell (or equivalent for the current platform):

```
mkdir -p .factory/docs .factory/tasks .factory/commands .factory/logs .factory/ux
```

Then write these files:

**`.factory/logs/factory.log`**
```
# Factory Log — {project_name}
# Format: [YYYY-MM-DD] TASK-NNN | STATUS: done/skipped/blocked | <summary>
# This file is append-only. Do not edit existing entries.

[{today}] FACTORY-INIT | STATUS: done | Project scaffold created — docs, tasks, commands stub, log, status
```

**`.factory/status.md`**
```
# Status — {project_name}

## Current Phase
`BOOTSTRAP` → `FILL DOCS` → `DISCOVERY` → `COMMANDS` → `TASKS` → `EXECUTE` → `EXTRACT`

Current: **FILL DOCS**

## Current Task
_None yet — complete docs and discovery (Phases 1–7) before generating tasks._

## Factory Phase (execution)
`INIT` → `SCAFFOLD` → `CORE` → `FEATURES` → `POLISH`

## Completed Tasks

| Task | Title | Date |
|------|-------|------|
| FACTORY-INIT | Project scaffold created | {today} |

## Pending Tasks

| Task | Title | Phase |
|------|-------|-------|

## Blockers
_None_

## Last Note
Factory scaffold created. Completing docs now.
```

**`.factory/tasks/task-TEMPLATE.md`**
```
# Task NNN — <Title>

> Copy this file, rename to task-NNN.md, fill in all sections. Delete this line.

## Objective
_What needs to be built or changed. One clear paragraph._

## Context
_Which docs are relevant to this task._

- [ ] Read .factory/docs/app.md — always; domain model and feature scope live here
- [ ] Read .factory/docs/architecture.md — if this task touches structure or stack
- [ ] Read .factory/docs/frontend.md — if this task touches client code
- [ ] Read .factory/docs/backend.md — if this task touches server code
- [ ] Read .factory/docs/database.md — if this task touches schema or queries
- [ ] Read .factory/docs/ux.md — if this task touches UI or interaction
- [ ] Check .factory/ux/ for reference assets — if this task touches UI

## Scope

| Action | File |
|--------|------|
| Create | path/to/file.ts |
| Modify | path/to/other.ts |

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
_Tasks that must be complete before this one starts._

## Notes
_Fill in after execution: decisions made, issues encountered, anything deferred._
```

**`.factory/FACTORY.md`**
```
# AI Factory — {project_name}

## What Is the AI Factory Method?
A structured way to build software with AI assistance:
- Docs keep the AI and developer on the same context at all times
- Commands are generated from the stack — real commands, not placeholders
- Tasks are atomic, testable units — no task starts until the previous is verified
- Logs create a traceable history of every factory order

---

## File Organization

### Directory Tree

  <project-root>/
  ├── {context_file}               ← AI context file — auto-loaded every session
  ├── status.md                    ← current project state dashboard
  └── .factory/
      ├── FACTORY.md               ← this file; factory process and structure reference
      ├── docs/                    ← living design documents (read before coding)
      │   ├── app.md               ← product vision — read first
      │   ├── architecture.md      ← stack and infrastructure decisions
      │   ├── ux.md                ← design language, screens, libraries
      │   ├── frontend.md          ← frontend conventions and folder structure
      │   ├── backend.md           ← backend conventions and layer architecture
      │   └── database.md          ← schema, migrations, delete strategy
      ├── tasks/                   ← numbered task files
      │   ├── task-TEMPLATE.md     ← blank schema; copy for every new task
      │   └── task-NNN.md          ← NNN = zero-padded 3-digit number (001, 002, ...)
      ├── commands/                ← slash command prompts — auto-discovered by AI tool
      │   ├── next-task.md
      │   ├── log-progress.md
      │   ├── manage-tasks.md
      │   ├── customize-factory.md
      │   └── extract-template.md
      ├── ux/                      ← reference assets for the UX phase (optional)
      └── logs/
          └── factory.log          ← append-only order log

### Naming Conventions

  Docs      → kebab-case.md — one concern per file (security.md, deployment.md)
  Tasks     → task-NNN.md  — number only, zero-padded 3 digits; title lives inside the file
  Commands  → verb-noun.md — action-first, kebab-case (run-tests.md, review-pr.md)
  Logs      → factory.log only — never create additional log files

### Rules for Adding New Files

  Docs     — go in .factory/docs/; register in context file Active Docs + task-TEMPLATE.md Context checklist + FACTORY.md Directory Tree
  Tasks    — go in .factory/tasks/; register in status.md Pending Tasks
  Commands — go in .factory/commands/; auto-discovered, no registration required; update FACTORY.md Directory Tree
  Logs     — all entries go in .factory/logs/factory.log (append-only)
  Root     — only the context file and status.md live here; never add files to root

---

## Factory Phases

  Phase 0 — Bootstrap    → scaffold dirs, stub files, factory.log
  Phase 1 — App Design   → fill app.md (product vision, domain, features)
  Phase 2 — Architecture → fill architecture.md (stack, monorepo, infra)
  Phase 3 — UX           → fill ux.md (design language, components, screens)
  Phase 4 — Frontend     → fill frontend.md (structure, conventions, state)
  Phase 5 — Backend      → fill backend.md (structure, layers, services)
  Phase 6 — Database     → fill database.md (schema, migrations, seeds)
  Phase 7 — Discovery    → lock scope decisions, record in factory.log
  Phase 8 — Commands     → generate context file + stack-specific commands
  Phase 9 — Tasks        → generate numbered task list from completed docs

---

## Task Execution Cycle (mandatory for every task)

  1. Read .factory/status.md          — identify the current task
  2. Read .factory/tasks/task-NNN.md  — load objective, scope, criteria
  3. Read every doc in the task's Context section
  4. Write all code
  5. Run tests   — fix — run tests again — must be green
  6. Run build   — must succeed
  7. Run lint    — must pass
  8. Run log-progress command — append factory.log + advance status.md

Loop limit: Stop after 3 failed fix attempts. Escalate — never loop silently.

---

## Factory Log Format

.factory/logs/factory.log is append-only:

  [YYYY-MM-DD] TASK-NNN | STATUS: done    | <summary>
  [YYYY-MM-DD] TASK-NNN | STATUS: skipped | <reason>
  [YYYY-MM-DD] TASK-NNN | STATUS: blocked | <blocker>
```

### Phase 0 completion message

> "Phase 0 complete. Scaffold created — 5 files written to `.factory/`.
>
> Ready to continue to **Phase 1 — App Design**?"

---

## PHASE 1 — App Design (`app.md`)

> This is the most important doc. All architecture, UX, and task generation decisions depend on it. Take your time here.

### Questions to ask

Present all questions at once as a numbered list. The developer can answer in sequence.

1. **Vision** — In one paragraph: what is this product, who is it for, and why does it exist? Be specific. *"A task manager" is not a vision. "A Kanban board for solo developers who need to ship side projects without context-switching overhead" is.*

2. **Target user** — Who is the primary user (role, context, technical level)? What are they trying to accomplish? What do they currently do without this app?

3. **Problem statement** — What specific friction or gap does this product remove? Describe the "before" and "after."

4. **Core user journey** — Walk through the primary flow in 4–8 steps. What does the user see first? What do they do? What happens next? What do they achieve?

5. **Domain model** — What are the main concepts in this domain and how do they relate? Write in plain language. *(e.g., "A Project has many Tasks. A Task belongs to one Project and can have many Comments.")*

6. **Core features (v1)** — What features must exist for the app to be minimally useful? Write each as a user-facing capability. *(e.g., "User can create a project", "System sends notification when task is overdue")*

7. **Out of scope (v1)** — What is explicitly NOT being built in v1? Name it clearly to prevent scope creep.

8. **Success criteria** — How will you know the product works? What can the user accomplish without reading documentation?

9. **Constraints** — Answer each of these:
   - Single user or multi-user?
   - Auth required?
   - Online only or offline capable?
   - Desktop, mobile, or both?
   - Real-time simulation, event-driven, or CRUD-only?
   - Persistent data or ephemeral?

### File to generate

Write `.factory/docs/app.md` — fully populated with the developer's answers:

```
# App Design — {project_name}

## Vision
{vision_answer}

## Target User
{target_user_answer}

## Problem Statement
{problem_statement_answer}

## Core User Journey
{journey_as_numbered_steps}

## Domain Model
{domain_model_in_plain_language}

## Core Features (v1)
{features_as_numbered_list}

## Out of Scope (v1)
{out_of_scope_list}

## Success Criteria
{success_criteria_list}

## Constraints

| Constraint | Decision |
|-----------|---------|
| Single user or multi-user? | {answer} |
| Auth required? | {answer} |
| Online only or offline capable? | {answer} |
| Desktop, mobile, or both? | {answer} |
| Real-time, event-driven, or CRUD-only? | {answer} |
| Persistent data or ephemeral? | {answer} |

## Open Questions
{any_decisions_deferred_to_later_phases_as_checkboxes}
```

### Phase 1 completion message

> "Phase 1 complete. `.factory/docs/app.md` written.
>
> Ready to continue to **Phase 2 — Architecture**?"

---

## PHASE 2 — Architecture (`architecture.md`)

### Questions to ask

1. What are the main moving parts of the system? *(e.g., React frontend, Node API, PostgreSQL database, Redis cache)*
2. Monorepo or separate repos? If monorepo, which tool? *(Nx / Turborepo / pnpm workspaces / other)*
3. Frontend framework? *(React / Vue / Svelte / Next.js / Angular / other)*
4. Backend runtime and framework? *(Node/Express / Node/Fastify / Python/FastAPI / Ruby/Rails / other)*
5. API style? *(REST / GraphQL / tRPC / other)*
6. Database? *(PostgreSQL / MySQL / SQLite / MongoDB / other)*
7. ORM or query builder? *(Drizzle / Prisma / SQLAlchemy / ActiveRecord / none / other)*
8. Auth strategy? *(JWT / sessions / OAuth / none)*
9. Real-time strategy? *(WebSocket / SSE / polling / none)*
10. Docker for local development? *(yes / no — if yes, where is the compose file?)*
11. Code style enforcement? *(ESLint / Biome / Prettier / Ruff / other / none)*

### File to generate

Write `.factory/docs/architecture.md`:

```
# Architecture — {project_name}

## System Overview
{describe_main_moving_parts}

## Stack Decisions

| Decision | Choice | Notes |
|----------|--------|-------|
| Repository structure | {monorepo_or_polyrepo} | {tool_if_monorepo} |
| Frontend framework | {frontend_framework} | |
| Backend runtime + framework | {backend_runtime_framework} | |
| API style | {api_style} | |
| Database | {database} | |
| ORM / query builder | {orm} | |
| Auth strategy | {auth} | |
| Real-time strategy | {realtime} | |
| Docker (local dev) | {yes_or_no} | {compose_file_path_if_yes} |
| Code style enforcement | {linting_tool} | |

## Project Structure
{top_level_directory_layout_based_on_answers}

## Open Questions
{deferred_decisions_as_checkboxes}
```

### Phase 2 completion message

> "Phase 2 complete. `.factory/docs/architecture.md` written.
>
> Ready to continue to **Phase 3 — UX**?"

---

## PHASE 3 — UX (`ux.md`)

### Before asking questions — check for references

List the contents of `.factory/ux/`. The developer may have placed reference materials there: screenshots, mockups, color palettes, font specimens, code snippets, or a plain text file of links.

- **If files are found:** Read or analyze every file. Summarize what you found *(e.g., "I found 3 screenshots and a links.md — I'll use these as the basis for the UX doc.")*. Use them to pre-fill as many answers as possible, then ask only the questions that the references do not already answer.
- **If the folder is empty:** Tell the developer *(e.g., "No references found in `.factory/ux/` — I'll ask all questions and we'll define the UX from scratch.")*, then ask all questions below.

> **Tip for the developer:** You can place anything in `.factory/ux/` before running this phase — Figma export screenshots, an `inspiration.md` with links, a `palette.css`, a competitor screenshot, or nothing at all. The AI will work with whatever is there.

### Questions to ask

*(Skip any question already answered by the references.)*

1. What is the visual metaphor or design language? *(e.g., "dark sci-fi dashboard", "clean minimal productivity tool", "retro terminal aesthetic")*
2. Dark theme, light theme, or both?
3. Desktop-first, mobile-first, or fully responsive?
4. UI component library? *(shadcn/ui / Ant Design / MUI / Radix / none / other)*
5. Animation library? *(Framer Motion / GSAP / CSS-only / none / other)*
6. Data visualization? *(D3 / Recharts / Chart.js / none / other)*
7. What are the core screens or pages? *(list them with a one-line description of each)*

### File to generate

Write `.factory/docs/ux.md`:

```
# UX Design — {project_name}

## Design Language
{design_language_answer}

## Theme
{theme_answer}

## Responsive Strategy
{responsive_strategy_answer}

## Libraries

| Concern | Choice |
|---------|--------|
| UI components | {component_library} |
| Animation | {animation_library} |
| Data visualization | {dataviz_library} |

## Core Screens

{screens_as_numbered_list_with_one_line_description_each}

## Color & Typography
_To be defined during the scaffold task._

## References
{if_files_were_found_in_.factory/ux/_list_them_here_with_a_one_line_description_of_each_otherwise_write_"None — UX defined from scratch."}

## Open Questions
{deferred_decisions_as_checkboxes}
```

### Phase 3 completion message

> "Phase 3 complete. `.factory/docs/ux.md` written.
>
> Ready to continue to **Phase 4 — Frontend**?"

---

## PHASE 4 — Frontend (`frontend.md`)

### Questions to ask

1. Sketch the top-level folder structure for the frontend. *(e.g., `src/domains/`, `src/pages/`, `src/shared/`)*
2. File naming convention? *(PascalCase for components, camelCase for hooks, kebab-case for utils, etc.)*
3. How are domain boundaries drawn? *(one folder per domain entity, one per feature page, other)*
4. State management approach? *(Zustand / Redux Toolkit / React Context / Jotai / none / other)*
5. How are API calls made? *(React Query / SWR / custom fetch hooks / Axios / other)*
6. Where do test files live? *(co-located next to source files / `__tests__` subfolder / separate `tests/` directory)*
7. CSS methodology? *(Tailwind / CSS Modules / styled-components / BEM / other)*

### File to generate

Write `.factory/docs/frontend.md`:

```
# Frontend — {project_name}

## Folder Structure
{folder_structure_sketch}

## File Naming Conventions
{naming_conventions_answer}

## Domain Boundaries
{domain_boundary_strategy}

## State Management
{state_management_approach}

## API Layer
{api_layer_approach}

## Test Co-location
{test_colocation_strategy}

## CSS Methodology
{css_methodology}

## Open Questions
{deferred_decisions_as_checkboxes}
```

### Phase 4 completion message

> "Phase 4 complete. `.factory/docs/frontend.md` written.
>
> Ready to continue to **Phase 5 — Backend**?"

---

## PHASE 5 — Backend (`backend.md`)

### Questions to ask

1. Sketch the top-level folder structure for the backend. *(e.g., `src/domains/`, `src/middleware/`, `src/shared/`)*
2. Do you use a router / service / repository layer split? Describe how business logic flows through the layers.
3. Validation library? *(Zod / Joi / class-validator / Pydantic / none / other)*
4. Error handling strategy? *(centralized error middleware / per-route try/catch / other)*
5. How is the database connection imported? *(shared module / direct import per file / singleton / other)*
6. Is there a simulation engine, background job runner, or tick loop? If yes, where does it live?
7. Seeder strategy? *(destructive drop + migrate + seed / upsert / fixture files / none)*

### File to generate

Write `.factory/docs/backend.md`:

```
# Backend — {project_name}

## Folder Structure
{folder_structure_sketch}

## Layer Architecture
{router_service_repo_description}

## Validation
{validation_library_and_pattern}

## Error Handling
{error_handling_strategy}

## Database Connection
{db_connection_import_pattern}

## Simulation / Background Jobs
{simulation_engine_description_or_none}

## Seeder Strategy
{seeder_strategy}

## Open Questions
{deferred_decisions_as_checkboxes}
```

### Phase 5 completion message

> "Phase 5 complete. `.factory/docs/backend.md` written.
>
> Ready to continue to **Phase 6 — Database**?"

---

## PHASE 6 — Database (`database.md`)

### Questions to ask

1. List all entities and their relationships. *(e.g., "User has many Projects. Project has many Tasks. Task belongs to Project and to User.")*
2. Migration strategy? *(Drizzle Kit / Prisma Migrate / Alembic / Rails migrations / manual SQL / other)*
3. Soft deletes or hard deletes?
4. Do you need an audit trail or event log table separate from normal data?
5. Primary key type? *(UUID / serial integer / CUID / other)*
6. Any JSONB or JSON columns for flexible or unstructured payloads?

### File to generate

Write `.factory/docs/database.md`:

```
# Database — {project_name}

## Entity List

{entities_and_relationships_as_plain_language_list}

## Schema Overview

{table_by_table_description_with_key_columns_and_foreign_keys}

## Migration Strategy
{migration_strategy}

## Delete Strategy
{soft_or_hard_delete}

## Audit Trail
{audit_trail_description_or_none}

## Primary Keys
{pk_type}

## JSON Columns
{json_columns_description_or_none}

## Open Questions
{deferred_decisions_as_checkboxes}
```

### Phase 6 completion message

> "Phase 6 complete. `.factory/docs/database.md` written.
>
> Ready to continue to **Phase 7 — Discovery**?"

---

## PHASE 7 — Discovery

> These four questions lock the project scope before commands or tasks are generated. Answering them prevents auth pivots, schema redesigns, and architectural surprises mid-project.

### Questions to ask

1. **User/session model** — Single user (no login needed), multi-user (accounts required), or no-auth (anyone can use, no accounts)?

2. **Data model scope** — Single record per session (one active state per user), multiple saves per user (named saves or history), or multi-tenant (many organizations with isolated data)?

3. **Interaction model** — Real-time server tick (auto-updates on a timer), turn-based (user triggers each update), event-driven (webhooks or queues), or CRUD-only (no live updates)?

4. **Persistence scope** — Cloud-hosted database, local SQLite file, or ephemeral (in-memory, resets on restart)?

### After answering

Append this line to `.factory/logs/factory.log`:
```
[{today}] FACTORY-DISCOVERY | STATUS: done | User: {answer_1} | Data: {answer_2} | Interaction: {answer_3} | Persistence: {answer_4}
```

Update `.factory/status.md`:
- Change `Current: **FILL DOCS**` to `Current: **COMMANDS**`
- Update the Last Note field

### Phase 7 completion message

> "Phase 7 complete. Discovery answers recorded in `factory.log`.
>
> Ready to continue to **Phase 8 — Commands**? *(No questions this phase — I'll read all the docs and generate the command files automatically.)*"

---

## PHASE 8 — Commands

> No questions. Read all completed docs and generate every command and context file.

### Instructions for the AI

1. Read all six files in `.factory/docs/`
2. Read `.factory/logs/factory.log` for the discovery answers
3. Use the context file name for the tool identified in Phase 0
4. Generate every file below using real commands from `architecture.md` — no placeholders anywhere

### Files to generate

**1. The context file** (name from the tool table above — e.g., `CLAUDE.md`)

Fully populate every section:

```
# {project_name} — Project Context

This file is loaded by your AI assistant each session.

## Project
{one_paragraph_from_app.md_vision_and_target_user}

## AI Factory Method
This project uses the AI Factory Method:
- Docs define context and decisions (.factory/docs/)
- Tasks are numbered, discrete, testable units (.factory/tasks/)
- A factory log tracks every completed order (.factory/logs/factory.log)
- Commands automate repetitive factory operations (.factory/commands/)

## Active Docs

| Domain | File |
|--------|------|
| Product | .factory/docs/app.md — read first |
| Architecture | .factory/docs/architecture.md |
| UX | .factory/docs/ux.md |
| Frontend | .factory/docs/frontend.md |
| Backend | .factory/docs/backend.md |
| Database | .factory/docs/database.md |

## Core Development Rule — Domain-Focused Code

All code must be named after domain concepts from app.md:
{list_domain_entities_from_app.md_domain_model}

No generic names: no DataService, ItemList, handleSubmit, processData.
Business logic lives in domain services, not in route handlers or components.
This rule applies from task 001 onwards and is never relaxed.

## AI Autonomy

The AI may execute the following without asking for approval:

### Test & Build
| Command | When to use |
|---------|------------|
{populate_with_real_test_and_build_commands_from_architecture.md}

### Infrastructure (if Docker is in the stack)
{populate_with_real_docker_commands_and_compose_file_path}

### File Operations
Read and write any file within the workspace: source code, docs, task files, status.md, factory.log.

### Requires Developer Approval
- Installing or removing packages
- Destructive git operations (reset --hard, force push, branch delete)
- Running seed scripts against a non-empty database
- Any command not listed above

## Task Rules
- Tasks live in .factory/tasks/task-NNN.md
- Execute one task at a time
- Do not start a task without reading its file
- Mark completion in status.md and append factory.log

## Task Execution Cycle

  1. Write code
  2. Run unit tests
  3. Review output — fix any failures
  4. Run tests again — must be green
  5. Run build — must succeed

A task is not complete until tests are green AND the build passes.

Loop limit: If fix → retest repeats more than 3 times without resolving, stop immediately.
Report what failed, what was tried, and why it is not resolving. Never loop silently.

## Factory Log Rule
Every completed task must produce a log entry:
  [YYYY-MM-DD] TASK-NNN | STATUS: done | <one-line summary>

## Status Dashboard
Current state: status.md
```

**2. `.factory/commands/next-task.md`**

A command prompt that:
- Reads `.factory/status.md` to identify the current task number
- Reads `.factory/tasks/task-NNN.md` for that task
- Reads every doc listed in the task's Context section
- Presents a structured brief: task number, objective, files in scope, acceptance criteria, docs consulted
- Asks "Ready to implement — shall I begin?"
- On confirmation: writes code → runs tests using the actual commands from `architecture.md` → fixes up to 3 times → runs build → runs lint → appends `factory.log` → updates `status.md`

All test, build, and lint references must use the real commands from `architecture.md`, not generic placeholders.

**3. `.factory/commands/log-progress.md`**

A command prompt that:
- Appends one line to `.factory/logs/factory.log` in this format: `[YYYY-MM-DD] TASK-NNN | STATUS: done | <summary>`
- Updates `.factory/status.md`: advances current task number, moves task row to Completed table, removes from Pending table, updates Last Note

**4. `.factory/commands/manage-tasks.md`**

A command prompt that adds, deletes, or modifies tasks during development. Invoked as `manage-tasks add [title]`, `manage-tasks delete NNN`, or `manage-tasks modify NNN`.

- **add** — asks for objective, relevant docs, scope, acceptance criteria, dependencies, and queue position; creates the task file; adds it to `status.md` Pending Tasks
- **delete** — reads the task, confirms, deletes the file, removes the row from `status.md` Pending Tasks; refuses to delete completed tasks
- **modify** — reads the task, shows current content, asks which sections to change, applies only those changes; updates `status.md` if the title changed

**5. `.factory/commands/customize-factory.md`**

A command prompt that modifies the factory itself during development. Before making any change it reads `.factory/FACTORY.md` File Organization to enforce naming conventions and correct file placement. Handles four categories:

- **doc** — add, update, or remove a factory doc; propagates to the Active Docs table in the context file, the Context checklist in `task-TEMPLATE.md`, and the Directory Tree in `FACTORY.md`
- **rule** — change factory-wide rules: loop limit, domain naming convention, task execution cycle steps; mirrors changes across `FACTORY.md`
- **autonomy** — add or remove commands the AI may run without asking; manage the "requires approval" list
- **command** — add a new slash command or update an existing one; updates the Directory Tree in `FACTORY.md`

**6. `.factory/commands/extract-template.md`**

A command prompt that reads `.factory/FACTORY.md`, the context file, `factory.log`, all six docs, and all task files, then generates a new `FACTORY-TEMPLATE.md` in the project root — stripped of all app-specific content, preserving any process lessons found in `factory.log` as appendix notes.

**6. Stack-specific commands** — generate only what the stack in `architecture.md` requires:

| Command file | Generate when |
|-------------|--------------|
| `.factory/commands/run-tests.md` | Always |
| `.factory/commands/run-build.md` | Always |
| `.factory/commands/run-lint.md` | A linting tool is configured |
| `.factory/commands/db-migrate.md` | A migration tool is in the stack |
| `.factory/commands/db-seed.md` | A seed strategy is defined |
| `.factory/commands/db-reset.md` | A destructive drop + migrate + seed workflow is described |
| `.factory/commands/docker-start.md` | Docker is used for local development |
| `.factory/commands/docker-logs.md` | Docker is used for local development |

Each command file must contain:
- The exact CLI invocation with real paths and flags — no placeholders
- What "success" looks like (expected output)
- What to do if it fails

### After generating Phase 8 files

Update `.factory/status.md`:
- Change `Current: **COMMANDS**` to `Current: **TASKS**`
- Update Last Note

### Phase 8 completion message

> "Phase 8 complete. Context file and {N} command files written.
>
> Ready to continue to **Phase 9 — Tasks**? *(No questions — I'll read the docs and generate all task files automatically.)*"

---

## PHASE 9 — Tasks

> No questions. Read all completed docs and generate the full numbered task list.

### Instructions for the AI

1. Read `.factory/docs/app.md` first — the Core Features list drives which tasks must exist
2. Read all remaining docs in `.factory/docs/`
3. Read the discovery answers from `.factory/logs/factory.log`
4. Apply every rule below when generating the task list

### Task generation rules

- Every feature in `app.md` Core Features must have at least one task
- Order tasks by dependency: infrastructure → data layer → backend API → frontend shell → feature pages → polish
- Each task must be completable and testable in a single session
- No task should mix more than one major concern — do not combine schema + API, or API + frontend page, in one task
- Every task must include "unit tests pass" and "build succeeds" as acceptance criteria
- Name tasks after domain concepts from `app.md`, not technical layers *(e.g., "Crew Assignment API", not "REST Endpoints")*
- Do not generate tasks for anything listed in `app.md` Out of Scope

### Typical task order for a full-stack web app

| Execution phase | Category | Example tasks |
|-----------------|----------|---------------|
| SCAFFOLD | Infrastructure | Monorepo init, Docker setup, env config |
| SCAFFOLD | Data layer | DB schema migration, seed fixtures |
| CORE | Backend | API foundation, one endpoint group per domain entity |
| CORE | Frontend | App shell, routing, design tokens, shared layout |
| FEATURES | Pages | One task per core screen in `ux.md` |
| FEATURES | State & data | Stores, service layer, data-fetching hooks |
| POLISH | Motion | Page transitions, entrance animations, skeleton states |
| POLISH | Visual | Icons, copy pass, empty states, error states |
| POLISH | Production | Error boundaries, lazy loading, README |

### File structure for each task

Write `.factory/tasks/task-NNN.md` for every task:

```
# Task {NNN} — {title}

## Objective
{one_paragraph_describing_what_to_build_or_change}

## Context

- [ ] Read .factory/docs/app.md
{additional_relevant_docs_for_this_task}

## Scope

| Action | File |
|--------|------|
{files_to_create_or_modify}

## Acceptance Criteria

- [ ] {criterion_1}
- [ ] {criterion_2}
- [ ] Unit tests pass
- [ ] Build succeeds

## Dependencies
{prerequisite_task_numbers_or_none}

## Notes
_Fill in after execution._
```

### After generating all task files

Update `.factory/status.md`:
- Change `Current: **TASKS**` to `Current: **EXECUTE**`
- Populate the Pending Tasks table with every generated task
- Update Last Note

Append to `.factory/logs/factory.log`:
```
[{today}] FACTORY-TASKS | STATUS: done | Generated {N} tasks — ready to execute
```

---

## COMPLETION

After Phase 9, output this summary (filled in with actual values):

```
## Factory Setup Complete

### Files Generated

| File | Description |
|------|-------------|
| .factory/logs/factory.log | Append-only order log, discovery answers recorded |
| .factory/status.md | Project state dashboard |
| .factory/FACTORY.md | Factory process reference |
| .factory/tasks/task-TEMPLATE.md | Blank task schema |
| .factory/docs/app.md | Product vision, domain model, feature scope |
| .factory/docs/architecture.md | Stack and infrastructure decisions |
| .factory/docs/ux.md | Design language and core screens |
| .factory/docs/frontend.md | Frontend conventions and folder structure |
| .factory/docs/backend.md | Backend conventions and layer architecture |
| .factory/docs/database.md | Schema, migrations, delete strategy |
| {context_file} | AI context file (auto-loaded every session) |
| .factory/commands/next-task.md | Execute the next task |
| .factory/commands/log-progress.md | Log a completed task |
| .factory/commands/extract-template.md | Extract reusable template at project end |
{additional_stack_commands_rows}
{task_files_summary_row}

### Next Step

Use the next-task command (or paste .factory/commands/next-task.md into your AI)
to begin executing Task 001.
```

---

## Appendix — Process Notes

These lessons were captured from real factory runs. The AI should read them before generating tasks in Phase 9.

### PROCESS NOTE 1 — Discovery before task generation

Answering the four discovery questions (Phase 7) before generating tasks (Phase 9) prevents auth tasks from appearing mid-project, prevents schema redesigns after the API is built, and prevents polling/WebSocket architectural pivots after the frontend is wired. The four questions are the minimum viable discovery set — do not skip Phase 7.

### PROCESS NOTE 2 — Task execution cycle and loop limit

The task execution cycle must be enforced in both the AI context file (read every session) and `.factory/FACTORY.md` (human reference). Having it in only one place causes it to be missed. The loop limit — stop after 3 failed fix attempts and escalate — is not a suggestion. Silent looping is the most common failure mode in AI-assisted development.

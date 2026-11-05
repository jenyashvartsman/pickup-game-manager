# FACTORY-TEMPLATE Improvement Notes

---

## [2026-11-05] Commands → Skills, /factory-* prefix, agent-agnostic

**Problem:** The template generates `.factory/commands/*.md` files described as "command prompts." In Claude Code these are actually skills (slash commands), and the template does not enforce a consistent naming prefix. The old location was also Claude Code-specific, breaking portability to Cursor, Windsurf, Aider, and others.

**Improvement — two-location model:**

`.factory/skills/` is the **canonical source** — always written, tool-agnostic, human-readable. These are the actual skill prompt files. All cross-references in FACTORY.md, task-TEMPLATE.md, and factory.log point here.

During Phase 8, based on the tool chosen in Phase 0, the AI also writes the files to the **tool-specific auto-discovery location** so the AI chat can pick them up as slash commands:

| Tool | Auto-discovery location | File format |
|------|------------------------|-------------|
| Claude Code | `.claude/commands/` | `factory-<name>.md` |
| Cursor | `.cursor/rules/` | `factory-<name>.mdc` (front matter: `alwaysApply: false`) |
| Windsurf | `.windsurf/rules/` | `factory-<name>.md` |
| GitHub Copilot | `.github/copilot-instructions.md` (appended) | inline instructions block |
| Aider | no auto-discovery — reference `.factory/skills/` manually in chat | n/a |
| Other / Unknown | `.factory/skills/` only | n/a |

The canonical `.factory/skills/` files are always written first. The tool-specific copies are written second in Phase 8 and are considered derived artifacts — if the tool changes, Phase 8 can be re-run to regenerate them.

All skill files are named `factory-<verb>-<noun>` — e.g.:
- `factory-next-task`
- `factory-run-tasks`
- `factory-log-progress`
- `factory-manage-tasks`
- `factory-customize`
- `factory-extract-template`
- `factory-run-tests`, `factory-run-build`, `factory-db-migrate`, etc.

Update FACTORY.md Directory Tree to show both locations:
```
├── .factory/
│   └── skills/          ← canonical skill source (all tools)
└── .<tool>/
    └── commands/ (or rules/)   ← auto-discovery copy (tool-specific, Phase 8)
```

---

## [2026-11-05] Multi-task execution skill

**Problem:** `/factory-next-task` only executes one task per invocation. For unblocked sequential tasks (e.g., scaffold tasks with no interactive decisions) the developer must re-invoke manually after each one.

**Improvement:**
- Add a `/factory-run-tasks` skill that accepts a range or list: `factory-run-tasks 001-003` or `factory-run-tasks 002 004 007`.
- Skill behavior:
  1. Reads each task file in order.
  2. Verifies dependencies of each task are met before starting it.
  3. Executes the full task execution cycle (code → tests → build → lint → log → status update) for each task in sequence.
  4. Stops and surfaces the failure immediately if any task's tests, build, or lint do not pass after 3 fix attempts — does not proceed to the next task.
  5. Prints a per-task summary row after each completes.
- Document this skill in Phase 8 of the template and add it to the context file AI Autonomy section.

---

## [2026-11-05] Post-task developer review checklist

**Problem:** The task execution cycle ends at "lint passes." There is no prompt for the developer to do a human review — visual check, smoke test in the browser, API spot-check, etc.

**Improvement:**
- Add an optional **Developer Review** section to every generated task file (after Acceptance Criteria):

  ```
  ## Developer Review (optional — do after the AI cycle completes)
  - [ ] Open the app / endpoint and verify the feature works end-to-end
  - [ ] Check for visual regressions on affected screens
  - [ ] Confirm no unintended side-effects on adjacent features
  - [ ] {task-specific spot-check if obvious from the objective}
  ```

- In the `/factory-next-task` and `/factory-run-tasks` skills, after all automated checks pass, print:
  > "Automated cycle complete. See the Developer Review checklist in task-NNN.md if you want to do a manual spot-check before moving on."

---

## [2026-11-05] Frontend & backend folder structure — scalable and layer-separated from the start

**Problem:** Phase 4 (Frontend) and Phase 5 (Backend) ask vague questions like "sketch the top-level folder structure." The answers often produce flat, non-scalable layouts that don't enforce layer separation. By the time the project grows, refactoring is expensive.

**Improvement — principles (framework-agnostic):**

Replace the open-ended "sketch the folder structure" question with three targeted questions for each side. The AI must then generate a concrete folder tree — not a vague description — using those answers plus the framework chosen in Phase 2.

**Frontend (Phase 4) — questions to add:**
1. How is code grouped at the top level? (`by feature/domain` (recommended) / `by layer` / `by route`)
2. Where does shared, cross-cutting code live? (e.g., `shared/`, `core/`, `common/`)
3. Where does data-fetching / API-client code live relative to UI code? (co-located inside each feature / centralized in a separate layer)

From these answers the AI generates a folder tree that enforces:
- A clear **feature boundary** — each domain entity or user-facing feature gets its own folder
- A **layer split inside each feature** — UI/presentation code separated from data-access/state code
- A **shared zone** — reusable, non-domain pieces live in one place and are never duplicated
- The exact folder and file naming convention of the chosen framework

**Backend (Phase 5) — questions to add:**
1. How is code grouped at the top level? (`by domain entity` (recommended) / `by layer`)
2. What layers exist inside each domain? (e.g., `router → service → repository`, `controller → use-case → repository`, `handler → service → query`)
3. Where do shared/cross-cutting concerns live? (e.g., `common/`, `shared/`, `middleware/`)

From these answers the AI generates a folder tree that enforces:
- One folder per domain entity — never mix two entities in one folder
- Each layer is a separate file inside that folder — no business logic in the router/controller
- A shared zone for things like error filters, guards, validation pipes, middleware
- A database folder (migrations, seed, connection config) separate from domain code

**Rule for both:** By the time Phase 8 runs, every `<placeholder>` in the generated trees must be replaced with actual domain entity names from `app.md`. The trees in `frontend.md` and `backend.md` are the authoritative layout contract — task files in Phase 9 reference them directly when specifying which files to create.

---

## [2026-11-05] UX phase — concrete theme + structured reference assets

**Problem:** Phase 3 produces a superficial `ux.md` (design language as a one-liner, "Color & Typography: to be defined during scaffold task"). No theme is defined up front, so early tasks have no color/type contract to code against, and the result looks amateur.

**Improvements:**

### 1. Generate a concrete theme in `ux.md` during Phase 3

Add these questions to Phase 3:
- Primary brand color? (hex or description — the AI can suggest one based on the design language)
- Neutral palette style? (warm greys / cool greys / pure black-and-white)
- Typography: heading font and body font? (or "system font stack")
- Base spacing unit? (4 px / 8 px)
- Border radius style? (sharp / subtle / rounded / pill)

Generate a populated **Color & Typography** section in `ux.md`:

```markdown
## Color & Typography

### Palette
| Token | Value | Usage |
|-------|-------|-------|
| --color-primary | #1a56db | CTAs, active states |
| --color-primary-dark | #1e429f | Hover on primary |
| --color-surface | #0f172a | Page background |
| --color-surface-raised | #1e293b | Cards, panels |
| --color-border | #334155 | Dividers |
| --color-text | #f1f5f9 | Body copy |
| --color-text-muted | #94a3b8 | Labels, captions |
| --color-danger | #ef4444 | Errors, destructive |
| --color-success | #22c55e | Confirmations |

### Typography
| Token | Value |
|-------|-------|
| --font-heading | 'Inter', system-ui, sans-serif |
| --font-body | 'Inter', system-ui, sans-serif |
| --text-base | 16px / 1.5 |

### Spacing & Shape
| Token | Value |
|-------|-------|
| --space-unit | 8px |
| --radius-sm | 4px |
| --radius-md | 8px |
| --radius-lg | 16px |
```

Also generate a `theme.css` (or `_tokens.scss`) stub in `.factory/ux/` with these tokens as CSS custom properties.

### 2. Structure `.factory/ux/` as a reference library

Replace the vague "place anything here" tip with explicit guidance:

- If the developer provides references, they go into named files:
  - `links.md` — one section per feature/screen, each section lists 2–3 URLs to real apps as visual reference
  - `palette.css` — color tokens (overrides the generated stub if provided)
  - `screens/` subfolder — one HTML+inline-CSS file per core screen as a low-fidelity mock, named after the screen (e.g., `game-calendar.html`, `player-profile.html`)
- The AI must read every file in `.factory/ux/` before asking Phase 3 questions and must extract concrete color/font values from them if present.
- If `links.md` is present, the AI must acknowledge each link and note what design pattern it is borrowing from that reference.
- Phase 8 (context file generation) must include a **UX References** section listing every file in `.factory/ux/` so future task executions know the references exist.

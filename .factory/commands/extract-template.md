# Command: extract-template

Read the following files:
- `.factory/FACTORY.md`
- `CLAUDE.md`
- `.factory/logs/factory.log`
- All six docs in `.factory/docs/`
- All task files in `.factory/tasks/`

Then generate a new `FACTORY-TEMPLATE.md` in the project root.

Rules for the output:
- Strip all app-specific content: project name, domain entities, real file paths, stack choices, actual commands
- Replace stripped content with generic placeholders: `{project_name}`, `{context_file}`, `{today}`, etc.
- Preserve the full phase structure (Phase 0 through Phase 9) and all AI instructions
- Scan `factory.log` for entries with `STATUS: blocked` — extract the blocker description and add it as a new Process Note in the Appendix
- Scan task files for any `## Notes` sections that contain post-execution lessons — summarize them as Process Notes in the Appendix
- Keep all existing Appendix Process Notes intact
- The output file must be self-contained: a developer should be able to drop it into any new project and run it from scratch

Write the file to `FACTORY-TEMPLATE.md` at the project root.

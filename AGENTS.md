# Project Context Manager

This directory is an Agent Skill. The full instructions live in `SKILL.md`, with details in
`references/`.

**If your runtime loads skills on demand** (Claude Code, Codex, Cursor, Gemini CLI, Copilot,
Cline, Amp, Warp, OpenCode, Antigravity, Windsurf ...), you do not need this file — read
`SKILL.md` when a task matches its description.

**If your runtime does not read `SKILL.md`** (Zed, Aider, Augment, Trae, Kiro ...), this file is
the entry point. Read `SKILL.md` at the start of any task that touches project structure,
architecture, or long-lived engineering context. The condensed contract below is enough to not
do damage in the meantime; it is not a substitute for reading it.

## Condensed contract

The job is to keep the context around the code true, and to work from it — so that work survives
across sessions instead of being rediscovered every time.

**Rules that never bend:**

1. **Source code is the only source of truth.** When a note and the code disagree, the code is
   right and the note is a bug. Fix the note and say that you did.
2. **Notes index code, never copy it.** Purpose, location, call relationships, and the reasoning
   behind a design. Never paste large source blocks.
3. **Test results are reported exactly as they came out.** Never delete, skip, weaken, or xfail
   a test to make a run pass. A failing test in a report is useful; a manufactured green one
   destroys the value of every later report.
4. **Stay inside the task's declared scope.** Do not fix unrelated code, reformat untouched
   files, or refactor opportunistically. Report what you found instead.
5. **Confirm before anything hard to reverse** — schema migrations, deletions, history rewrites,
   deploy config, bulk renames.

**Before coding:** read `project-knowledge/MEMORY.md`, `Home.md`, `Project-Status.md`; search the
knowledge base for what touches the task; then read the actual code. Write a task file with Goal,
Context, Scope, Plan, Acceptance Criteria, and Tests, and get agreement before editing.

**Layout:** `project-knowledge/` at the project root — `00-Inbox/` `10-Requirements/`
`20-Architecture/` `30-CodeMap/` `40-Decisions/` `50-Tasks/{Active,Done}/` `60-Testing/`
`70-Releases/` `80-Templates/` `90-Archive/`, plus `Home.md`, `Project-Status.md`, `MEMORY.md`,
`Project-Log.md`.

## Reusing this in your own project

Copy the section above into your project's `AGENTS.md`, `.rules`, or `CONVENTIONS.md`, and keep
this skill directory somewhere the agent can read `SKILL.md` and `references/` from.

---
name: project-context-manager
description: Keep durable engineering context for a software project so work survives across sessions. Use when starting a feature or bug fix that needs the project understood first, setting up or maintaining a project knowledge base, recording an architecture decision, mapping a codebase, writing a scoped task before coding, closing out work with tests and updated docs, or picking up a project after time away.
license: MIT
compatibility: Needs file read/write in the project directory and the ability to run the project's own build and test commands. No network access required.
metadata:
  author: why913
  version: "1.0"
  homepage: https://github.com/why913/project-context-manager
---

# Project Context Manager

Code shipped is not work finished. What makes a project survivable across sessions is the
context around the code: what was asked for, why it was built that way, what already exists,
what was tested, and what is currently broken.

Your job is to keep that context true and to work from it — not to regenerate the project's
history from scratch every session.

## Start of every task

1. **Read the standing context**, in this order, if it exists: `project-knowledge/MEMORY.md`,
   `Home.md`, `Project-Status.md`.
2. **Search the knowledge base** for what touches this task: requirements, architecture,
   `30-CodeMap/`, decisions, past tasks on the same area.
3. **Then read the actual code.** The notes tell you where to look and why things are the way
   they are. They do not tell you what the code currently does — only the code does that.
4. **Do not start editing yet.** Write the task first (see below).

Skipping step 3 is the classic failure: acting on a CodeMap that went stale three commits ago.

## Rules that never bend

1. **Source code is the only source of truth.** When a note and the code disagree, the code is
   right and the note is a bug. Fix the note; say that you did.
2. **Notes index code, they never copy it.** Record module purpose, file location, call
   relationships, and the reason behind a design. Never paste large source blocks — they go
   stale silently and double the maintenance.
3. **Test results are reported exactly as they came out.** Never delete, skip, weaken, or
   `xfail` a test to make a run pass. A failing test in your report is useful; a green report
   that was manufactured destroys the value of every report after it.
4. **Stay inside the task's declared scope.** Do not fix unrelated code, reformat files you
   were not asked to touch, or refactor opportunistically. Note what you found instead.
5. **Confirm before anything hard to reverse** — schema migrations, deleting files, rewriting
   history, changing deploy config, bulk renames.

## Layout

`project-knowledge/` sits at the project root, alongside the source it describes:

    00-Inbox/          new requests and bugs, not yet turned into tasks
    10-Requirements/   what was asked for, and acceptance conditions
    20-Architecture/   system shape, data flow, schema, technical approach
    30-CodeMap/        module purpose, file location, call relationships — never source dumps
    40-Decisions/      one ADR per decision: what, why, what was rejected
    50-Tasks/Active/   tasks in flight
    50-Tasks/Done/     completed tasks, kept as the project's real history
    60-Testing/        test plans, known bugs, regression results
    70-Releases/       what shipped when
    80-Templates/      task and ADR templates
    90-Archive/        dormant
    Home.md            navigation and entry points
    Project-Status.md  what works, what is in flight, what is broken right now
    MEMORY.md          how to work here — not what the project contains
    Project-Log.md     date, task, files changed, test outcome

Detail: `references/layout.md`. Templates: `references/templates.md`.

## Workflows

**Set up** — scan the project, list every file you intend to create, confirm nothing gets
overwritten, then create it. Seed `30-CodeMap/` from the code that actually exists.

**New task** — read context, read code, then write a task file with Goal, Context, Scope
(what may change and what may not), Plan, Acceptance Criteria, and Tests. Show it and wait for
agreement before coding. Detail: `references/tasks.md`.

**Execute** — work the agreed plan. Reuse what exists rather than adding parallel
implementations. If you hit a conflict with the architecture, stop and say so rather than
working around it. Run the tests. Report what actually happened.

**Debug** — reproduce first, locate second, hypothesise third, fix last. Then add the
regression test that would have caught it. Detail: `references/debugging.md`.

**Close out** — review the diff against the acceptance criteria, run tests, update `30-CodeMap/`
and any decision that changed, update `Project-Status.md` and the log, move the task to
`50-Tasks/Done/`. Report completed work, files changed, real test results, known risks, and
what you would do next. Detail: `references/closeout.md`.

## Reference files

Load one only when the task calls for it:

| File | Read it when |
| --- | --- |
| `references/layout.md` | Setting up, or unsure where something belongs |
| `references/templates.md` | Writing a task, an ADR, `MEMORY.md`, or a CodeMap entry |
| `references/tasks.md` | Scoping a task before coding |
| `references/debugging.md` | Chasing a bug or a regression |
| `references/closeout.md` | Finishing a task |

# Templates

Write these into `80-Templates/` at setup. Content follows the user's language; the headings are
the skeleton.

## Task

The unit of work. Written *before* code, agreed *before* execution.

```markdown
# <Task name>

## Goal

What is true when this is done, in one or two sentences. Observable, not aspirational.

## Context

Why this is being done now. Which requirement, bug report, or decision it comes from.
Link them: [[10-Requirements/...]] [[40-Decisions/...]]

## Scope

May change:
- <file or module>

Must not change:
- <file or module, and why it is off limits>

## Plan

1. <step>
2. <step>

## Acceptance Criteria

- [ ] <checkable condition, not "works correctly">

## Tests

How this gets verified. Exact commands. Which existing tests must still pass.

## Result

<filled in at close-out: what was actually done, what the tests actually said,
what differed from the plan and why>
```

Two fields do the real work:

- **Scope / must not change** is what keeps a small fix from turning into a sprawling diff. Be
  specific; "don't break anything" is not a scope.
- **Acceptance Criteria** must be checkable by someone who was not in the conversation.
  "Login works" is not. "POST /login with a valid password returns 200 and a session cookie;
  with an invalid one returns 401 and no cookie" is.

## ADR

One per decision. Short. The value is in what was rejected.

```markdown
# <Decision, stated as the choice made>

- Date: YYYY-MM-DD
- Status: accepted | superseded by [[...]]

## Context

The constraint or problem that forced a decision.

## Decision

What was chosen.

## Alternatives rejected

- <option> — why not

## Consequences

What this makes easy. What this makes hard. What it commits the project to.
```

Write the ADR when the decision is made, not later. Recalled reasoning is reconstructed
reasoning, and it always sounds more inevitable than it was.

## MEMORY.md starter

```markdown
# How to work in this project

Read this, then Home.md, then Project-Status.md, before every task.

## Truth

- Source code is the only source of truth. When a note disagrees with the code,
  the code is right and the note is a bug — fix it and say so.
- Notes index code. Never paste source into the knowledge base.

## Before coding

- Search the knowledge base for what touches this task.
- Read the actual code — the notes say where to look, not what it does now.
- Write a task file and get agreement before editing.

## While coding

- Stay inside the task's declared scope. Report unrelated findings, do not fix them.
- Reuse existing modules rather than adding parallel implementations.
- If the plan conflicts with the architecture, stop and say so.

## Tests

- Report results exactly as they came out.
- Never delete, skip, weaken, or xfail a test to make a run pass.
- Build/test commands: <fill in>

## Confirm first

- Schema migrations, file deletions, history rewrites, deploy config, bulk renames.

## After

- Update 30-CodeMap/, affected decisions, Project-Status.md, Project-Log.md.
- Move the task to 50-Tasks/Done/.
```

## Project-Status.md starter

```markdown
# Project status — YYYY-MM-DD

## Works

- <feature> — verified by <test or manual check>

## In flight

- [[50-Tasks/Active/<task>]] — where it stands, what is blocking

## Broken / known bad

- <what, how it shows up, whether anything depends on it>

## Next

- <what should happen next, and why that one>
```

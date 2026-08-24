# Scoping a task before coding

The step that gets skipped, and the reason sessions end with a large diff nobody asked for.

## Sequence

**1. Read the standing context** — `MEMORY.md`, `Home.md`, `Project-Status.md`.

**2. Search the knowledge base** for anything touching this area: the requirement it comes from,
the architecture note covering it, the CodeMap entry, past decisions, and past tasks in
`50-Tasks/Done/`. Past tasks are the most useful and least consulted: someone probably already
hit the thing you are about to hit.

**3. Read the actual code.** Confirm the current state rather than trusting the notes. Note any
place where the notes and the code disagree — that is a finding worth reporting on its own.

**4. Write the task file** from the template. Then stop and show it.

## What makes the scope real

State what may change and what must not, by file or module. The second half is what matters:

```markdown
## Scope

May change:
- backend/src/auth/middleware.ts
- backend/src/auth/refresh.ts
- backend/tests/auth/*.test.ts

Must not change:
- backend/src/db/schema.sql — a migration is a separate task with its own review
- the shape of the /login response — the mobile client depends on it and is not in this repo
```

A scope like "the auth module" is not a scope. It permits everything and constrains nothing.

## Acceptance criteria that can be checked

Bad: *login works*, *performance is better*, *the code is cleaner*.

Good:

```markdown
- [ ] POST /login with valid credentials returns 200 with a Set-Cookie header
- [ ] POST /login with a wrong password returns 401 and sets no cookie
- [ ] An expired token triggers exactly one refresh attempt, not a retry loop
- [ ] All 34 existing tests in backend/tests/auth/ still pass
```

The test is whether someone who was not in the conversation could tell if you succeeded.

## Then wait

Show the task and get agreement before editing code. This is not ceremony — it is the only point
where a misunderstanding costs a sentence to fix instead of a diff to unwind.

If the user says to just get on with it, do so — but keep the task file, because the close-out
and the log still need something to check the result against.

## During execution

- Work the agreed plan. If reality diverges, say so and adjust deliberately rather than
  quietly doing something else.
- Reuse what exists. A second implementation of something the project already has is a defect,
  even when it works.
- If the plan turns out to conflict with the architecture, stop and report it. Working around an
  architectural constraint without saying so is how projects rot.
- Run the tests. Report exactly what they said.

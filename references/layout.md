# Layout

`project-knowledge/` lives at the project root, next to the code it describes. Keeping it in the
repo is deliberate: context that lives outside version control drifts away from the code within
a month.

    project-root/
      src/ | frontend/ | backend/ ...   the actual code
      project-knowledge/
        00-Inbox/
        10-Requirements/
        20-Architecture/
        30-CodeMap/
        40-Decisions/
        50-Tasks/Active/
        50-Tasks/Done/
        60-Testing/
        70-Releases/
        80-Templates/
        90-Archive/
        Home.md
        Project-Status.md
        MEMORY.md
        Project-Log.md

## What each directory holds

| Directory | Holds | Does not hold |
| --- | --- | --- |
| `00-Inbox/` | Raw requests and bug reports as they arrive | Anything already scoped into a task |
| `10-Requirements/` | What was asked for, acceptance conditions, out-of-scope notes | Implementation plans |
| `20-Architecture/` | System shape, data flow, schema design, technical approach | Decisions and their rationale (those are ADRs) |
| `30-CodeMap/` | Module purpose, where it lives, what calls it, what it calls | Source code |
| `40-Decisions/` | One ADR per decision: what was chosen, why, what was rejected | Status updates |
| `50-Tasks/Active/` | Tasks in flight | Finished work |
| `50-Tasks/Done/` | Completed tasks — the project's real history | Anything still open |
| `60-Testing/` | Test plans, known bugs, regression results | Test code (that lives with the source) |
| `70-Releases/` | What shipped, when, and what changed | Unreleased plans |

## Root files

| File | Answers | Updated |
| --- | --- | --- |
| `Home.md` | Where do I start? | When entry points change |
| `Project-Status.md` | What works, what is in flight, what is broken *right now* | Every task close-out |
| `MEMORY.md` | How does the agent behave in this project? | Rarely — it should be stable |
| `Project-Log.md` | What happened, when, with what test outcome | Every task |

`Project-Status.md` is the one that earns its keep. It is what makes picking a project up after
three weeks away take two minutes instead of an afternoon. It must include what is *broken* —
a status file that only lists wins is worse than none, because it reads as "everything is fine".

## The CodeMap rule

`30-CodeMap/` is the directory most likely to rot. Two constraints keep it useful:

**Never paste source.** A CodeMap entry says *what a module is for* and *how it connects*. The
moment it contains code, it starts lying, because nothing updates it when the code changes.

**Write what is not derivable.** Do not restate what a reader gets from a file listing or a
30-second read. Record what costs an hour to rediscover: why this module exists, which other
module secretly depends on its ordering, which function is the real entry point among five that
look equally plausible.

```markdown
# auth

- Location: `backend/src/auth/`
- Entry point: `verifyRequest()` in `middleware.ts` — everything else is called from it
- Depends on: `db/sessions`, `config/jwt`
- Depended on by: every route in `backend/src/routes/` except `/health`
- Gotcha: token refresh is triggered inside `verifyRequest`, not on a schedule.
  Changing its return type breaks refresh silently — there is no test for that path.
```

That `Gotcha` line is the whole reason the file exists.

## When a note and the code disagree

The code wins. Update the note, and say in your report that you did — a silent correction hides
the fact that someone was working from a wrong map. If you cannot tell which is right, mark the
note as suspect and ask, rather than guessing.

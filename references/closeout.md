# Close-out

The step that turns a working change into project context. Skipped close-outs are why a
knowledge base stops being trustworthy — a stale map is worse than no map, because people act
on it.

## Sequence

**1. Review the diff.** Read your own changes as a reviewer would. Look for: files touched that
were outside the declared scope, debug output left behind, commented-out code, unrelated
formatting churn. Remove what does not belong to the task.

**2. Check against the acceptance criteria.** Go through them one at a time. A criterion you
cannot check is not done — say so rather than assuming.

**3. Run the tests and record the actual output.** Include failures. If something fails and you
are shipping anyway because it is pre-existing or out of scope, say that explicitly with the
evidence that it was already failing.

**4. Update the knowledge base** — only what actually changed:

| Update | When |
| --- | --- |
| `30-CodeMap/` | A module's purpose, entry point, or dependencies changed; a gotcha was found |
| `40-Decisions/` | A decision was made, or an existing one superseded — write a new ADR, do not edit history |
| `10-Requirements/` | The requirement turned out to be different from what was recorded |
| `60-Testing/` | New coverage, a bug found, a regression test added |
| `Project-Status.md` | Always — including what is now broken or newly known to be fragile |
| `Project-Log.md` | Always — date, task, files changed, test outcome |

**5. Fill in the task's `Result` section** with what was actually done, what the tests actually
said, and where reality diverged from the plan. The divergence is the most valuable line in the
file.

**6. Move the task** from `50-Tasks/Active/` to `50-Tasks/Done/`.

## Report

```markdown
## Done

<what now works, tied to the acceptance criteria>

## Files changed

<path> — <what changed and why>

## Tests

<exact command>
<exact result, failures included>

## Risks / known gaps

<what could break, what is untested, what was deliberately left>

## Suggested next

<the one thing that should happen next, and why that one>
```

## What not to do here

- Do not expand scope during close-out. Something you noticed goes into `00-Inbox/`, not into
  this diff.
- Do not describe intent as outcome. "Should now handle empty input" is not a result; the test
  that proves it is.
- Do not skip `Project-Status.md` because nothing visibly changed. If the task revealed
  something fragile, that *is* the change worth recording.

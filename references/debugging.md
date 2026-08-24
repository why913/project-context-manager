# Debugging

Do not start by editing code. A fix applied before the cause is understood usually moves the
symptom somewhere less visible.

## Sequence

**1. Reproduce.** Get a deterministic repro before theorising. If it is intermittent, find what
makes it fire — load, ordering, a specific input, a cold cache. An unreproducible bug cannot be
verified as fixed, so say clearly that you could not reproduce it rather than fixing on
speculation.

**2. Locate.** Narrow to the smallest region that still shows the failure. Check `30-CodeMap/`
for what else calls into that region — the bug may be in the caller's assumptions.

**3. Hypothesise, then instrument.** State what you believe is happening and what observation
would prove it wrong. Then add the logging or assertion that produces that observation. Guessing
and patching in a loop is not debugging.

**4. Confirm the cause before fixing.** You should be able to explain why the failure happens,
not just what makes it stop.

**5. Fix minimally.** Change what causes the bug. Do not refactor the surrounding code in the
same pass, however tempting — a bug fix mixed with a refactor is unreviewable and unbisectable.

**6. Add the regression test.** It must fail before your fix and pass after. If you cannot write
one, say why — that is information about the code's testability, and it belongs in
`60-Testing/`.

**7. Record it.** Add to `60-Testing/`: what broke, the root cause, how it is now covered. If
the bug came from an assumption written in a note or an ADR, correct that too — otherwise the
same bug gets reintroduced by someone reading the same wrong note.

## Never

- **Never weaken a test to make a suite pass.** Not deleting, not skipping, not marking xfail,
  not loosening an assertion, not adding a retry to hide flakiness. If a test blocks the work,
  the test is either right (fix the code) or wrong (say so explicitly and get agreement).
- **Never report a run you did not do**, and never round a failure up to a pass. Two failures
  out of forty is a useful result; claiming a green suite when it was not poisons every later
  report.
- **Never fix by coincidence.** If the failure stopped and you cannot say why, it is not fixed.

## Reporting

State: what the symptom was, how you reproduced it, the root cause, what you changed, what the
tests said before and after, and what remains uncertain. If you only suppressed a symptom
because the real cause sits outside the task's scope, say that plainly and file the follow-up.

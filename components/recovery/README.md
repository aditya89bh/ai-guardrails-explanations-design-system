# Recovery Components

**Pattern category:** Recovery flows
**Phase:** 4
**Status:** stable
**Pattern specs:** `patterns/recovery/`

---

## Purpose

Recovery components guide users back to productive work after a blocking event — a refusal, a permission denial, an escalation failure, or an interruption. They are the last line of interaction before a user gives up. They must be clear, optimistic, and immediately actionable.

A recovery component must never be shown simultaneously with the blocking event that triggered it — the blocking event must be communicated first, then the recovery options are presented.

---

## Components in This Category

| Component | Implements pattern | Primary action |
|---|---|---|
| `RetryPrompt` | `retry-recovery` | Re-attempt the same action |
| `RedirectSuggestion` | `redirect-recovery` | Select an alternative path |
| `RepairCard` | `repair-recovery` | Review and correct the issue |
| `OverrideConfirmation` | `manual-override-recovery` | Authorize bypass |
| `AbandonExit` | `abandon-recovery` | Exit cleanly with state saved |

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This file |
| `component-spec.md` | Full specification for all recovery components |
| `interaction-model.md` | Retry sequences, repair validation, override confirmation |
| `accessibility.md` | Focus management after blocking event, live region for retry status |
| `motion.md` | Transition from blocking to recovery, success animation |
| `responsive.md` | Stacked alternatives on mobile, bottom sheet for override |

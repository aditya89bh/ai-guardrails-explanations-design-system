# Recovery Component Specification

**Implements patterns:** Retry recovery, redirect recovery, repair recovery, manual override recovery, abandon recovery
**Phase:** 4
**Status:** stable
**Decision engine reference:** `docs/decision-flows/state-transition-engine.md` § Recovery State Machine

---

## Purpose

Recovery components are optimistic by design. Their job is to return the user to productive work after a blocking event. They are presented after — not alongside — the blocking event communication. The component receiving focus immediately after a blocking event must be the first recovery option, not the blocking event message.

---

## Component Variants

| Variant | Recovery pattern | Primary action | Blocking |
|---|---|---|---|
| `retry` | `retry-recovery` | Re-attempt | No |
| `redirect` | `redirect-recovery` | Choose alternative | No |
| `repair` | `repair-recovery` | Fix the issue | Partial (validation step) |
| `override` | `manual-override-recovery` | Authorize bypass | Yes (confirmation required) |
| `abandon` | `abandon-recovery` | Exit cleanly | No |

---

## Anatomy

### RetryPrompt

```
[Icon-recovery] [Title: "Try again"]
[What failed and why — brief]
[Retry type indicator: automatic / assisted / manual]
[Retry attempt count: "Attempt 1 of 3"]
[Retry button]  [Or: try a different approach (redirect)]
```

Named parts:
- **failure-summary** — Brief statement of what failed. Required; not a technical error message.
- **retry-type-label** — Indicates automatic, assisted, or manual retry mode.
- **attempt-counter** — "Attempt N of M". Required when retry limits apply. Hidden when unlimited.
- **retry-control** — Primary action. Label: "Try again" or "Retry". Required.
- **redirect-option** — Secondary: "Or try a different approach". Appears on attempt 2+.

### RedirectSuggestion

```
[Icon-recovery] [Title: "Here are some other ways to help"]
[Alternative 1: label + description] [Choose]
[Alternative 2: ...]                 [Choose]
[Alternative 3: ...]                 [Choose]
[None of these]
```

Named parts:
- **suggestion-header** — Positive framing. Not "You can't do that, try this." Required.
- **alternative-item** — Each with label, description, and choose control. Maximum 5 alternatives.
- **goal-statement** (optional) — Displays the user's underlying goal to confirm goal preservation.
- **none-option** — Required. Label: "None of these" or "Start over".

### RepairCard

```
[Icon-recovery] [Title: "Something needs to be corrected"]
[What the issue is]
[Repair type: data / state / configuration]
[Repair fields or actions]
[Validate] [Cancel]
[Rollback option: if validation fails]
```

Named parts:
- **issue-statement** — What needs correcting. Required; specific.
- **repair-type-label** — `data`, `state`, or `configuration`. Required.
- **repair-controls** — Editable fields, toggles, or action buttons specific to the repair type.
- **validate-control** — Submits the repair for validation. Required.
- **cancel-control** — Cancels without repair. Returns user to prior state.
- **rollback-option** — Shown if validation fails: option to revert to a prior known-good state.

### OverrideConfirmation

```
[Icon-severity-caution] [Title: "Override required — your approval is needed"]
[What will be overridden]
[Why the guardrail existed]
[Risk acknowledgment: checkbox — user must check]
[Scope: this action / time window / session]
[Expiration display]
[Confirm override]  [Cancel]
[Audit indicator — prominent]
```

Named parts:
- **override-statement** — What will be bypassed. Required; specific.
- **risk-statement** — Why the guardrail existed. Required; must not be omitted for trust.
- **risk-acknowledgment** — Checkbox that user must actively check before override is available. Required.
- **scope-display** — Exact scope and expiration of the override. Required.
- **confirm-control** — Disabled until `risk-acknowledgment` is checked. Required.
- **cancel-control** — Returns user to prior state. Required.
- **audit-indicator** — Prominent. Override actions require the strongest audit trail.

### AbandonExit

```
[Icon] [Title: "Ready to exit"]
[What was saved: list]
[What was NOT saved: list]
[Re-entry path: how to return]
[Exit cleanly]
```

Named parts:
- **saved-summary** — What was preserved. Required; specific.
- **not-saved-summary** — What was not saved. Required; the user must understand what they are leaving behind.
- **reentry-path** — How to resume this task later. Required. May be a reference ID, a link, or a description.
- **exit-control** — Confirms the exit. Required.

---

## Input Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | Recovery variant enum | Yes | Recovery type |
| `recoveryId` | `string` | Yes | Unique identifier |
| `blockingEventType` | `string` | Yes | What triggered recovery |
| `failureSummary` | `string` | Retry | What failed and why |
| `retryType` | `'automatic' \| 'assisted' \| 'manual'` | Retry | Retry mode |
| `retryAttempt` | `number` | Retry | Current attempt number |
| `retryLimit` | `number \| null` | Retry | Max attempts (null = unlimited) |
| `alternatives` | `Alternative[]` | Redirect | Same structure as refusal alternatives |
| `userGoal` | `string` | Redirect | User's underlying goal for confirmation |
| `issueStatement` | `string` | Repair | What needs correcting |
| `repairType` | `'data' \| 'state' \| 'configuration'` | Repair | Repair category |
| `overrideStatement` | `string` | Override | What is being bypassed |
| `overrideScope` | `OverrideScope` | Override | Scope and expiration |
| `savedItems` | `string[]` | Abandon | What was saved |
| `unsavedItems` | `string[]` | Abandon | What was not saved |
| `reentryPath` | `string` | Abandon | How to return |
| `onRetry` | `() => void` | Retry | Called on retry |
| `onAlternativeSelect` | `(id) => void` | Redirect | Called on alternative selection |
| `onRepairValidate` | `(data) => void` | Repair | Called on validate |
| `onOverrideConfirm` | `() => void` | Override | Called on confirmed override |
| `onAbandon` | `() => void` | Abandon | Called on clean exit |
| `auditId` | `string` | Yes — all | All recovery actions are audit-relevant |

---

## Output / Callbacks

| Callback | Trigger | Payload |
|---|---|---|
| `onRetry` | User initiates retry | `{ recoveryId, attempt, auditId }` |
| `onAlternativeSelect` | User selects redirect option | `{ alternativeId, recoveryId, auditId }` |
| `onRepairValidate` | User submits repair | `{ repairData, repairType, recoveryId, auditId }` |
| `onOverrideConfirm` | User confirms override | `{ scope, expiration, recoveryId, auditId, acknowledged: true }` |
| `onAbandon` | User exits | `{ savedItems, recoveryId, auditId }` |
| `onMount` | Component renders | `{ variant, recoveryId, blockingEventType }` |

---

## States

Maps to the Recovery State Machine from `docs/decision-flows/state-transition-engine.md`:

| UI state | Machine state | Visual |
|---|---|---|
| `offered` | OFFERED | Default appearance; all options available |
| `selected` | SELECTED | Selected option highlighted; others dimmed |
| `executing` | EXECUTING | Loading state on primary action |
| `succeeded` | SUCCEEDED | Brief success state; transition back to main workflow |
| `failed` | FAILED | Error state; next recovery option offered |
| `cascaded` | CASCADED | Transition to next recovery variant |
| `abandoned` | ABANDONED | Clean exit state; saved summary shown |

---

## Recovery Cascade Visual Behavior

When a recovery flow fails and the next cascade step is offered, the transition between recovery variants must be visible — the user must understand that the system is trying a different approach, not repeating the same failure. The outgoing variant exits with `easing-exit`; the incoming variant enters with `easing-enter`. A brief connecting message ("Let me try a different approach") may be shown during the transition.

---

## Related Patterns

- `patterns/recovery/retry-recovery.md`
- `patterns/recovery/redirect-recovery.md`
- `patterns/recovery/repair-recovery.md`
- `patterns/recovery/manual-override-recovery.md`
- `patterns/recovery/abandon-recovery.md`

## Related Decision Engine Rules

- `docs/decision-flows/state-transition-engine.md` § Recovery State Machine
- `docs/decision-flows/state-transition-engine.md` § Recovery Cascade Sequence
- `docs/decision-flows/pattern-composition-engine.md` § Refusal + Recovery Flow

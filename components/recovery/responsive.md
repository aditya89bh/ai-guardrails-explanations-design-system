# Recovery Component Responsive Behavior

**Component category:** Recovery
**Phase:** 4
**Status:** stable

---

## RetryPrompt Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width; failure summary truncated at 2 lines; retry button full-width; redirect option below |
| `sm`+ | Full-width card; retry + redirect side by side |

Retry attempt counter is always visible on all breakpoints.

---

## RedirectSuggestion Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Single column; alternatives stacked; full-width choose buttons |
| `sm` | Single column |
| `md`, `lg` | Two-column grid if ≥ 4 alternatives; single column if ≤ 3 |

Goal statement (if shown) appears above the alternatives on all breakpoints.

---

## RepairCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width; repair fields full-width; validate and cancel buttons stacked |
| `sm`+ | Repair fields full-width; buttons side by side |

Rollback option is always below the primary repair controls, never in a sidebar or hidden behind a tab.

---

## OverrideConfirmation Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Bottom sheet — slides up from bottom; risk acknowledgment and confirm sticky at bottom of sheet |
| `md`, `lg` | Centered dialog at max 480px |

On `xs`/`sm`, the full override statement and risk statement must be scrollable within the sheet. The sticky bottom contains only the checkbox and confirm/cancel buttons.

---

## AbandonExit Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width; saved/not-saved lists vertically stacked; exit button full-width at bottom |
| `sm`+ | Full-width card; lists side by side if few items; exit button full-width |

Re-entry path is always visible without scrolling — it is placed above the exit button, not hidden in collapsed content.

---

## Recovery Cascade Transition — Responsive Consideration

On `xs`/`sm`, the cascade transition replaces the full viewport — the outgoing recovery component exits, the incoming one takes its place. There is no side-by-side display of two recovery options at once.

On `md`/`lg`, the transition follows the standard cascade animation (see `motion.md`).

# Warning Component Accessibility

**Component category:** Warning
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## ARIA Roles and Attributes

| Component variant | ARIA role | Key attributes |
|---|---|---|
| Inline / Banner (informational) | `role="status"` | `aria-live="polite"` |
| Modal / Blocking (advisory–critical) | `role="alertdialog"` | `aria-modal="true"`, `aria-labelledby="[title-id]"`, `aria-describedby="[message-id]"` |
| Ambient (session-level) | `role="status"` | `aria-live="polite"`, `aria-atomic="false"` |
| Progressive (escalating) | `role="alert"` on escalation | `aria-live="assertive"` when escalating to blocking |
| Policy warning | `role="alertdialog"` | Same as modal |

**Live region selection rule:**
- `aria-live="polite"` for informational and advisory — does not interrupt current screen reader output.
- `aria-live="assertive"` for caution, blocking, critical — interrupts immediately.

---

## Screen Reader Announcements

| Event | Announcement |
|---|---|
| Inline warning mounts | "[Severity level]: [message text]" — read once, politely |
| Modal warning mounts | "[Severity level]: [title]. [message]" — read once, assertive |
| Blocking warning mounts | "Warning — action blocked: [title]. [message]. Required action: [action label]" |
| Warning dismissed | No announcement — dismissal is a user action |
| Action completed | "[Action label] confirmed" or silent (depends on outcome) |
| Auto-dismiss countdown | "Warning will close in [N] seconds" — announced every 30 seconds |
| Progressive escalation (inline → modal) | "Warning updated: [new severity] — [new title]" |

---

## Keyboard Requirements

See `interaction-model.md` for full keyboard interaction table. Accessibility-specific requirements:

- All dismiss and action controls must be reachable by Tab and operable by Enter/Space.
- Modal and blocking variants must implement a **focus trap** — Tab may not navigate outside the warning component while it is active.
- Focus trap must cycle within the warning component: last focusable element → wraps to first.
- On dismiss or resolution, focus must return to the logical prior position.
- The dismiss control (×) must have `aria-label="Dismiss warning"` — the × character alone is not descriptive.

---

## Focus Order Within Warning Components

| Order | Element | Notes |
|---|---|---|
| 1 | Warning title (heading or aria-labelledby target) | Not interactive — sets context |
| 2 | Expand control (if present) | Optional |
| 3 | Detail links (if present) | Optional |
| 4 | Primary action button | Required for modal/blocking |
| 5 | Cancel / Deny button | Required for modal/blocking |
| 6 | Dismiss control (×) | Present in inline/banner only |

For blocking warnings: only action buttons are in the focus order. There is no dismiss control in the tab sequence.

---

## Color and Contrast Requirements

- All text must meet WCAG 2.1 AA: ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
- Severity must not be communicated by color alone. Each severity level uses both color (`severity-{level}-surface`) AND the severity icon (`icon-severity-{level}`) AND a text label (for blocking and critical).
- Focus indicators must have ≥ 3:1 contrast ratio against adjacent colors.

---

## Reduced Motion

All warning animations (see `motion.md`) must check `prefers-reduced-motion: reduce`. When active:
- Entrance/exit: instant (0ms) — no slide or fade.
- State transitions: instant.
- Auto-dismiss timer indicator: hidden; countdown announced via `aria-live` text only.

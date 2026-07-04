# Escalation Component Responsive Behavior

**Component category:** Escalation
**Phase:** 4
**Status:** stable

---

## EmergencyEscalationOverlay Responsive Behavior

Emergency overlay is always full-screen on all breakpoints. No layout adaptation — the content must be visible immediately on any viewport.

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Full-viewport; content scrollable; ACKNOWLEDGE button sticky at bottom |
| `md`, `lg` | Full-viewport overlay with centered content card (max 640px) |

The ACKNOWLEDGE button must be visible without scrolling on `xs`. If content exceeds the viewport, the button is sticky at the bottom of the viewport (not sticky within the scroll container).

---

## HumanHandoffPanel Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width card below the escalating action; compact status display; reference ID with copy button |
| `sm` | Full-width card |
| `md`, `lg` | Slide-over panel or inline card depending on page layout |

---

## RoleEscalationCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width; role chain displayed vertically (current role → required role, stacked) |
| `sm`+ | Role chain displayed horizontally with arrow |

---

## SystemEscalationNotice Responsive Behavior

Always renders as a full-width banner. On `xs`, message truncates at 1 line with expand.

---

## AsyncReviewStatus Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Compact bottom status bar: icon + short status label + tap to expand |
| `md`, `lg` | Persistent status card in sidebar or below content |

Bottom status bar (`xs`/`sm`):
- Occupies the bottom of the viewport above any existing navigation.
- Does not obstruct primary content.
- Tapping expands to full status card (bottom sheet).
- Swipe down to collapse.

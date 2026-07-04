# Warning Component Responsive Behavior

**Component category:** Warning
**Phase:** 4
**Status:** stable

---

## Breakpoints

This design system uses a 4-breakpoint model. Implementations should map to their own breakpoint system — the named breakpoints here define behavioral changes, not specific pixel values.

| Breakpoint | Reference width | Context |
|---|---|---|
| `xs` | < 480px | Single-column narrow mobile |
| `sm` | 480–767px | Mobile landscape / small tablet |
| `md` | 768–1023px | Tablet |
| `lg` | ≥ 1024px | Desktop |

---

## Inline Warning Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Full-width block display; action buttons stacked vertically below message |
| `md`, `lg` | Inline with text flow; actions in same row as message |

---

## Banner Warning Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width; message truncated at 2 lines with expand; action button full-width below message |
| `sm` | Full-width; message 1 line; action inline if short, otherwise below |
| `md`, `lg` | Full-width sticky bar; icon + message + action in single row |

Dismiss control (×) is always present at the trailing edge on all breakpoints.

---

## Modal Warning Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Full-screen modal — occupies entire viewport (no centering, no side margins); actions full-width, stacked |
| `md` | Centered dialog at 90% viewport width; actions side by side |
| `lg` | Centered dialog at max 560px width; actions side by side |

---

## Blocking Warning Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Full-screen blocking overlay; scrollable content; action button(s) sticky to bottom of viewport |
| `md`, `lg` | Full-screen overlay; centered card at 640px max-width |

---

## Ambient Warning Responsive Behavior

Ambient warnings are not affected by breakpoint — they are always full-width persistent elements above the content area. On `xs`, the message is condensed to an icon + single-line label with a "details" expand.

---

## Touch Target Requirements

All interactive controls (dismiss ×, action buttons, expand) must have a minimum touch target of 44×44px at all breakpoints. On `xs`, use full-width buttons where the visual design would otherwise produce a target smaller than 44px tall.

---

## Content Truncation Rules

| Breakpoint | Max visible message lines | Overflow behavior |
|---|---|---|
| `xs` | 2 lines | Expand control ("Show more") |
| `sm` | 2 lines | Expand control |
| `md` | 3 lines | Expand control |
| `lg` | No truncation | Full message always visible |

# Permission Component Responsive Behavior

**Component category:** Permission
**Phase:** 4
**Status:** stable

---

## PermissionGate Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Bottom sheet — slides up from bottom edge; occupies ~70% of viewport height; denies scroll behind |
| `md` | Centered modal at 90% viewport width |
| `lg` | Centered modal at 480px max-width |

**Bottom sheet rules (`xs`, `sm`):**
- Dragging down triggers `onDismiss` (treated as deny).
- A horizontal handle indicator is visible at the top of the sheet.
- Sheet content is scrollable if it exceeds the sheet height.
- Grant and deny controls are sticky at the bottom of the sheet.

---

## ScopedPermissionGate Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Scope visualizer shows max 3 items; "Show all" expands to full list |
| `sm` | Scope visualizer shows max 5 items |
| `md`, `lg` | All scope items visible; wrapped tag group |

---

## DelegatedPermissionRequest Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Full-width card below the blocked action; status displayed as prominent badge |
| `md`, `lg` | Inline card beside or below blocked action; status indicator inline |

---

## PermissionRevocationNotice Responsive Behavior

Full-width banner on all breakpoints. Content truncates at 2 lines on `xs`; full text visible on `sm`+. The "Re-authorize" action is always full-width on `xs`.

---

## Button Layout Rules

Grant and deny controls:

| Breakpoint | Layout |
|---|---|
| `xs`, `sm` | Full-width, stacked: deny on top, grant below |
| `md`, `lg` | Side by side: deny left, grant right |

The stacking order (deny on top on mobile) reinforces the `interaction-model.md` tab order rule: denial is the default path.

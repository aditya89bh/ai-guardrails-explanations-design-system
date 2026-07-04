# Explanation Component Responsive Behavior

**Component category:** Explanation
**Phase:** 4
**Status:** stable

---

## Inline and Badge Components (`xs`–`lg`)

ConfidenceBadge and StaleContextBadge are inline elements and adapt naturally to text flow. No breakpoint-specific behavior is required beyond ensuring touch targets ≥ 44×44px for the badge when it is tappable.

Tooltip behavior on narrow viewports:
- `xs`, `sm`: Tooltip opens as a bottom sheet instead of a floating tooltip — standard tooltip positioning puts content off-screen on small viewports.
- `md`, `lg`: Standard floating tooltip.

---

## SourceList Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Single column; 3 sources shown by default; "Show all" expands to full list |
| `sm` | Single column; 3 sources shown |
| `md` | Single column; 5 sources shown |
| `lg` | May show up to 5 sources; no expansion needed if ≤ 5 |

Source items truncate at 1 line (label) with title attribute for full text. Source URLs do not display on `xs`/`sm` — only the label is shown.

---

## ReasoningTrace Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs`, `sm` | Always collapsed by default; max 3 steps visible when expanded; "Show all steps" control |
| `md`, `lg` | May default to expanded; all steps visible |

---

## DecisionSummary Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Single-column stack; factor list hidden until user expands |
| `sm` | Single-column; factor list visible (compact) |
| `md`, `lg` | Two-column layout where layout permits: summary + factors side by side |

---

## StructuredUncertaintyCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width card; sections (confidence, limitation, sources) vertically stacked and collapsed by default; user expands each |
| `sm` | Full-width; confidence badge + limitation visible; sources collapsed |
| `md`, `lg` | Full card visible; all sections accessible without expand |

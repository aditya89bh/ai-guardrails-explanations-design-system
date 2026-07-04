# Refusal Component Responsive Behavior

**Component category:** Refusal
**Phase:** 4
**Status:** stable

---

## RefusalCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width card; available paths stacked vertically; full-width buttons |
| `sm` | Full-width card; paths may be side by side if 2 options |
| `md`, `lg` | Card at comfortable reading width (max 640px); paths side by side |

---

## PartialCompletionCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Single column: completed output → exclusion notice → redirect; each full-width |
| `sm`+ | Same single-column layout; visual separator between completed and exclusion sections |

The exclusion notice is always below the completed output on all breakpoints. It must not be placed in a sidebar or collapsed by default.

---

## AlternativeSuggestionCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Single column; alternatives stacked vertically; full-width choose buttons |
| `sm` | Single column |
| `md` | Two-column grid if ≥ 4 alternatives; single column if ≤ 3 |
| `lg` | Two-column grid if ≥ 4; single column if ≤ 3 |

Maximum alternatives shown without scroll: 5. If more exist, they are paginated or collapsed behind "Show more."

---

## ClarificationRequest Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width; text input full-width; submit and cancel buttons stacked |
| `sm` | Full-width; buttons side by side |
| `md`, `lg` | Inline section or compact dialog; max 480px |

Structured options (radio group) stack vertically on all breakpoints — never in a horizontal row.

---

## HumanHandoffCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width card; status prominent; process description collapsed behind "Details" |
| `sm`+ | Full card visible; process description visible |

Reference ID should be displayed and easily selectable (copy to clipboard on `xs` — text selection is difficult on mobile).

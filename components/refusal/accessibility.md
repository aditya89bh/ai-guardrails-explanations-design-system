# Refusal Component Accessibility

**Component category:** Refusal
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## ARIA Roles and Attributes

| Component | ARIA role | Key attributes |
|---|---|---|
| RefusalCard | `role="alert"` | `aria-live="assertive"` — refusal is always meaningful news |
| Policy attribution | `<p>` within card | Referenced by `aria-describedby` from the heading |
| PartialCompletionCard | `<section>` | `aria-label="Partial result"` |
| Exclusion list | `<ul>` | `aria-label="Items that could not be completed"` |
| AlternativeSuggestionCard | `<section>` | `aria-label="Alternative approaches"` |
| Alternative items | `<ul>` of `<li>` + `<button>` | Each button: `aria-label="Choose: [alternative label]"` |
| ClarificationRequest | `role="dialog"` or inline `<section>` | `aria-label="Clarification needed"` |
| Clarification input | `<input>` or `<textarea>` | `aria-labelledby="[question-id]"`, `aria-required="true"` |
| HumanHandoffCard | `role="status"` | `aria-live="polite"` for status updates |
| Handoff status | `<p>` | Updated live when status changes |

---

## Screen Reader Announcements

| Event | Announcement |
|---|---|
| RefusalCard renders | "Request declined: [refusal title]. [Reason]. [Available paths]" |
| Policy refusal renders | "This action is restricted by: [policy name]. [Paths]." |
| PartialCompletionCard renders | "Partial result delivered. [N] items could not be completed: [list]." |
| Alternative selected | "Selected: [alternative label]. Loading..." |
| Clarification submitted | "Clarification submitted. Evaluating..." |
| HumanHandoffCard: ROUTING | "Connecting you with [handler role]..." |
| HumanHandoffCard: CONNECTED | "Connected. [Handler role] is reviewing your request." |
| HumanHandoffCard: FAILED | "No handler available. [Next options]." |

---

## Keyboard Requirements

- RefusalCard: interactive elements (paths, links) are Tab-reachable.
- AlternativeSuggestionCard: alternatives are a list of buttons; Arrow-key navigation may supplement Tab navigation (implement as radiogroup if mutually exclusive).
- ClarificationRequest: focus moves to the clarification input on mount.
- ClarificationRequest: Escape cancels and returns focus to prior position.
- HumanHandoffCard: Withdraw button is Tab-reachable while status is ROUTING/ROUTED.

---

## Focus Order

**On RefusalCard mount:** Focus moves to the refusal heading (aria-labelledby target), then Tab cycles through available paths.

**On AlternativeSuggestionCard mount:** Focus moves to the first alternative button.

**On ClarificationRequest mount:** Focus moves to the clarification input.

**On handoff mount:** Focus does not move (non-blocking) — the handoff panel renders in a status area without interrupting the user's current focus.

---

## Color and Contrast

- `icon-refusal` must appear alongside all refusal headlines — not color-only indication of refusal.
- Policy attribution must be visually distinct from the refusal reason (different typographic weight or label).
- Alternative items must meet ≥ 4.5:1 contrast for labels.

---

## Reduced Motion

- Refusal component entrance: instant.
- Alternative selection highlight: instant state change.
- Partial completion reveal: instant.

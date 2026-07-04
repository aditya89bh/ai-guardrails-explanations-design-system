# Refusal Components

**Pattern category:** Refusal patterns
**Phase:** 4
**Status:** stable
**Pattern specs:** `patterns/refusal/`

---

## Purpose

Refusal components deliver negative outcomes — requests that cannot be fulfilled — in a way that maintains user trust and provides a productive path forward. A refusal component is not an error state. It is a structured communication of why the AI cannot complete the request and what the user can do instead.

Refusal components must never leave users stranded with only a "No" and no direction.

---

## Components in This Category

| Component | Implements pattern | User path forward |
|---|---|---|
| `RefusalCard` | `safe-refusal`, `policy-refusal` | Explanation + alternatives |
| `PartialCompletionCard` | `partial-completion` | Completed output + redirect for excluded |
| `ConstrainedCompletionCard` | `constrained-completion` | Modified output + explanation |
| `AlternativeSuggestionCard` | `alternative-suggestion` | Selectable alternatives |
| `ClarificationRequest` | `clarification-request` | Input prompt or option set |
| `HumanHandoffCard` | `human-handoff` | Handoff confirmation + status |

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This file |
| `component-spec.md` | Full specification for all refusal components |
| `interaction-model.md` | Alternative selection, clarification input, handoff confirmation |
| `accessibility.md` | Focus management on refusal, live region announcements |
| `motion.md` | Refusal entrance, partial completion reveal |
| `responsive.md` | Alternative stacking on narrow viewports |

# Refusal Component Motion

**Component category:** Refusal
**Phase:** 4
**Status:** stable

---

## Motion Principles

Refusal motion must not feel punishing. The entrance communicates a clear, calm "No" — not a crash or an error. The path forward (alternatives, clarification) should feel immediately available — no delay between the refusal and the options.

---

## Entrance Animations

| Component | Duration | Easing | Reduced-motion |
|---|---|---|---|
| RefusalCard (safe, policy) | `duration-standard` (300ms) | `easing-enter` | Instant |
| PartialCompletionCard | `duration-standard` (300ms) | `easing-enter` | Instant |
| AlternativeSuggestionCard | `duration-standard` (300ms) | `easing-enter` | Instant |
| ClarificationRequest | `duration-moderate` (200ms) | `easing-enter` | Instant |
| HumanHandoffCard | `duration-standard` (300ms) | `easing-enter` | Instant |

---

## Partial Completion Reveal

The completed output renders first; the exclusion notice appears after:
1. Completed output renders: `duration-fast` (100ms), `easing-enter`.
2. Pause: 200ms.
3. Exclusion notice enters: `duration-moderate` (200ms), `easing-enter`.
4. Redirect suggestion enters: `duration-fast` (100ms) after exclusion notice.

Rationale: the user should read the completed portion first, then understand the exclusion.

Reduced motion: all elements appear simultaneously, instant.

---

## Alternative Items Stagger

In AlternativeSuggestionCard, alternatives enter sequentially:
- Alternative 1: 0ms delay.
- Each subsequent item: +40ms delay.
- Each item: `duration-fast` (100ms), `easing-enter`.
- Total: capped at 200ms.
- Reduced motion: all items instant, simultaneous.

---

## State Transitions

| Transition | Duration | Easing | Reduced-motion |
|---|---|---|---|
| Alternative: default → selected | `duration-fast` (100ms) | `easing-standard` | Instant |
| Other alternatives dim | `duration-fast` (100ms) | `easing-standard` | Instant |
| Clarification submit → loading | `duration-fast` (100ms) | `easing-standard` | Instant |
| HumanHandoff status update | `duration-moderate` (200ms) | `easing-standard` | Instant |

---

## Exit Animations

Refusal components exit when a path forward is accepted or the user abandons.

| Event | Duration | Easing | Reduced-motion |
|---|---|---|---|
| Alternative selected → loading | `duration-moderate` (200ms) | `easing-exit` | Instant |
| Clarification accepted → re-evaluation | `duration-moderate` (200ms) | `easing-exit` | Instant |
| Handoff accepted | `duration-standard` (300ms) | `easing-exit` | Instant |

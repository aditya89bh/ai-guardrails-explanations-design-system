# Recovery Component Motion

**Component category:** Recovery
**Phase:** 4
**Status:** stable

---

## Motion Principles

Recovery motion is optimistic. It should communicate "Let's try again" or "Here's another path" — not the weight of a failure. Success animations are satisfying and brief. Cascade transitions signal a fresh attempt, not a repeated failure.

---

## Entrance Animations

| Component | Duration | Easing | Reduced-motion |
|---|---|---|---|
| RetryPrompt | `duration-standard` (300ms) | `easing-enter` | Instant |
| RedirectSuggestion | `duration-standard` (300ms) | `easing-enter` | Instant |
| RepairCard | `duration-standard` (300ms) | `easing-enter` | Instant |
| OverrideConfirmation | `duration-deliberate` (400ms) | `easing-enter` | 100ms fade |
| AbandonExit | `duration-moderate` (200ms) | `easing-enter` | Instant |

---

## Success Animations

| Component | Success animation | Duration | Reduced-motion |
|---|---|---|---|
| RetryPrompt | Checkmark icon replaces spinner; brief scale 1.0→1.08→1.0 | `duration-moderate` (200ms), `easing-spring` | Instant checkmark |
| RepairCard | Validation checkmark; card dims then exits | `duration-standard` (300ms) | Instant exit |
| OverrideConfirmation | Checkmark; audit indicator becomes prominent briefly | `duration-moderate` (200ms), `easing-spring` | Instant |

---

## Cascade Transition Animation

When recovery fails and the next cascade step is offered:

1. Outgoing recovery component: fade out, 150ms, `easing-exit`.
2. Brief connecting message appears (if enabled): "Let me try something different" — fade in 100ms, display 500ms, fade out 100ms.
3. Incoming recovery component: enters with standard entrance animation.

Reduced motion:
- Outgoing: instant remove.
- No connecting message.
- Incoming: instant.

---

## Override Confirmation Animation

When the risk acknowledgment checkbox is checked and the confirm button activates:
- Button transitions from `aria-disabled` visual state to active: `duration-fast` (100ms), color and opacity transition.
- Reduced motion: instant.

When override is confirmed:
- Button: scale 1.0 → 0.96 → 1.0 (200ms, `easing-spring`).
- Audit indicator: briefly brightens (opacity 0.6 → 1.0 → 0.6, 400ms) to draw attention to the record.
- Component exits: `duration-standard` (300ms), `easing-exit`.

Reduced motion: no button spring, no audit indicator animation; standard exit timing.

---

## AbandonExit Animation

The abandon exit is the only recovery animation that is deliberately slow:

- Entrance: `duration-moderate` (200ms) — slower than other recoveries, signals finality.
- The saved/not-saved lists reveal sequentially:
  - Saved list: appears with entrance.
  - Not-saved list: +150ms delay.
  - Re-entry path: +150ms after not-saved.
- Rationale: users must read what they are leaving behind before they exit.
- Reduced motion: all elements appear simultaneously, instant.

Exit (on abandon confirmed):
- Component: `duration-standard` (300ms), `easing-exit`.
- Reduced motion: instant.

# Warning Component Motion

**Component category:** Warning
**Phase:** 4
**Status:** stable

---

## Motion Principles for Warning Components

Warning motion must match the urgency of the severity level. Low-severity warnings enter gently; high-severity warnings enter with enough velocity to register as important without causing alarm. Over-animating a warning trains users to ignore it.

---

## Entrance Animations

| Variant | Duration | Easing | Direction | Reduced-motion |
|---|---|---|---|---|
| `inline` (informational) | `duration-standard` (300ms) | `easing-enter` | Fade in + slide down 4px | Instant |
| `banner` | `duration-standard` (300ms) | `easing-enter` | Slide down from top edge | Instant |
| `ambient` | `duration-long` (600ms) | `easing-enter` | Fade in only | Instant |
| `modal` | `duration-deliberate` (400ms) | `easing-enter` | Fade in + scale from 0.97→1.0 | 100ms fade |
| `blocking` | `duration-deliberate` (400ms) | `easing-enter` | Overlay fades in; card slides up 8px | 100ms fade |
| `policy` | `duration-deliberate` (400ms) | `easing-enter` | Same as modal | 100ms fade |

---

## Exit Animations

| Variant | Duration | Easing | Reduced-motion |
|---|---|---|---|
| `inline` (dismissed) | `duration-moderate` (200ms) | `easing-exit` | Instant |
| `banner` (dismissed) | `duration-moderate` (200ms) | `easing-exit` | Instant |
| `ambient` (condition cleared) | `duration-standard` (300ms) | `easing-exit` | Instant |
| `modal` (resolved) | `duration-moderate` (200ms) | `easing-exit` | Instant |
| `blocking` (resolved) | `duration-standard` (300ms) | `easing-exit` | Instant |

---

## State Transition Animations

| State change | Duration | Easing | Notes |
|---|---|---|---|
| Collapsed → expanded | `duration-moderate` (200ms) | `easing-standard` | Height expands; no content clip |
| Expanded → collapsed | `duration-moderate` (200ms) | `easing-standard` | Height contracts |
| Default → loading | `duration-fast` (100ms) | `easing-standard` | Button text replaced with spinner |
| Loading → error | `duration-fast` (100ms) | `easing-standard` | Spinner replaced with error text |
| Resolved → dismissed | `duration-moderate` (200ms) | `easing-exit` | Brief success state (200ms) then exit |

---

## Progressive Escalation Transition

When the system escalates from inline → modal → blocking:
- The prior warning exits with `easing-exit` in `duration-fast` (100ms).
- The new warning enters with its standard entrance animation.
- There is a 50ms gap between exit and entrance — this pause ensures the user perceives the escalation as a change, not a replacement.
- Reduced motion: both transitions are instant; the gap is preserved at 50ms to maintain perceptibility.

---

## Auto-Dismiss Timer Animation

When auto-dismiss is active (informational inline only):
- A progress arc or bar depletes over the configured `autoDismissDelay`.
- Animation: linear easing over the full delay duration.
- Reduced motion: no visual animation; only the `aria-live` countdown announcement is active.

---

## Performance Guidance

- Use CSS `transform` and `opacity` for all animations — these are GPU-composited and do not trigger layout.
- Do not animate `height` directly on warning components larger than ~200px — use `max-height` with `overflow: hidden` and ensure the collapsed state has `max-height: 0`.
- Do not animate `box-shadow` changes (elevation changes during state transitions) — apply elevation changes without animation.

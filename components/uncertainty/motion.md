# Uncertainty Component Motion

**Component category:** Uncertainty
**Phase:** 4
**Status:** stable

---

## Motion Principles

Uncertainty component motion must never create anxiety. State transitions are smooth and informative — they signal that something changed, not that something went wrong. The only exception is the UnresolvableStateCard, which may use a slightly more decisive entrance to register as a terminal state.

---

## Entrance Animations

| Component | Duration | Easing | Reduced-motion |
|---|---|---|---|
| UncertaintyIndicator | `duration-fast` (100ms) | `easing-enter` | Instant |
| ConflictingEvidenceCard | `duration-standard` (300ms) | `easing-enter` | Instant |
| StaleContextBadge | `duration-fast` (100ms) | `easing-enter` | Instant |
| UnresolvableStateCard | `duration-deliberate` (400ms) | `easing-enter` | 100ms fade |

---

## State Transition Animations

| Transition | Duration | Easing | Reduced-motion |
|---|---|---|---|
| HC indicator renders (or appears after state upgrade) | `duration-fast` (100ms) | `easing-enter` | Instant |
| LC/MC → HC (state resolves) | Fade out LC/MC indicator (200ms) + fade in HC (100ms) | `easing-exit` / `easing-enter` | Instant swap |
| SC badge removes (data refreshed) | `duration-standard` (300ms) | `easing-exit` | Instant |
| CE card → MC badge (conflict resolved) | Card fades out (200ms), badge fades in (100ms) | Both transitions | Instant swap |
| UR card → new request | `duration-moderate` (200ms) | `easing-exit` | Instant |

---

## Refresh Animation

When the user clicks Refresh on the StaleContextBadge:
- A spinner replaces the stale date (100ms, `easing-standard`).
- On completion: spinner fades out (100ms), new date fades in (100ms).
- Reduced motion: static "Refreshing..." text; instant swap to result.

---

## Indicator Pulse (Optional)

For deployments that want to draw passive attention to a moderate or low-confidence indicator:
- A subtle pulse animation (opacity 1.0 → 0.7 → 1.0) may be applied once on mount.
- Duration: `duration-long` (600ms), `easing-linear`.
- Maximum: once — the pulse must not loop.
- Reduced motion: pulse is suppressed entirely.

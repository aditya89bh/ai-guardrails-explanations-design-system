# Escalation Component Motion

**Component category:** Escalation
**Phase:** 4
**Status:** stable

---

## Motion Principles

Non-emergency escalation motion is calm and persistent — it does not alarm the user, it informs them. Emergency escalation is the only guardrail component that may use strong entrance motion — it must be impossible to miss.

---

## Emergency Escalation Entrance

The EmergencyEscalationOverlay has the most aggressive motion in the system:

1. **Backdrop fade:** 150ms, `easing-enter`. Overlay covers viewport.
2. **Card entrance:** Slides in from top, 16px travel, 300ms, `easing-enter`. Simultaneously fades from 0 to 1.
3. **Icon pulse:** The critical icon pulses once (opacity 1.0 → 0.6 → 1.0) over 400ms, `easing-linear`.

Total entrance time: 400ms.

Reduced motion:
- Backdrop: 100ms fade (no skip — the overlay must register).
- Card: 100ms fade, no slide.
- Icon pulse: suppressed.

---

## Non-Emergency Escalation Entrance

| Component | Duration | Easing | Reduced-motion |
|---|---|---|---|
| HumanHandoffPanel | `duration-standard` (300ms) | `easing-enter` | Instant |
| RoleEscalationCard | `duration-standard` (300ms) | `easing-enter` | Instant |
| SystemEscalationNotice | `duration-standard` (300ms) | `easing-enter` | Instant |
| AsyncReviewStatus (compact) | `duration-fast` (100ms) | `easing-enter` | Instant |

---

## Status Update Animations

| Transition | Duration | Easing | Reduced-motion |
|---|---|---|---|
| PENDING → ROUTED (spinner starts) | `duration-fast` (100ms) | `easing-standard` | Instant |
| ROUTED → ACCEPTED (spinner → checkmark) | `duration-moderate` (200ms) | `easing-spring` | `duration-fast` |
| IN_RESOLUTION → APPROVED (success state) | `duration-moderate` (200ms) | `easing-spring` | `duration-fast` |
| Any state → DENIED (error state) | `duration-fast` (100ms) | `easing-standard` | Instant |
| Any state → TIMEOUT (warning state) | `duration-moderate` (200ms) | `easing-standard` | Instant |
| Any state → FAILED (error state) | `duration-fast` (100ms) | `easing-standard` | Instant |

---

## Emergency Acknowledgment Exit

When the user acknowledges:
1. Acknowledgment button: scale 1.0 → 0.96 → 1.04 → 1.0 (spring, 200ms) — satisfying confirmation.
2. Pause: 300ms (the user needs to register that their action was accepted).
3. Card exits: fade out, 200ms, `easing-exit`.
4. Backdrop exits: fade out, 300ms, `easing-exit`.

Reduced motion:
- No button spring.
- Card and backdrop: instant removal after 300ms pause.

---

## AsyncReviewStatus Collapse/Expand

When the user minimizes the status to a compact bar:
- Collapse: `duration-moderate` (200ms), `easing-standard`.
- Expand: `duration-moderate` (200ms), `easing-standard`.
- Reduced motion: instant.

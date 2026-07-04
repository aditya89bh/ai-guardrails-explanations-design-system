# Permission Component Motion

**Component category:** Permission
**Phase:** 4
**Status:** stable

---

## Motion Principles

Permission gate motion must communicate that a deliberate decision is being requested. Gates enter with enough presence to be noticed but without alarm. The grant/deny action should feel resolved — the exit is confident, not ambiguous.

---

## Entrance Animations

| Component | Duration | Easing | Reduced-motion |
|---|---|---|---|
| PermissionGate (modal) | `duration-deliberate` (400ms) | `easing-enter` | Instant |
| ScopedPermissionGate | `duration-deliberate` (400ms) | `easing-enter` | Instant |
| DelegatedPermissionRequest | `duration-standard` (300ms) | `easing-enter` | Instant |
| PermissionRevocationNotice | `duration-standard` (300ms) | `easing-enter` + assertive | 100ms fade (revocation should register) |

---

## Exit Animations

| Event | Duration | Easing | Reduced-motion |
|---|---|---|---|
| Grant confirmed | `duration-moderate` (200ms) | `easing-exit` | Instant |
| Deny / dismiss | `duration-moderate` (200ms) | `easing-exit` | Instant |
| Gate timeout | `duration-fast` (100ms) | `easing-exit` | Instant |

---

## State Transition Animations

| Transition | Duration | Easing | Reduced-motion |
|---|---|---|---|
| Checkbox unchecked → checked (risk ack.) | `duration-fast` (100ms) | `easing-standard` | Instant |
| Confirm button: aria-disabled → active | `duration-fast` (100ms) | `easing-standard` | Instant |
| Delegation status: PENDING → APPROVED | `duration-moderate` (200ms) | `easing-spring` | `duration-fast` (100ms) |
| Delegation status: PENDING → DENIED | `duration-fast` (100ms) | `easing-standard` | Instant |

---

## Denial Feedback Motion

When the user clicks Deny or Escape fires, a subtle feedback animation confirms the denial:
- The deny button briefly scales to 0.96 and back (100ms, `easing-spring`).
- No shake or bounce — too alarming.
- Reduced motion: no animation; only the button state change.

---

## Scope Visualizer Animation

For ScopedPermissionGate, the scope items fade in sequentially:
- First item: 0ms delay.
- Each subsequent item: +30ms delay.
- Each item: `duration-fast` (100ms) fade, `easing-enter`.
- Total: capped at 300ms regardless of item count.
- Reduced motion: all items appear simultaneously, instant.

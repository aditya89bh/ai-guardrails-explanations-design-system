# Escalation Component Accessibility

**Component category:** Escalation
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## ARIA Roles and Attributes

| Component | ARIA role | Key attributes |
|---|---|---|
| HumanHandoffPanel | `role="status"` | `aria-live="polite"`, `aria-atomic="false"` |
| RoleEscalationCard | `role="status"` | `aria-live="polite"` |
| SystemEscalationNotice | `role="status"` | `aria-live="polite"` |
| EmergencyEscalationOverlay | `role="alertdialog"` | `aria-modal="true"`, `aria-live="assertive"`, `aria-labelledby="[emergency-title-id]"`, `aria-describedby="[detection-statement-id]"` |
| AsyncReviewStatus | `role="status"` | `aria-live="polite"`, `aria-atomic="true"` |
| Acknowledge control (emergency) | `<button>` | `aria-label="Acknowledge critical alert"` |
| Withdraw control | `<button>` | `aria-label="Withdraw [escalation type] request"` |
| Status updates | `<p>` within live region | Text updates trigger screen reader announcement |

---

## Screen Reader Announcements

| Event | Announcement |
|---|---|
| HumanHandoffPanel: ROUTING | "Connecting you with [handler role]. Reference: [ID]." |
| HumanHandoffPanel: ACCEPTED | "[Handler role] has accepted your request." |
| HumanHandoffPanel: TIMEOUT | "No response received. [Next options]." |
| RoleEscalationCard: PENDING | "Awaiting approval from [role]." |
| RoleEscalationCard: APPROVED | "[Role] approved. Proceeding." |
| RoleEscalationCard: DENIED | "[Role] denied. [Next options]." |
| EmergencyEscalationOverlay mounts | "CRITICAL ALERT: [detection statement]. [Who notified]. [Immediate actions]. Acknowledge to continue." |
| AsyncReviewStatus: update | "Review status: [new status]." |
| AsyncReviewStatus: APPROVED | "Review approved. Proceeding." |

---

## Emergency Escalation — Full Keyboard Capture

When EmergencyEscalationOverlay is active:
- `Tab` does not cycle — focus is locked to the acknowledgment button.
- `Shift+Tab` does not move focus out.
- `Escape` has no effect.
- All background elements are `aria-hidden="true"` and `tabindex="-1"`.
- The only operable control is `[ACKNOWLEDGE]`.

This is the only component in the system that fully suppresses standard keyboard navigation. This behavior is required for the emergency pattern — a partial acknowledgment path is a safety failure.

---

## Focus Order

**Non-emergency escalation:** Components do not capture focus. Status updates are announced live. Interactive controls (Withdraw, View Details) are in the natural tab flow.

**EmergencyEscalationOverlay:** Focus is captured on mount to the acknowledgment control. All other focus targets are removed from the tab sequence.

**Post-escalation:** On RESOLVED_APPROVED, focus moves to the RetryPrompt's primary action. On RESOLVED_DENIED, focus moves to the RedirectSuggestion's first alternative.

---

## Color and Contrast

- Emergency overlay uses `severity-critical` tokens — all critical-severity contrast requirements apply.
- Status indicators (PENDING, APPROVED, DENIED) use icon + text — not color-only.
- Role chain display uses both typographic weight and label, not color alone.

---

## Reduced Motion

- EmergencyEscalationOverlay entrance: `duration-deliberate` reduced to `100ms` (still needs some motion to draw attention — pure instant is acceptable).
- Non-emergency escalation component entrance: instant.
- Status spinner: replaced with static "Processing..." text.
- Approval/denial transition animation: instant.

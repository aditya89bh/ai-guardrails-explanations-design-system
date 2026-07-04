# Escalation Interaction Model

**Component category:** Escalation
**Phase:** 4
**Status:** stable

---

## Interaction Principles

1. **Emergency escalation captures all user focus immediately.** When EmergencyEscalationOverlay renders, focus moves to the acknowledgment control and all background interactions are disabled. This is non-negotiable.
2. **Non-emergency escalation does not block workflow.** Human handoff, role escalation, and async review components are non-blocking by default. The user may continue other tasks while waiting.
3. **Status is always live.** Escalation components reflect the current state machine state. The user never needs to refresh to see whether their escalation was accepted or denied.
4. **Withdrawal is always available until the escalation is accepted.** Users can withdraw PENDING or ROUTED escalations. Once ACCEPTED (a human or system has taken ownership), withdrawal must be handled through the handler — the AI cannot unilaterally recall it.

---

## Emergency Escalation Interaction (interrupt mode)

```
Condition detected →
EmergencyEscalationOverlay renders at priority-escalation
All background elements: pointer-events-none, aria-disabled
Focus moves to: [ACKNOWLEDGE] button (the only interactive element)

User reads emergency details
User presses [ACKNOWLEDGE] (click, tap, or Enter/Space)
  → onAcknowledge fires
  → Overlay begins exit transition
  → System returns to appropriate post-emergency state
  → Focus returns to most logical workflow position
```

**The Escape key does not close EmergencyEscalationOverlay.** Only the acknowledgment control closes it.

### Emergency Keyboard Interactions

| Key | Result |
|---|---|
| `Tab` | No cycle — focus stays on acknowledgment control |
| `Enter` / `Space` | Fires `onAcknowledge` |
| `Escape` | No effect |
| Any other key | No effect |

---

## Mouse and Pointer Interactions

| Interaction | Target | Result |
|---|---|---|
| Click ACKNOWLEDGE | Emergency acknowledgment | `onAcknowledge` fires |
| Click status detail | AsyncReviewStatus | Expands review detail |
| Click Withdraw | Any non-emergency escalation | `onWithdraw` fires |
| Click view reference | HumanHandoffPanel | Shows full context summary |

---

## Keyboard Interactions (non-emergency)

| Key | Context | Result |
|---|---|---|
| `Tab` | Within escalation card | Cycles interactive elements |
| `Enter` / `Space` | On Withdraw | `onWithdraw` fires |
| `Enter` / `Space` | On View Details | Expands detail section |
| `Escape` | No effect — escalation states do not close on Escape | |

### Focus Management

**Non-emergency escalation mount:** Focus does not auto-move to the escalation component on mount — the user's workflow is not interrupted. The component renders in a persistent status area without capturing focus.

**Emergency escalation mount:** Focus is captured immediately. See emergency section above.

**On escalation RESOLVED_APPROVED:** Focus moves to the recovery component (RetryPrompt) that renders to indicate the original action can now proceed.

**On escalation RESOLVED_DENIED:** Focus moves to the RedirectSuggestion component.

---

## Touch Interactions

| Gesture | Target | Result |
|---|---|---|
| Tap ACKNOWLEDGE | Emergency button | `onAcknowledge` fires |
| Tap Withdraw | Withdraw button | `onWithdraw` fires |
| Tap status detail | Status area | Expands detail |

---

## AsyncReviewStatus Persistence

The AsyncReviewStatus renders as a persistent component (status bar or card) that remains visible while the review is in progress. It does not interrupt workflow. The user can:
- Minimize it (collapse to a compact status bar).
- Expand it to see full review detail.
- Withdraw the review while it is IN_REVIEW.

When the review resolves:
- APPROVED: card shows success; auto-transitions to recovery (retry or continuation).
- DENIED: card shows denial; redirect recovery options appear.
- The card persists for 5 seconds after resolution, then exits with `easing-exit`.

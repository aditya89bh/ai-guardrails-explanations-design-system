# Escalation Component Specification

**Implements patterns:** Human handoff (escalation), role escalation, system escalation, emergency escalation, async review escalation
**Phase:** 4
**Status:** stable
**Decision engine reference:** `docs/decision-flows/state-transition-engine.md` § Escalation State Machine

---

## Purpose

Escalation components manage the user experience of the escalation lifecycle: from initiation through routing, acceptance, resolution, and return to workflow. They must give the user a clear sense of status at every stage — escalation opacity is a trust failure.

Emergency escalation components have unique requirements: they must be impossible to miss, impossible to dismiss without acknowledgment, and must not require the user to navigate to find them.

---

## Component Variants

| Variant | Escalation pattern | Blocking | Has status updates |
|---|---|---|---|
| `human-handoff` | `human-handoff` (escalation) | No (workflow continues) | Yes |
| `role-escalation` | `role-escalation` | Partial (blocked step only) | Yes |
| `system-escalation` | `system-escalation` | Partial (automated) | Yes |
| `emergency` | `emergency-escalation` | Yes (interrupt) | Yes (urgent) |
| `async-review` | `async-review-escalation` | No (background) | Yes (persistent) |

---

## Anatomy

### HumanHandoffPanel

```
[Icon-escalation] [Title: "Connecting you with a human"]
[Context summary: what was transferred]
[Handler role and expected channel]
[Reference ID]
[Status: ROUTING → CONNECTED → IN_RESOLUTION]
[Timeline estimate]
[Cancel or withdraw]
[Audit indicator]
```

Named parts:
- **context-summary** — What information was transferred to the handler. The user must know what the handler has. Required.
- **handler-role** — Role (not personal name) of the handler. Required.
- **reference-id** — Unique identifier the user can use to follow up. Required.
- **status-indicator** — Live status display. Updates when handler accepts or acts.
- **timeline-estimate** — Expected response time, if available.
- **withdraw-control** — Allows cancellation while ROUTING or ROUTED; disabled after ACCEPTED.

### RoleEscalationCard

```
[Icon-escalation] [Title: "Approval needed from [role]"]
[What requires approval]
[Current role → Required role]
[Status: PENDING → APPROVED / DENIED]
[Cancel request]
[If denied: redirect recovery option]
[Audit indicator]
```

Named parts:
- **approval-statement** — What the escalation is seeking approval for. Required.
- **role-chain** — Visual display of current role → required role. Required.
- **approval-status** — Status indicator with auto-update.
- **denial-recovery** — Shown when DENIED: offers redirect or abandon recovery options.

### EmergencyEscalationOverlay

```
[Full viewport, priority-escalation elevation]
[Critical severity icon — large]
[Emergency header: "CRITICAL ALERT"]
[What was detected]
[Who has been notified]
[Immediate actions user can take]
[Acknowledgment required: [ACKNOWLEDGE] button]
[Cannot dismiss until acknowledged]
[Audit indicator — prominent]
```

Named parts:
- **emergency-header** — High-contrast full-width header. Severity: critical. Required.
- **detection-statement** — What the system detected that triggered the emergency. Required.
- **notification-list** — Who has been notified (by role, not personal name). Required.
- **immediate-actions** — What the user can do right now. Required; must not be empty.
- **acknowledgment-control** — Required. The overlay cannot be dismissed without explicit acknowledgment. This is the only control that closes the overlay.
- **audit-indicator** — Displayed prominently. Emergency events require the most complete audit trail.

**EmergencyEscalationOverlay does not have a cancel or close control.** The only resolution is acknowledgment.

### AsyncReviewStatus

```
[Compact card or status bar]
[Icon] [Review in progress: [what is being reviewed]]
[Submitted: [datetime]] [Expected: [SLA datetime]]
[Status: IN_REVIEW → APPROVED / DENIED]
[View details] [Withdraw]
```

Named parts:
- **review-summary** — What is under review. Required.
- **submission-time** — When the review was submitted. Required.
- **sla-display** — Expected resolution time. Required when SLA is defined.
- **status** — Current status. Auto-updates.
- **details-link** — Expands to full escalation context.
- **withdraw-control** — Withdraws the async review while it is still in IN_REVIEW state.

---

## Input Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | Variant enum | Yes | Escalation type |
| `escalationId` | `string` | Yes | Unique identifier |
| `escalationReason` | `string` | Yes | Why escalation was triggered |
| `escalationState` | Escalation state enum | Yes | Current state machine state |
| `handlerRole` | `string` | Handoff, role | Handler/approver role |
| `contextSummary` | `string` | Handoff | What was transferred |
| `referenceId` | `string` | Handoff | User-facing reference ID |
| `approvalStatement` | `string` | Role escalation | What requires approval |
| `roleChain` | `{ current, required }` | Role escalation | Role progression |
| `emergencyDetails` | `EmergencyDetails` | Emergency | Detection, notification list, actions |
| `reviewSummary` | `string` | Async review | What is under review |
| `submittedAt` | `Date` | Async review | Submission timestamp |
| `slaDeadline` | `Date` | Async review | SLA deadline |
| `onStateChange` | `(newState) => void` | Yes | Called when escalation state updates |
| `onWithdraw` | `() => void` | Non-emergency | Called on withdrawal |
| `onAcknowledge` | `() => void` | Emergency | Called on acknowledgment |
| `auditId` | `string` | Yes — all | All escalations require audit |

---

## Output / Callbacks

| Callback | Trigger | Payload |
|---|---|---|
| `onStateChange` | External state update received | `{ escalationId, previousState, newState, timestamp, auditId }` |
| `onWithdraw` | User withdraws request | `{ escalationId, state, timestamp, auditId }` |
| `onAcknowledge` | User acknowledges emergency | `{ escalationId, timestamp, auditId }` |
| `onMount` | Component renders | `{ variant, escalationId, escalationState, auditId }` |

---

## States

Maps directly to the Escalation State Machine states in `docs/decision-flows/state-transition-engine.md`:

| UI state | Machine state | Visual |
|---|---|---|
| `routing` | PENDING, ROUTED | Spinner; "Routing..." label |
| `accepted` | ACCEPTED | Handshake or checkmark icon; handler role shown |
| `in-resolution` | IN_RESOLUTION | Progress indicator; "In progress" label |
| `approved` | RESOLVED_APPROVED | Success icon; brief positive state before transition to recovery |
| `denied` | RESOLVED_DENIED | Gentle error state; redirect recovery options shown |
| `timeout` | TIMEOUT | Warning state; "No response" message; next-tier routing option |
| `failed` | FAILED | Error state; abandon or redirect recovery |

---

## Emergency Escalation — Priority Override

`EmergencyEscalationOverlay` renders at `priority-escalation`, above all other components including open permission gates and modals. When an emergency escalation triggers:

1. All other interactive components are disabled (aria-disabled, pointer-events-none).
2. Focus is forcibly moved to the acknowledgment control.
3. The overlay cannot be closed by pressing Escape.
4. No other user action is possible until acknowledgment is recorded.

This behavior is not configurable. Enterprise deployments may customize the visual style but not the acknowledgment requirement.

---

## Related Patterns

- `patterns/escalation/human-handoff.md`
- `patterns/escalation/role-escalation.md`
- `patterns/escalation/system-escalation.md`
- `patterns/escalation/emergency-escalation.md`
- `patterns/escalation/async-review-escalation.md`

## Related Decision Engine Rules

- `docs/decision-flows/state-transition-engine.md` § Escalation State Machine
- `docs/decision-flows/pattern-precedence-engine.md` § Escalation Intra-Category Precedence
- `docs/decision-flows/pattern-composition-engine.md` § Escalation + Recovery

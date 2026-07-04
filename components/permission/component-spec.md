# Permission Component Specification

**Implements patterns:** One-time permission, session permission, persistent permission, scoped permission, delegated permission, revocation
**Phase:** 4
**Status:** stable
**Decision engine reference:** `docs/decision-flows/pattern-selection-engine.md` § Permission Category Selection

---

## Purpose

Permission components present the user with a structured, explicit authorization decision. They must not proceed past the gate without an explicit user action — passive dismissal equals denial, per the permission pattern specification. They must explain what is being authorized in plain language before presenting the grant/deny controls.

---

## Component Variants

| Variant | Renders as | Gate type | Persistence |
|---|---|---|---|
| `one-time` | Inline or minimal dialog | Soft gate | Single use |
| `session` | Compact dialog | Standard gate | Session duration |
| `persistent` | Full dialog with scope display | Standard gate | Across sessions |
| `scoped` | Dialog with scope visualizer | Standard gate | Scope-bound |
| `delegated` | Dialog with pending state | Delegated gate | Until delegate acts |
| `revocation` | Notice banner | Not a gate | Terminates grant |

---

## Anatomy

### PermissionGate (standard)

```
┌──────────────────────────────────────────────┐
│  [Icon-permission-gate]  [Title]             │
│  ─────────────────────────────────────────   │
│  [What is being authorized — plain language] │
│  [Why it is needed — one sentence]           │
│  [Scope / duration display]                  │
│  ─────────────────────────────────────────   │
│  [Deny]                          [Grant]     │
│  [Audit indicator]                           │
└──────────────────────────────────────────────┘
```

Named parts:
- **gate-icon** — `icon-permission-gate`. Required.
- **gate-title** — Heading: what action is being authorized. Required.
- **authorization-statement** — Plain language description of what the AI will do if granted. Required; must be specific, not generic ("The AI will send this draft to your email client" not "The AI needs permission").
- **rationale-statement** — One sentence explaining why this permission is needed. Required.
- **scope-display** — Shows the scope, duration, or specific resources affected. Required for scoped and persistent; optional for one-time and session.
- **grant-control** — Primary action. Label must describe the grant: "Allow once", "Allow for this session", "Allow always", not generic "OK" or "Continue".
- **deny-control** — Secondary action. Label: "Don't allow". Required on all gates.
- **audit-indicator** — Required on all permission gates. Every authorization decision is audit-relevant.

### ScopedPermissionGate

Extends the standard gate with a **scope-visualizer** — a visual display of the exact resources (files, datasets, APIs, time windows) the permission covers. The scope-visualizer renders as a bordered list or tag group.

### DelegatedPermissionRequest

```
┌──────────────────────────────────────────────┐
│  [Icon-escalation]  [Title]                  │
│  [Authorization statement]                   │
│  [Delegate role: who will be asked]          │
│  [Status: Pending / Approved / Denied]       │
│  [Cancel request]         [Status indicator] │
└──────────────────────────────────────────────┘
```

Additional named parts:
- **delegate-role** — Displays who the delegate is (by role, not personal identity, in most configurations).
- **status-indicator** — `PENDING` (spinner), `APPROVED` (success), `DENIED` (error). Auto-updates when delegate acts.
- **cancel-control** — Allows user to withdraw the delegation request while it is PENDING.

### PermissionRevocationNotice

```
[Icon-permission-revoked] [Revocation message] [What this means for the user]
```

Not a gate — a notice that a prior permission has been revoked. Renders as a banner. No grant/deny controls. May include a "Re-authorize" action if re-authorization is permitted by the deployment configuration.

---

## Input Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | Variant enum | Yes | Gate type |
| `gateId` | `string` | Yes | Unique identifier for this gate instance |
| `actionLabel` | `string` | Yes | What action is being authorized (plain language) |
| `rationale` | `string` | Yes | Why this permission is needed |
| `scope` | `PermissionScope` | Scoped variant | Resources/time/actions covered |
| `duration` | `'once' \| 'session' \| 'persistent'` | Yes | Permission duration |
| `delegateRole` | `string` | Delegated variant | Role of the delegate |
| `delegateStatus` | `'pending' \| 'approved' \| 'denied'` | Delegated variant | Current delegation status |
| `revocationReason` | `string` | Revocation variant | Why the permission was revoked |
| `onGrant` | `(gateId: string) => void` | Yes (non-revocation) | Called when user grants |
| `onDeny` | `(gateId: string) => void` | Yes (non-revocation) | Called when user denies |
| `onCancel` | `(gateId: string) => void` | Delegated | Called when user cancels pending delegation |
| `auditId` | `string` | Yes — all gates | All permission decisions require audit logging |

---

## Output / Callbacks

| Callback | Trigger | Payload |
|---|---|---|
| `onGrant` | User explicitly grants | `{ gateId, variant, duration, scope?, timestamp, auditId }` |
| `onDeny` | User explicitly denies | `{ gateId, variant, timestamp, auditId }` |
| `onDismiss` | User dismisses without action (equals deny — see pattern spec) | `{ gateId, variant, timestamp, auditId, dismissedWithoutAction: true }` |
| `onDelegateStatusChange` | Delegate acts | `{ gateId, delegateStatus, timestamp, auditId }` |
| `onMount` | Gate renders | `{ gateId, variant }` — for audit trail initialization |

**Passive dismissal rule:** If the user closes or navigates away from a gate without explicitly granting, the `onDismiss` callback fires with `dismissedWithoutAction: true`, which the system treats as denial. No permission is granted. This behavior is not configurable — it is a security invariant of the permission system.

---

## States

| State | Trigger | Visual treatment |
|---|---|---|
| `waiting` | Gate rendered, user has not acted | Default appearance |
| `granted` | User clicked Grant | Brief success animation, gate closes |
| `denied` | User clicked Deny or dismissed | Brief denial state, gate closes |
| `pending` | Delegated — awaiting delegate | Spinner on status indicator |
| `delegate-approved` | Delegate approved | Status indicator: success |
| `delegate-denied` | Delegate denied | Status indicator: error |
| `expired` | Gate timeout elapsed | Treated as denial; gate closes |
| `error` | System error on grant attempt | Error message in gate; retry option |

---

## Visual Hierarchy

Permission gates render at `priority-modal` with `elevation-3`. They always appear above content and warning banners. Emergency escalation components at `priority-escalation` may appear above a permission gate if an emergency occurs while the gate is open.

---

## Audit Requirements

Every permission gate must produce an audit record at render time (gate shown), at resolution time (granted, denied, dismissed), and at expiration time if applicable. The `auditId` prop links these events. The component fires the `onMount` callback at render for audit initialization — the hosting system is responsible for writing the audit record.

---

## Related Patterns

- `patterns/permission/one-time-permission.md`
- `patterns/permission/session-permission.md`
- `patterns/permission/persistent-permission.md`
- `patterns/permission/scoped-permission.md`
- `patterns/permission/delegated-permission.md`
- `patterns/permission/revocation.md`

## Related Decision Engine Rules

- `docs/decision-flows/pattern-selection-engine.md` § Permission Category Selection
- `docs/decision-flows/pattern-selection-engine.md` § Gate type calibration by Risk × Business Impact
- `docs/decision-flows/pattern-precedence-engine.md` § Permission Intra-Category Precedence
- `docs/decision-flows/pattern-composition-engine.md` § Standard Composition Template B

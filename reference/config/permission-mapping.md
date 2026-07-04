# Permission Mapping

**Document type:** Configuration reference
**Consumes:** `docs/decision-flows/decision-primitives.md` § P4, P8, `patterns/permission/`
**Phase:** 6
**Status:** stable

---

## Purpose

Defines the P4 permission model, authority tiers (P8), the six permission pattern types, and the lifecycle rules that govern permission states. Use this document when configuring `permissionConfig` in a deployment policy.

---

## Authority Tiers (P8)

| Tier | Label | Capabilities | Typical roles |
|---|---|---|---|
| 1 | Standard | Can request actions within configured scope. Cannot self-authorize consequential actions. Cannot override policy blocks. | End user, customer, standard employee, autonomous agent (Tier 1 ceiling) |
| 2 | Power user | Can approve actions within their defined authority ceiling. Can initiate delegation requests. Can authorize routine exceptions with audit record. | Supervisor, licensed professional, HRBP, adjuster, procurement manager |
| 3 | Admin / executive | Can authorize policy exceptions. Can approve cross-scope access. Can reset AI advisory modes after safety incidents. | Admin, VP, compliance officer, fraud operations team, safety officer |

---

## Permission States (P4)

| State | Definition | Effect |
|---|---|---|
| Authorized | User/agent is fully authorized for the requested action | No permission gate renders |
| Unauthorized | User/agent lacks authorization for the requested action | Permission gate or policy block activates |
| Partial | User/agent is authorized for part of the requested action | Scoped-permission gate activates; partial output may proceed |
| Expired | A previously granted permission has passed its expiry | Revocation notice renders; re-authorization required |

---

## Permission Pattern Types and When Each Applies

### One-Time Permission
**Pattern:** `one-time-permission`
**When:** The AI is about to take a single, isolated consequential action that is not covered by the user's standing authorization.
**Scope:** Single action, single session turn.
**Expiry:** Consumed on use — cannot be reused.
**Audit:** Action, user identity, grant/deny decision, timestamp.

**Example:** Agent sends a file to an external system for the first time in a session.

---

### Session Permission
**Pattern:** `session-permission`
**When:** The AI needs recurring authorization for the same action type throughout a session.
**Scope:** Current session only. Expires on session end.
**Expiry:** Session end or explicit revocation.
**Audit:** Session ID, scope, grant/deny, session start/end.

**Example:** Agent accesses calendar data throughout a work session.

---

### Persistent Permission
**Pattern:** `persistent-permission`
**When:** The user wants to grant standing authorization for a recurring action type across sessions.
**Scope:** Configurable — may cover specific action types, data categories, or resource types.
**Expiry:** Configurable maximum (`persistentPermissionExpiryDays`). Must not be indefinite.
**Audit:** Grant scope, user identity, effective date, expiry date, revocation events.

**Example:** User authorizes the agent to access their document library permanently until revoked.

---

### Scoped Permission
**Pattern:** `scoped-permission`
**When:** The user or agent is authorized for a subset of the requested action — not the full scope.
**Scope:** Defined by the deployment's role map and business unit structure.
**Expiry:** Follows the underlying authorization model (session or persistent).
**Audit:** Scope boundaries, requesting entity, authorizing entity, boundary violation event.

**Example:** HRBP accesses employee data only within their assigned business unit.

---

### Delegated Permission
**Pattern:** `delegated-permission`
**When:** A Tier 2 or Tier 3 authority grants a Tier 1 entity permission to act outside their normal scope for a defined purpose and expiry.
**Scope:** Must specify: delegating entity, receiving entity, purpose, resource/action boundary, expiry.
**Expiry:** Required. Default: 48 hours. Cannot be indefinite.
**Audit:** Delegating entity identity, receiving entity identity, purpose, scope, grant timestamp, expiry timestamp, use events, revocation event if applicable.

**Example:** BU-B HRBP grants BU-A HRBP access to one employee's record for a defined purpose.

---

### Revocation
**Pattern:** `revocation`
**When:** A previously granted permission is withdrawn before its natural expiry.
**Scope:** Applies to the specific grant being revoked.
**Effect:** Any ongoing activity using the revoked permission must stop immediately. If mid-action: the action is halted, not completed.
**Audit:** Grant ID being revoked, revoking entity, revocation timestamp, reason, effect on in-progress operations.

**Example:** Admin revokes a delegated permission after a security review determines the access was broader than intended.

---

## Invariant Rules

These rules apply in all deployments and cannot be overridden:

1. **Passive dismissal equals denial.** Closing a permission request without clicking Grant equals a denial. This applies to all permission pattern types.
2. **Deny-first keyboard order.** The deny/decline action must be the first Tab stop in all permission gate components.
3. **No auto-grant.** The AI system must never automatically grant permission to itself. All grants require explicit user action.
4. **Delegation requires scope and expiry.** A delegation grant without an explicit scope definition and expiry timestamp is invalid.
5. **Override scope is per-transaction.** A manual override authorization applies to exactly one transaction. The agent's standing authorization level does not change after an override.
6. **Revocation is immediate.** Revocation takes effect at the moment of the revocation event, not at the next session start.

---

## Permission Lifecycle State Machine

```
[No permission]
     │
     ├── [User grants one-time]  ──→ GRANTED (one-time) ──→ CONSUMED (on use)
     │
     ├── [User grants session]   ──→ GRANTED (session) ──────────────────────┐
     │                                                                         │
     ├── [User grants persistent] ─→ GRANTED (persistent) ────────────────────┤
     │                                                                         │
     ├── [Delegating entity grants] ─→ GRANTED (delegated) ──────────────────┤
     │                                                                         │
     └── [User denies / passively dismisses] ──→ DENIED                       │
                                                                               │
     ┌─────────────────────────────────────────────────────────────────────────┘
     │
GRANTED state:
     │
     ├── [Expiry reached] ──→ EXPIRED ──→ re-authorization required
     │
     ├── [Revocation event] ──→ REVOKED ──→ in-progress actions halted
     │
     └── [Grant consumed (one-time)] ──→ CONSUMED ──→ new grant required for next action
```

# Revocation

**Category:** Permission gate
**Sub-type:** Revocation
**Severity:** Informational (Level 0) — user-initiated; Caution (Level 2) — system or admin-initiated
**Status:** stable
**Phase:** 2C

---

## Problem It Solves

Permission grants are only meaningful if they can be undone. A user who granted session permission to an AI in a context that has since changed — a different project, a different risk level, a different audience — needs to be able to withdraw that authorization cleanly and immediately. An administrator who discovers that a persistent permission was granted inappropriately needs to revoke it without disrupting unrelated permissions. Revocation closes the control loop: it ensures that permissions are genuinely temporary or contingent when designed to be, and that the system responds correctly when authorization is withdrawn.

---

## Definition

Revocation is the act of withdrawing a previously granted permission — one-time (cancelled before execution), session, persistent, scoped, or delegated. A revocation immediately terminates the AI's authorization to perform the actions covered by the revoked permission. Actions already completed under the permission are not reversed; actions not yet executed under the permission are blocked.

---

## When to Use

Revocation is always available when a permission has been granted. It applies in three scenarios:

**User-initiated revocation:** The user who granted the permission withdraws it because their intent, context, or needs have changed.

**Admin-initiated revocation:** A system administrator revokes a permission because of a policy change, role change, security incident, or compliance finding.

**System-initiated revocation:** The system automatically revokes a permission when a pre-configured condition is met — policy-driven expiry, role change, session end (for session permissions), or scope-invalidating event (e.g., the resource the permission was scoped to has been deleted).

---

## When Not to Use

Revocation is not a pattern that is "used" — it is always available as a control mechanism. The question is not whether to implement revocation, but how to surface it, communicate it, and enforce it correctly.

---

## Trigger Conditions

**User-initiated:**
- User accesses permission settings and selects a permission to revoke
- User clicks a revocation control in the session permission banner or activity log
- User types a revocation instruction to the AI in the conversation

**Admin-initiated:**
- Administrator takes action in the tenant permission management panel
- Administrator's incident response workflow triggers permission revocation

**System-initiated:**
- Session ends (session permissions expire automatically)
- Policy-configured expiry date is reached (persistent permissions)
- User's role changes and the new role does not support the previously granted permission scope
- The resource a scoped permission was bound to is deleted, archived, or reclassified
- Inactivity-based expiry (a persistent permission has not been used within the configured dormancy window)

---

## Permission Scope of Revocation

Revocation is always permission-specific. Revoking one permission does not affect other permissions. The scope of revocation must be:
- **Named:** The specific permission being revoked must be identified to the user or admin revoking it
- **Immediate:** Revocation takes effect immediately — there is no grace period or deferred revocation
- **Confirmed:** The revoker receives a confirmation that the revocation has been processed

Revocation does not include rollback of actions already performed under the permission. Rollback is the domain of recovery flows, not permission revocation.

---

## User Action Required

**User-initiated revocation:**
1. Navigate to the permission management interface (Settings → AI Permissions or equivalent)
2. Identify the permission to revoke
3. Click "Revoke" and confirm in a lightweight confirmation step
4. Receive confirmation that the permission is revoked

Or, in-context:
1. Click the revocation control in the session permission banner or activity log entry
2. Confirm in a lightweight confirmation step

**Admin-initiated revocation:**
1. Access the tenant permission management panel
2. Search or filter to the target permission
3. Revoke and confirm
4. A notification is sent to the affected user

**System-initiated revocation:**
No user action required to trigger it. The affected user receives a notification explaining why the permission was revoked.

---

## Explanation Requirements

**User-initiated revocation confirmation:**
- What permission was revoked (name and scope)
- That it is effective immediately
- What will happen next for covered actions (they will now prompt or be blocked)

**Admin-initiated revocation notification (to affected user):**
- What permission was revoked
- Why (policy change, role change, security review — at whatever level of disclosure policy permits)
- What to do if they need to re-establish the permission

**System-initiated revocation notification (to affected user):**
- What permission expired or was automatically revoked
- Why (expiry, role change, resource deletion)
- How to re-grant if needed and appropriate

---

## Copywriting Guidance

**User-initiated revocation confirmation:**
> "Knowledge base posting permission revoked.
> Future posts will require your confirmation before each one.
> [Undo — restore this permission] [Done]"

Note: "Undo" to restore is a convenience — it should not allow restoration without re-reviewing the scope. If "Undo" is offered, it must take the user back through the grant flow, not silently restore the permission.

**Admin-initiated revocation notification:**
> "Your 'Analytics database query' permission has been revoked by your system administrator.
> Reason: Quarterly access review — please re-request access if needed for your role.
> Contact your administrator or [Request re-authorization ↗] to restore access."

**System-initiated revocation notification (role change):**
> "Your 'Customer PII read' permission has been automatically revoked. Your role was updated and this permission is no longer within your access level.
> If you believe this is incorrect, contact your administrator."

**System-initiated revocation notification (expiry):**
> "Your 'Vendor contract read' session permission has expired. This session has ended.
> Start a new session to re-authorize as needed."

---

## Accessibility Requirements

- **Permission management interface:** Must be fully keyboard navigable. Each listed permission must have a keyboard-accessible revocation control.
- **Confirmation step:** Revocation confirmation dialog uses `role="dialog"` with appropriate focus management.
- **Notifications:** System and admin-initiated revocation notifications must be surfaced through accessible channels — in-app notifications with `aria-live="polite"`, plus email for persistent permission revocations.
- **Immediate feedback:** After revocation, a visible, screen-reader-accessible confirmation must be displayed without requiring the user to navigate away.

---

## Enterprise Audit Considerations

**Audit logging:** Required for all revocation events regardless of initiator. Log:
- Permission revoked (name, scope, original grant date)
- Initiator of revocation (user / admin / system) with identifier
- Reason for revocation (where applicable)
- Timestamp
- Notification sent to affected user (yes/no, channel)

**Admin audit trail:** Admin-initiated revocations must be attributable to a specific administrator. Anonymous or system-wide admin actions that revoke individual user permissions must still record the initiating administrator's identity.

**System-initiated revocation audit:** When the system triggers automatic revocation (role change, expiry, resource deletion), the triggering event must be recorded in the audit log as a causal reference alongside the revocation event.

**Notification delivery audit:** In regulated contexts, the system must log that the affected user was notified of a revocation — not just that the revocation occurred.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Revocation not immediate | Revocation is queued or delayed; the permission continues to function briefly after revocation | Actions execute after user has revoked; loss of control; potential security or compliance incident |
| No revocation interface | Permissions can be granted but not revoked by the user | Users are permanently committed to authorizations they can no longer withdraw |
| Silent revocation | Admin or system revokes a permission without notifying the affected user | User is unaware their permission was revoked; they expect authorized actions to proceed and are confused when they do not |
| Revocation rolls back completed actions | System reverses actions that were legitimately performed under the permission before revocation | Unauthorized data modification; unintended side effects; user work is destroyed |
| Partial revocation | Revocation is applied to some instances of the permission but not others (e.g., session permission revoked in one interface but still active in another) | Permission scope is inconsistent; actions proceed in some contexts but not others |

---

## Recovery Path

Revocation itself does not require a recovery flow — it is the intentional termination of a permission. If a user revoked a permission by mistake:
- The "Undo" option (if offered) takes the user back through the grant flow
- The user can re-grant the permission through the standard permission grant flow for that permission type

If a system-initiated revocation was triggered by a false condition (e.g., a role change notification was erroneous):
- The user contacts their administrator to correct the role record and re-grant the permission
- The erroneous revocation event is annotated in the audit log

---

## Related Patterns

- **[One-time permission](one-time-permission.md)** — One-time permissions expire on use; revocation applies to cancelling before execution
- **[Session permission](session-permission.md)** — Session permissions auto-revoke at session end; user-initiated revocation is mid-session
- **[Persistent permission](persistent-permission.md)** — The primary use case for deliberate user-initiated and admin-initiated revocation
- **[Scoped permission](scoped-permission.md)** — Scope-invalidating events (resource deletion, reclassification) trigger system-initiated revocation
- **[Delegated permission](delegated-permission.md)** — Denial of a pending delegated permission request is a form of revocation before the action was ever authorized

---

## Example Scenario

**Context:** An enterprise AI assistant is managing tasks on behalf of a sales operations manager. The manager granted session permission for the AI to update deal stages in the CRM. Mid-session, the manager realizes the AI has been updating deals in a pipeline that belongs to a different team — the scope was broader than intended.

**User-initiated mid-session revocation:**

In the session activity log, the manager clicks "Revoke CRM update permission."

> "Revoke session permission for CRM deal stage updates?
>
> This will stop all CRM updates for the rest of this session. Updates already made will not be reversed.
>
> [Revoke permission] [Cancel]"

Manager clicks "Revoke permission."

> "CRM update permission revoked.
> Future deal stage changes will require your confirmation before each one.
> The 3 updates already made remain in place — review them in the CRM if needed."

The manager reviews the already-made updates, corrects the ones that touched the wrong team's pipeline manually, and proceeds with per-action prompts for the rest of the session.

# Persistent Permission

**Category:** Permission gate
**Sub-type:** Hard gate (initial grant); Soft gate (subsequent sessions)
**Severity:** Blocking (Level 3) at initial grant; Informational (Level 0) on subsequent use
**Status:** stable
**Phase:** 2C

---

## Problem It Solves

For routine, well-understood actions that users perform repeatedly across many sessions, per-session or per-action permission prompts create cumulative friction that erodes the usefulness of the AI system. However, authorizing an action category indefinitely without any control mechanism creates a silent expansion of AI authority that users may not realize they have granted. Persistent permission balances these concerns: it captures explicit, deliberate authorization that persists across sessions, makes the grant visible and discoverable, and provides a clear mechanism to revoke it.

---

## Definition

A persistent permission grants the AI authorization to perform a defined action category across all future sessions until the user revokes the authorization. The grant is recorded, surfaced in user-facing permission management settings, and revocable at any time without consequence to other permissions.

---

## When to Use

- The user has demonstrated repeated, informed consent for an action type across multiple sessions and the per-session prompt has become pure friction
- The action type is routine, bounded, and predictable — the user's intent for this action category is stable and does not change meaningfully between sessions
- The deployment supports a user-facing permission management interface where persistent permissions are visible and revocable
- The action category's risk profile is appropriate for long-term standing authorization — not so consequential that each instance warrants fresh review

---

## When Not to Use

- The user has not yet demonstrated repeated intent — do not offer persistent permission on first encounter
- The action category has variable scope or targets that may change significantly across sessions — use scoped permission with defined boundaries
- The deployment does not have a permission management interface — offering persistent permission without a clear revocation path is inappropriate
- The action has regulatory or compliance requirements for per-execution authorization — persistent permission cannot substitute for a mandated per-execution authorization step

---

## Trigger Conditions

- **Repeated session permission grants:** The user has granted session permission for the same action category across two or more consecutive sessions — offer persistent permission as an upgrade
- **Explicit user request:** The user requests "always allow this" or equivalent
- **Preference configuration:** The user accesses permission settings and grants persistent permission for a defined action category

---

## Permission Scope

**Scope: Defined action category, all future sessions, until revoked.**

The persistent permission must define:
- The exact action category covered
- The resources, channels, or data scope included (e.g., "all projects you are assigned to" vs. "all projects in the tenant")
- What is explicitly excluded from the persistent permission
- The revocation method

Unlike session permission, persistent permission must be explicitly bounded at the time of grant. Unbounded persistent permissions ("allow all AI actions indefinitely") are not acceptable — every persistent permission must have a defined scope.

---

## User Action Required

**At initial grant (Blocking — deliberate):**
The initial persistent permission grant requires a deliberate, high-friction action:
- A named confirm button ("Save this permission")
- A visible summary of what is being authorized
- A clear statement of how to revoke
- No passive dismissal — the user must actively confirm or cancel

The high friction at grant is intentional: persistent permissions have indefinite duration and users should treat the grant decision with appropriate weight.

**In subsequent sessions (Informational):**
Actions covered by a persistent permission execute without prompting. A passive indicator (e.g., a small badge, a status note in the activity log) may be surfaced to confirm the permission is active and was used.

---

## Explanation Requirements

The persistent permission grant must state:
1. **What the AI will be authorized to do** — the action category, completely and specifically
2. **What is not covered** — explicit exclusions
3. **That this persists across sessions** — users must understand this is indefinite, not session-bounded
4. **How to revoke** — specific navigation path or mechanism
5. **That revocation takes effect immediately** — users should know they are not locked in

---

## Copywriting Guidance

**At initial grant:**
> **Allow knowledge base posting permanently?**
>
> This will allow the AI to post, edit, and archive articles in your assigned knowledge base sections across all sessions, without prompting for each action.
>
> Includes: posting, editing, archiving in your assigned sections
> Excludes: deleting articles, publishing to external channels (those will still require confirmation)
>
> You can revoke this at any time in Settings → AI Permissions.
>
> [Save this permission] [Not now — ask each session] [Cancel]

**Activity log entry (subsequent sessions):**
> "Posted article 'Q3 Compliance Update' to HR Knowledge Base — knowledge base posting permission is active. Manage permissions ↗"

**Tone at grant:** More deliberate than session permission copy. The user should feel the weight of the decision — not alarmed, but clearly informed they are making a standing authorization.

---

## Accessibility Requirements

- **Grant dialog:** `role="dialog"` with full focus management. The confirm button must not be the first interactive element — the description of what is being authorized should be read first.
- **Permission management interface:** Must be keyboard navigable. Persistent permissions listed in the management interface must each have an accessible revocation control.
- **Activity log indicator:** If persistent permission use is logged passively in the interface, the log entry must be discoverable by screen reader users without requiring visual scanning.
- **Revocation confirmation:** Revocation confirmation dialog must be keyboard accessible with focus management.

---

## Enterprise Audit Considerations

**Audit logging:** Required. Persistent permissions have indefinite duration and must be tracked throughout their lifecycle. Log:
- Initial grant: action category, scope, timestamp, user identifier, session at time of grant
- Each use (or periodic summary of use, depending on action frequency): action performed, timestamp
- Revocation: timestamp, whether revocation was user-initiated, AI-initiated (e.g., policy change), or system-initiated (e.g., role change)

**Scope change events:** If a user's role, access level, or assignment changes in a way that affects the scope of a persistent permission, the permission must be reviewed and may need to be automatically restricted or revoked. Log any automatic scope restriction events.

**Policy-driven expiry:** Enterprise deployments should configure maximum lifetimes for persistent permissions (e.g., persistent permissions expire after 90 days and must be re-granted). This balances usability with security hygiene.

**Admin visibility:** System administrators must be able to view all persistent permissions granted in their tenant, including user, scope, grant date, and last-used date. Dormant permissions (not used in N days) should be flagged for review.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| No revocation interface | Persistent permission granted but there is no user-accessible way to revoke it | Users cannot remove authorizations they no longer want; loss of control; security risk |
| Unbounded scope | Persistent permission covers "all AI actions" without specific category definition | Users have authorized more than they intend; scope creep over time |
| No visibility | Persistent permissions are active but not surfaced to the user in any settings interface | Users forget they granted the permission; actions occur that the user no longer expects |
| No policy-driven expiry | Permissions granted years ago remain active after the user's context, role, or needs have changed | Stale permissions accumulate; security and compliance risk |
| Premature offer | Persistent permission offered on first encounter with an action type | User has insufficient experience with the action to make an informed standing authorization |

---

## Revocation or Recovery Path

The user can revoke persistent permission at any time via Settings → AI Permissions (or equivalent in the deployment's permission management interface). Upon revocation:
- The permission is removed immediately
- Subsequent actions of the previously authorized type revert to one-time permission prompts
- Actions already performed under the persistent permission are not reversed
- A confirmation of revocation is displayed

Administrators may also revoke persistent permissions on behalf of a user or as a result of a policy change. Admin-initiated revocations generate a notification to the affected user.

---

## Related Patterns

- **[One-time permission](one-time-permission.md)** — The per-action alternative; the default before persistent permission is established
- **[Session permission](session-permission.md)** — The intermediate alternative; offer as a stepping stone before suggesting persistent permission
- **[Scoped permission](scoped-permission.md)** — Combine to define precise resource boundaries for the persistent authorization
- **[Revocation](revocation.md)** — The revocation pattern governs the full persistent permission revocation flow

---

## Example Scenario

**Context:** A data analyst uses an enterprise AI assistant daily to run standard SQL queries against the analytics database. After three weeks of granting session permission at the start of each session, the system offers a persistent permission upgrade.

**Persistent permission offer (triggered after third consecutive session grant):**

> **Allow analytics database queries permanently?**
>
> You've allowed query execution at the start of each of your last 3 sessions. Would you like to allow this permanently so you don't need to confirm at the start of each session?
>
> Includes: SELECT queries against analytics database (read-only)
> Excludes: INSERT, UPDATE, DELETE queries (those will still require confirmation)
>
> Revoke anytime in Settings → AI Permissions.
>
> [Save this permission] [Keep asking each session] [Cancel]

The analyst grants it. Future sessions run analytics queries immediately without a prompt. In the activity sidebar, a small note reads: "Query executed under saved analytics permission. Manage ↗"

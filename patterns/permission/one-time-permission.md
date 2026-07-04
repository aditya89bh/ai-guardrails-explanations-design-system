# One-Time Permission

**Category:** Permission gate
**Sub-type:** Soft gate
**Severity:** Caution (Level 2)
**Status:** stable
**Phase:** 2C

---

## Problem It Solves

Some AI actions require explicit user authorization for a single occurrence — they are consequential enough that passive proceeding would be inappropriate, but not consequential enough to warrant a persistent stored permission or a multi-party approval process. A one-time permission request captures the user's in-context authorization for exactly one execution of a defined action, after which the AI must request again for any repeat of that same action. This prevents users from being silently committed to actions they did not consciously approve at each occurrence.

---

## Definition

A one-time permission is a permission gate that obtains explicit user authorization for a single, specific AI action at the moment of execution. The authorization does not persist beyond that action instance. Each subsequent execution of the same action requires a new permission request.

---

## When to Use

- The action is consequential but not irreversible — the user should know it is happening, but the stakes do not require stored consent or multi-party approval
- The action varies in scope or target between executions (each instance is materially different — the user should authorize each one individually)
- The deployment policy requires per-execution authorization for this action category
- The user is likely unfamiliar with the action and needs to be informed before each occurrence while they are learning the system's behavior

---

## When Not to Use

- The user has already authorized this exact type of action repeatedly and has developed a clear, informed habit — consider offering session or persistent permission to reduce friction
- The action is routine and low-consequence — one-time permission on a trivial action creates habituation to permission requests and diminishes the signal value of genuinely consequential permissions
- The action requires multi-party approval — use delegated permission instead
- The action requires authorization that persists across sessions — use persistent permission instead

---

## Trigger Conditions

- **Irreversibility detection (moderate):** The action has consequences that persist beyond the immediate session but can be corrected with reasonable effort
- **Third-party impact:** The action affects other users, systems, or external parties in a defined, bounded way
- **Policy match (soft):** Deployment policy requires authorization for this action category without mandating stored consent
- **First-time action for this user:** The first time a user encounters a new action type in a session, even if it would otherwise not require authorization, to establish informed familiarity

---

## Permission Scope

**Scope: Single instance, current action only.**

The permission covers exactly:
- The action as described in the permission request
- The specific target, recipient, or resource named at the time of the request
- The single execution being authorized

The permission does not cover:
- Repeat executions of the same action type
- Related actions not explicitly named
- Future sessions

---

## User Action Required

The user must take an explicit action to grant permission:
- Click a labeled confirm button ("Send", "Apply", "Execute")
- Or click a labeled decline button ("Cancel", "Go back")

Passive dismissal (pressing Escape, clicking outside) maps to decline — not to grant. This is a critical distinction: permission is not granted by default; it must be actively given.

---

## Explanation Requirements

The one-time permission request must state:
1. **What action is being requested** — specifically and completely, not generically ("Send this message to these 3 recipients" not "Send a message")
2. **What will happen as a result** — the direct consequence of granting permission
3. **That this permission is for this instance only** — users must know they will be asked again for the next occurrence
4. **What cancellation means** — that nothing happens and they can revise before re-requesting

---

## Copywriting Guidance

**Structure:** `[What the AI wants to do] + [What will happen] + [Confirm or cancel]`

**Good examples:**
- "Send this draft to alex@acmecorp.com? This will deliver the message and cannot be recalled."
  [Send] [Cancel]
- "Execute the SQL query against the production database? This will modify 142 rows."
  [Run query] [Review first]
- "Post this status update to the internal wiki? It will be visible to all employees immediately."
  [Post update] [Go back]

**Tone:** Direct, transactional. One-time permission requests are not warning dialogs — they are authorization requests. The user should feel in control, not alarmed.

**Button labels:** The confirm button must describe the action being authorized. "OK" and "Yes" are insufficient — they do not communicate what is being confirmed.

---

## Accessibility Requirements

- **Focus:** When the permission request is rendered, focus moves to the permission dialog or the confirm button.
- **ARIA role:** `role="dialog"` with `aria-labelledby` pointing to the request description.
- **Keyboard:** Confirm and decline must both be keyboard accessible. Escape maps to decline.
- **No auto-grant:** Permission must never be granted by timeout or inactivity — only by explicit user action.
- **Contrast:** Buttons and text must meet WCAG 2.1 AA.

---

## Enterprise Audit Considerations

**Audit logging:** Required when the action category is policy-gated or has downstream compliance implications. Log:
- The action requested and its target/scope
- The user's response (granted / declined)
- Timestamp, session, and user identifiers

**Policy configurability:** The list of action categories requiring one-time permission must be configurable at the tenant level. Some tenants may require one-time permission for actions that other tenants permit without authorization.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Permission granted by default | Silence or inactivity is treated as grant | Users inadvertently authorize actions they did not review |
| Vague action description | Request says "Complete this task?" without specifying what the task is | User cannot make an informed decision; trust is undermined |
| Permission fatigue | One-time permission fires for every minor action in the session | Users click confirm without reading; the pattern loses its safety value |
| Permission not logged | Authorization occurs but is not recorded | No audit trail; accountability gap |

---

## Revocation or Recovery Path

One-time permissions cannot be revoked after the action executes — they cover a single instance. If the action produces an unintended result, apply the appropriate recovery flow (retry, redirect, or repair). For the next occurrence of the same action type, a new permission request is issued. If the user wishes to prevent future requests for a specific action type, they may configure a session permission or persistent permission if those options are available in the deployment.

---

## Related Patterns

- **[Session permission](session-permission.md)** — Use when the user should authorize an action type for an entire session without per-action prompts
- **[Persistent permission](persistent-permission.md)** — Use when the user should authorize an action type across all future sessions
- **[Scoped permission](scoped-permission.md)** — Use when authorization should be bounded to a specific data set, resource, or context rather than a single instance
- **[Modal warning](../warning/modal-warning.md)** — Use instead when the goal is acknowledgment of a risk, not authorization to proceed
- **[Hard permission gate](../../docs/patterns/index.md)** — Escalate to this when the action requires a higher-friction authorization mechanism than a simple confirm/cancel dialog

---

## Example Scenario

**Context:** An enterprise AI assistant is helping a project manager update a project status in a shared workspace tool. The AI drafts the update and asks permission to post it to the project's shared channel, where it will be visible to all 47 team members.

**One-time permission request:**

> **Post this update to #project-alpha-status?**
>
> This will post your project status update to the shared channel immediately. All 47 team members will be notified.
>
> [Post update] [Review draft first]

The manager clicks "Post update." The message is posted. The next time the AI prepares an update, it will request permission again before posting.

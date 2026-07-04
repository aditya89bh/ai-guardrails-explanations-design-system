# Session Permission

**Category:** Permission gate
**Sub-type:** Soft gate
**Severity:** Caution (Level 2)
**Status:** stable
**Phase:** 2C

---

## Problem It Solves

For tasks where users will perform the same type of action repeatedly within a session, per-action one-time permission requests create friction disproportionate to the risk — especially once the user has demonstrated informed intent early in the session. At the same time, blanket persistent permissions may be too broad for actions where the user's intent or context could plausibly change across sessions. Session permission resolves this: it captures authorization once per session, for a defined action category, and clears that authorization when the session ends.

---

## Definition

A session permission grants the AI authorization to perform a defined action category for the duration of the current session, without requiring per-action prompts. The authorization expires when the session ends. A new session requires a new session permission grant.

---

## When to Use

- The user will perform the same type of action repeatedly within a session (e.g., posting updates, generating and sending summaries, executing queries of a specific type)
- The user has demonstrated informed intent early in the session and re-prompting at each action would add friction without adding safety
- The action is bounded and predictable — the scope of "this action type during this session" is clear and consistent
- Session expiry provides a natural reset that is appropriate for the action category (e.g., the user's context or access may change between sessions)

---

## When Not to Use

- Each instance of the action is materially different in scope or target — use one-time permission for each instance
- The authorization should outlast the session — use persistent permission
- The action requires multi-party sign-off — use delegated permission
- The action scope is variable enough that "this action type" could mean materially different things within the same session — use scoped permission to bound the authorization more precisely

---

## Trigger Conditions

- **Repeated action type detected:** The AI is about to perform the same category of action for the second time in the session, and the prior authorization was one-time; offer to upgrade to session permission
- **First-use authorization with session offer:** When requesting one-time permission for the first time in a session for an action the user is likely to repeat, offer the option to grant session-level permission instead
- **Session-start policy checkpoint:** For some action categories, deployment policy requires a session-level authorization to be captured at the start of the session before any actions of that type can be performed

---

## Permission Scope

**Scope: Defined action category, current session only.**

The permission covers:
- All actions within the defined category during the current session
- Up to the explicitly stated scope of the action type (e.g., "post updates to the channels you have access to" — not all possible channels)
- The session as bounded by login/logout or session timeout

The permission does not cover:
- Actions outside the defined category
- Future sessions
- Actions that exceed the stated scope (e.g., posting to channels not included in the permission scope)

---

## User Action Required

The user must grant the session permission explicitly at the first prompt:
- Click a labeled grant button ("Allow for this session")
- Or choose to maintain per-action prompts ("Ask me each time")

At session start or on first trigger, the AI presents the session permission request. The user's choice is stored for the session. At no point does the AI grant session-level authorization by default.

---

## Explanation Requirements

The session permission request must state:
1. **What the AI is requesting authorization to do** — the action category, not just a single instance
2. **For how long** — explicitly: "for the rest of this session"
3. **What is not covered** — what the AI will still prompt for (exceptions to the session permission scope)
4. **How to revoke** — that the user can revoke session permission at any time during the session, and how

---

## Copywriting Guidance

**At first action in session (combined one-time + session offer):**
> "Post this update to #project-alpha? Allow for just this message, or for all project updates during this session?"
>
> [Post this message only] [Allow all project updates this session] [Cancel]

**As a standalone session permission prompt (policy-driven):**
> "This session includes tasks that will modify shared project data. Allow these modifications throughout this session?"
>
> What's included: creating, editing, and completing tasks in your assigned projects
> What's not included: deleting tasks or modifying team member assignments (those will still prompt)
> You can revoke this at any time from the session settings.
>
> [Allow for this session] [Ask me for each action] [Cancel]

**Revocation notice (confirmation when user revokes mid-session):**
> "Session permission revoked. I'll ask before each project modification for the rest of this session."

**Tone:** Transparent about scope. Users should clearly understand what they are authorizing and what limitations apply.

---

## Accessibility Requirements

- **Role:** `role="dialog"` with `aria-labelledby` pointing to the permission request heading.
- **Keyboard:** All three options (grant session, ask each time, cancel) must be keyboard accessible.
- **Focus:** Focus moves to the dialog when it opens; returns to the triggering action when the dialog closes.
- **Revocation control:** The revocation mechanism must be accessible from keyboard navigation at any point during the session.
- **ARIA live region:** If session permission status is displayed persistently in the UI (e.g., a badge indicating "session permissions active"), it should use `aria-live="polite"` when the status changes.

---

## Enterprise Audit Considerations

**Audit logging:** Required when session permission covers action categories with compliance implications. Log:
- Session permission granted: action category, scope, timestamp
- Session permission revoked: timestamp, point in session
- Actions performed under session permission authorization (can be logged by reference to the session permission event, not as individual permission events)
- Session end (permission expiry)

**Policy configurability:**
- Which action categories are eligible for session-level permission must be configurable — some action categories may be required to stay at one-time permission regardless of user preference
- Session timeout behavior (does session permission expire with the session, or with an inactivity timeout) must be configurable
- Whether users can opt out of session permission offers (always defaulting to per-action prompts) must be configurable for deployments with strict authorization requirements

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Session permission treated as persistent | Session permission does not expire when the session ends; it carries over to subsequent sessions | User inadvertently maintains authorization they expected to expire; potential unauthorized actions in a new context |
| Scope creep | Actions performed under session permission exceed the stated scope | Users lose confidence in the permission system; actions occur that the user did not intend to authorize |
| No revocation path | User cannot revoke session permission once granted | User is locked into an authorization they now want to restrict; loss of control |
| Session permission presented too early | Session permission offered before the user has experienced the action type | User grants authorization without enough context to know what they're agreeing to |

---

## Revocation or Recovery Path

The user can revoke session permission at any time during the session. Upon revocation:
- The AI returns to one-time permission requests for the affected action category
- Actions already performed under session permission are not reversed
- A confirmation of revocation is shown

After session end, session permission automatically expires. No action is required from the user.

---

## Related Patterns

- **[One-time permission](one-time-permission.md)** — The per-action alternative; offer as an option alongside session permission
- **[Persistent permission](persistent-permission.md)** — The cross-session alternative; offer when the user's need clearly extends beyond the current session
- **[Scoped permission](scoped-permission.md)** — Combine when session authorization needs to be bounded to a specific resource or data scope
- **[Revocation](revocation.md)** — The revocation pattern governs the full session permission revocation flow

---

## Example Scenario

**Context:** A content manager uses an enterprise AI assistant to draft and post content to the company's internal knowledge base. In a typical session, they post 8–12 articles. Without session permission, each post requires a separate permission prompt.

**On the second post in the session:**

> "Post this article to the HR knowledge base?
>
> You've already posted once this session. Would you like to allow all knowledge base posts for the rest of this session so you don't need to confirm each one?
>
> What's covered: posting, editing, and archiving articles in your assigned knowledge base sections
> What still requires confirmation: publishing to external channels, deleting articles
>
> [Allow all posts this session] [Just this one] [Cancel]"

The content manager clicks "Allow all posts this session." For the remainder of the session, articles are posted without prompts. When the session ends, the permission expires. Tomorrow's session starts fresh.

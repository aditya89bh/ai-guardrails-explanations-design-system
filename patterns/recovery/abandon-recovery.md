# Abandon Recovery

**Category:** Recovery flow
**Sub-type:** Abandon
**Severity:** Informational (Level 0) to Advisory (Level 1)
**Status:** stable
**Phase:** 2G

---

## Definition

Abandon recovery is the recovery flow that allows a user to exit a workflow cleanly — without completing it — while preserving their context, draft state, and the ability to re-enter later. Abandon recovery is not failure. It is an intentional, structured exit from a workflow that cannot or should not be completed in the current session.

Abandon recovery is distinct from all other recovery flows: retry attempts to complete, redirect finds an alternative path, repair corrects and resumes, override bypasses a guardrail. Abandon exits. Its purpose is to make that exit clean — context preserved, session state closed properly, re-entry path defined — so that the work done before the exit is not lost.

Abandon recovery is not the same as session timeout or system disconnection. Those are uncontrolled exits. Abandon recovery is a controlled, user-initiated exit with a structured outcome.

---

## Problem Solved

Users frequently need to exit workflows mid-task — a deadline has passed, circumstances have changed, the required information is not yet available, or the user simply cannot complete the task in this session. Without abandon recovery, mid-task exits leave workflows in ambiguous states: draft content may be lost, partially submitted forms may create incomplete records, and the user has no structured path back to where they left off.

---

## When to Use

- The user explicitly chooses to stop the current workflow and exit
- A blocking condition cannot be resolved in this session (the required information, authority, or resource will not be available until a later time), and the user does not want to wait
- All recovery paths (retry, redirect, repair, override) have been offered and declined by the user
- The workflow's conditions have changed in a way that makes it inappropriate to continue (e.g., the underlying business need has been cancelled)
- The AI determines that continuing would produce a misleading or invalid result and the user chooses not to address the issue

---

## When NOT to Use

- The exit is uncontrolled (network disconnection, session timeout) — these require session state management, not abandon recovery
- The workflow has already completed — abandon recovery applies to in-progress workflows only
- The user has not made a clear decision to abandon — do not assume abandon intent. Ask explicitly if the user's intent is ambiguous.

---

## Entry Conditions

Abandon recovery activates when:

- The user explicitly signals their intent to abandon the current workflow
- The AI has confirmed that all open outputs, pending actions, and intermediate states will be handled before closing (saved, discarded, or cancelled as appropriate)
- The user has been informed of what will be preserved and what will not

---

## Exit Conditions

Abandon recovery exits when:

- The session is closed cleanly: all pending states are resolved, draft content is saved, and the session record is marked as abandoned (not failed)
- The user has been given a re-entry reference (a way to return to where they left off)

---

## Recovery Objective

Close the current workflow cleanly, preserving the user's work in progress and providing a defined path back to it, so the abandonment does not become a permanent loss of work or an ambiguous system state.

**Success criteria:** The session closes without orphaned states or lost content. The user has a reference and a path to re-enter. The system state is consistent.

**Completion conditions:** The session record is marked as abandoned. Draft state is persisted in a retrievable location. Any external actions that were in progress are either completed, cancelled, or put in a defined hold state.

---

## Recovery Owner

| Component | Owner |
|---|---|
| Deciding to abandon | User |
| Drafting and preserving state | AI |
| Defining the re-entry path | AI |
| Communicating the exit outcome | AI |
| Executing cleanup | AI and system |

---

## Clean Exit Requirements

A clean exit requires that every open element of the workflow is explicitly handled before the session closes:

| Open element | Required handling |
|---|---|
| Draft content (documents, messages, data) | Saved to user-accessible draft storage with a retrievable identifier |
| Pending permission requests | Cancelled or converted to a standing request if the deployment supports it |
| In-progress system escalations | Held in the queue with a note that the originating session was abandoned; the user is the contact for follow-up |
| Submitted but unresolved actions | Left in their current state; user is informed of the pending state and given the reference |
| Temporary in-session data | Discarded — the user is informed of what will not be preserved |
| External system writes in progress | Completed if already initiated and idempotent; otherwise cancelled and the user is informed |

---

## Draft Preservation

Draft preservation is the core obligation of abandon recovery. For any content the user has contributed or the AI has generated during the session:

- Drafts must be saved automatically at the point of abandon — the user must not have to remember to save
- The draft record must include: what was completed, what was in progress, what inputs the user provided, and where the workflow was when it was abandoned
- The draft must be retrievable using the reference provided at session close
- Draft retention period must follow the deployment's configured retention policy
- If draft content contains sensitive data, storage must meet the same data classification requirements as live content

---

## Re-entry Path

Every abandon recovery must leave the user with a defined re-entry path:

- A reference identifier for the abandoned workflow
- The channel through which they can resume (same AI session, a different system, or a human agent)
- What state they will return to: what is already done, what needs to be done
- Any prerequisites for successful re-entry (information they need to obtain, authorizations they need to arrange)

If re-entry is time-limited (the draft will expire, the queue will close, the business context will change), the user must be told the deadline.

---

## Session State

At abandon:

- Active permissions granted in this session are revoked (session-scoped permissions expire on session close)
- Persistent permissions granted in this session remain active until their configured expiration
- The session record is marked as `abandoned` — this status is distinct from `failed` and from `completed`
- If any external system holds an open transaction or request tied to this session, the external system is notified of the session close

---

## User Communication

**At abandon confirmation:**
```
Exiting [workflow name].

Before I close:
• [Draft document] has been saved. Reference: [ID]
• [Pending escalation] remains in the queue as [Status]. Reference: [ID]
• [Temporary session data] will not be saved.

When you're ready to continue:
• Open [workflow name] and use reference [ID] to pick up where you left off
• [Prerequisites if any]

[Close session] [Actually, let me continue]
```

**At session close:**
```
Session closed. Reference: [ID]
Your draft is saved and can be retrieved at [location/reference].
```

**Tone:** Matter-of-fact and forward-looking. Abandonment is a legitimate user decision — not an apology event. The communication must leave the user feeling organized and in control, not as if they have failed.

---

## Required Explanation Patterns

- **Limitation disclosure** — if the reason for abandonment was a limitation the AI surfaced (and the user has chosen to exit rather than work around it), the limitation disclosure that preceded the abandon is part of the workflow record.
- There is no explanation pattern required specifically at the abandon moment — the communication is operational, not explanatory.

---

## Required Permission Patterns

- **Revocation** — session-scoped permissions must be revoked at session close. The revocation is automatic and does not require user action.
- No new permission gates are required for abandon recovery. The act of abandoning is a user decision, not an action requiring authorization.

---

## Related Uncertainty States

- **Unresolvable state** → abandon recovery is one of three exits from the unresolvable state (alongside refusal and escalation). When the user determines that neither refusal nor escalation is the right path, clean exit is the appropriate outcome.
- **Insufficient information state** → if the missing information cannot be obtained in the current session and the user cannot wait, abandon recovery preserves the draft and the re-entry context so the workflow can resume when the information is available.

---

## Related Refusal Patterns

- **All refusal patterns** → abandon recovery is the appropriate follow-on when the user has reviewed the refusal, the alternatives, and all recovery paths, and has decided to exit rather than pursue any of them.

---

## Related Escalation Paths

- **Async review escalation** → if a pending review is in the queue when the user abandons, the review remains active. The user's abandon does not cancel the review — the review continues and the user will be notified of the outcome through the configured channel (not the session).
- **Human handoff (escalation)** → if a human agent is handling the escalation when the user abandons, the agent is notified of the session close. The agent continues their work; the outcome is communicated to the user out-of-session.

---

## Audit Requirements

**Required for any workflow that had consequential steps in progress.** Log:

- The workflow identifier and the step at which the session was abandoned
- What draft content was preserved and where
- What external actions were in progress at the time of abandon and their disposition
- The timestamp of session close
- Whether any escalations remain active and their status at close time

The abandon record is part of the workflow's lifecycle history — it is not an error record.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Draft not saved | User abandons and discovers their work was not preserved | Work is permanently lost; trust in the AI system is damaged |
| No re-entry reference | User abandons but is not given a way to return to the workflow | The abandon is effectively permanent loss, not a clean exit |
| Session-scoped permissions not revoked | User exits but permissions active in the session persist into future sessions | Security and compliance gap; permissions outlive their intended scope |
| Abandonment treated as failure | The session record is marked as `failed` instead of `abandoned` | Reporting distortion; the user's deliberate exit looks like a system failure |
| Open external action not disclosed | An external action (escalation, submission) is left in an ambiguous state without notifying the user | User does not know the action is still pending; they may take a conflicting action elsewhere |

---

## Fallback Behavior

If draft preservation fails:

- The user is immediately notified before the session closes: "Saving your draft failed — the session has not been closed. You can copy your content before I try again."
- The session is not closed until the user has either acknowledged the loss and accepted it, or the draft has been successfully preserved in an alternative location.

Closing a session with unsaved user work without explicit user acknowledgment of the loss is not acceptable. The session must remain open until the user has made an informed decision.

---

## Accessibility Considerations

- The abandon confirmation prompt must be keyboard-navigable; users must be able to both confirm and cancel without a mouse
- The "Actually, let me continue" option must be at least as accessible as the "Close session" option — the default action must not be the destructive one
- Draft preservation confirmation must be communicated via `aria-live="assertive"` — the user must know their draft was saved before they dismiss the session
- If the abandon confirmation contains a list of items being preserved vs. discarded, the list must be structured with proper list semantics for screen readers, not as a block of text

---

## Enterprise Considerations

- **Draft lifecycle governance:** Enterprise deployments must define draft retention policies — how long abandoned drafts are kept, who can access them, and when they are purged. An abandoned draft containing sensitive data must follow the same classification and retention rules as active content.
- **Workflow state reporting:** Abandoned workflows must be visible in workflow management dashboards with `abandoned` status, not hidden or reported as `failed`. Aggregate abandon rates by workflow type are a UX health signal.
- **Escalation continuity:** When a user abandons a session with an active escalation, the escalation system must flag the originating session as closed so the human agent does not expect to return results to an active session. The notification channel must be out-of-session.

---

## Example Scenario

**Context:** A procurement analyst is using an enterprise AI to prepare a complex vendor contract for a high-value purchase. Midway through, they receive a call informing them that the vendor relationship is under review and the contract should not be completed until the review is finished. The analyst needs to exit cleanly and preserve everything that has been done.

**Abandon recovery:**
```
Exiting Contract Preparation — Vendor Agreement Draft.

Before I close:

Saved:
• Contract draft (Sections 1–7 complete) → Draft ID: VCA-2026-03181
  Retrieved at: [contracts.yourcompany.com/drafts/VCA-2026-03181]
• Vendor data compiled (pricing, terms, SLAs) → saved with draft

Not saved:
• Comparison analysis (Section 8) — this was in progress and was not complete. 
  You'll need to rerun this section when you return.

Active items:
• Legal review request (LRQ-2026-0441) remains in the queue. You'll be 
  notified by email when Legal completes their review — this is not affected 
  by your exit.

When you're ready to continue:
• Open Draft ID VCA-2026-03181 from the contracts portal
• Legal review results will be waiting there when they complete

[Close session] [Actually, let me continue]
```

The analyst confirms. The session closes. The draft is preserved with a clear re-entry path. The in-progress legal review continues independently. The analyst knows exactly what is done, what was lost, and where to pick up.

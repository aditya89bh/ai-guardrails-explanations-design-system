# Blocking Warning

**Category:** Warning pattern
**Sub-type:** Blocking warning
**Severity:** Blocking (Level 3)
**Status:** stable
**Phase:** 2A

---

## Problem It Solves

Some situations require the AI system to halt a user's progress and present a condition that must be resolved — not merely acknowledged — before the workflow can continue. Unlike a modal warning where a user can click "confirm" to proceed, a blocking warning presents a condition that prevents forward progress until a specific resolution action is taken: the concern is resolved, corrective information is provided, or the user selects an explicit alternative path. This pattern is appropriate when permitting unchecked continuation would create material risk to data integrity, regulatory compliance, or operational safety.

---

## Definition

A blocking warning halts the current workflow at a defined checkpoint and requires the user to take a specific resolution action before the system allows forward progress. The user cannot dismiss the warning or click past it without completing the required action. Unlike a permission gate, the blocking warning does not require external authorization — the required action is within the user's own control. Unlike a refusal state, the workflow can proceed once the resolution condition is met.

---

## When to Use

- The system has detected a condition that makes forward progress materially unsafe, non-compliant, or likely to produce a harmful outcome if not resolved first
- The resolution action is within the user's control (they can fix, replace, or acknowledge with a declared commitment — not just a passive "I understand")
- The concern cannot be safely surfaced as a less-intrusive warning because the risk of the user proceeding unawares is too high
- The condition is resolvable within the current workflow — the user does not need to leave and return
- The action the user is about to take is consequential and at least partially irreversible

---

## When Not to Use

- The concern is advisory — the user can safely proceed even if they disagree with the warning — use inline or modal warning instead
- The concern requires authorization from a different user or a higher authority — use a permission gate or escalation path instead
- The user has no path to resolution (the condition cannot be fixed) — use a refusal state instead
- The action being blocked is routine and low-consequence — blocking patterns applied to low-stakes actions create disproportionate friction and habituation to blocking screens
- The condition can be resolved automatically by the system without user input — resolve it automatically rather than blocking the user

---

## Trigger Conditions

- **Irreversibility detection (high):** The action is substantially irreversible and the system has detected a condition that significantly increases the risk of an unintended outcome
- **Data sensitivity signal (blocking threshold):** The action would expose, transfer, or process data at a classification level that requires user confirmation of appropriate handling before proceeding
- **Policy match (hard):** The request matches a policy rule that requires a blocking intervention — typically because a configurable threshold has been breached and a hard stop is mandatory
- **Compliance checkpoint:** The action touches a process that has a mandatory verification step defined by an enterprise policy or regulatory requirement (e.g., "You must confirm the recipient is authorized before sending this document type")
- **Unresolvable uncertainty (in the output):** The AI cannot produce a reliable output for a consequential decision and must stop and require the user to either provide additional context or choose a different path

---

## Severity Level

**Blocking (Level 3).** This is the highest severity within the warning pattern category. The user cannot proceed without completing the resolution action. If the condition cannot be resolved by the user at all — and the system cannot proceed — escalate to an escalation path or refusal state instead.

---

## User Action Required

The user must complete one of the following resolution actions. The system must clearly specify which applies:

- **Correct the input:** Modify a field, remove flagged content, or replace an invalid selection before continuing
- **Provide missing information:** Supply required context the system needs to safely proceed
- **Explicit declaration:** Type or select a specific acknowledgment that demonstrates active comprehension, not passive click-through (e.g., typing a confirmation phrase for high-stakes actions, or selecting a checkbox with a specific statement)
- **Choose an alternative path:** Select from a set of safe alternatives if the current path cannot proceed

The user must also always have the option to **cancel** and exit the workflow entirely, with their prior state preserved.

---

## Explanation Requirements

The blocking warning must clearly state:
1. **Why the workflow is stopped** — the specific condition, not a generic "there is a problem"
2. **What the user must do to continue** — the exact resolution action, step by step if there are multiple steps
3. **What cancellation means** — that the user can exit without consequence, and what state will be preserved
4. **Whether there is a time limit** — if the blocking condition has a timeout (e.g., a compliance window), disclose it

The blocking warning must not include:
- A shortcut that bypasses the resolution step
- Vague instructions that leave the user guessing what "fix the issue" means
- A "try again later" resolution when the condition is resolvable now

---

## Copywriting Guidance

**Header:** Name the blocked condition specifically. `[Condition that is blocking progress]`

**Body:** Explain the condition and the resolution in plain language. Two to five sentences. Use numbered steps if the resolution requires more than one action.

**Resolution action label:** Use a verb phrase that names what the user is about to do: "Update the recipient list", "Confirm data classification", "Remove restricted content". Never use "OK".

**Cancel label:** "Go back" or "Cancel this action." Not "Cancel" alone — that is ambiguous about what is being cancelled.

**Good examples:**

Header: "This document cannot be sent to external recipients in its current state"
Body: "Three sections are classified as Internal Only under your organization's data policy. Documents containing Internal Only sections may only be sent to users within your domain. To proceed, remove or reclassify the flagged sections, or change the recipient list to include only internal users."
Resolution button: "Remove flagged sections" | "Change recipients"
Cancel: "Go back without sending"

---

Header: "The selected data export includes fields your role cannot transfer"
Body: "Your current role permits export of summary-level data only. The selection includes two raw record fields (Customer ID, Raw Transaction Log) that require Data Administrator access to export. To proceed, either remove these fields from the export, or request elevated access."
Resolution button: "Remove restricted fields" | "Request elevated access"
Cancel: "Cancel export"

---

**Tone:** Direct and specific. No apologies, no softening. The user needs to understand exactly what is wrong and exactly what they need to do. Urgency is appropriate only if there is a genuine time constraint.

---

## Accessibility Requirements

- **Focus management:** When the blocking warning is rendered, focus must move immediately to the blocking warning container or its primary heading. The user's prior focus context is lost — they must be oriented to the blocking screen immediately.
- **Focus trap:** If rendered as an overlay, keyboard focus must be trapped within the blocking warning. Users must not be able to Tab into background content.
- **ARIA role:** Use `role="alertdialog"` with `aria-labelledby` pointing to the heading and `aria-describedby` pointing to the body text. `alertdialog` is appropriate here because this is an urgent, blocking condition requiring response.
- **No passive dismissal:** Escape key must not close the blocking warning silently. Map Escape to the cancel/go-back action.
- **Screen reader announcement:** The heading and body must be announced immediately on render. Use `aria-live="assertive"` if the blocking warning replaces content in-page (not in a dialog).
- **Contrast:** All text must meet WCAG 2.1 AA contrast. Resolution action buttons must meet 3:1 contrast against their background.
- **Resolution instructions must be text:** Do not rely on visual layout alone (e.g., highlighting a field in red) to communicate what the user must do. Instructions must be present as readable text.

---

## Enterprise Audit Considerations

**Audit logging:** Required at Blocking severity. Log:
- Blocking warning identifier (which rule or condition triggered it)
- The action that was blocked
- The resolution action the user took (or that they cancelled)
- Time spent in blocking state
- Timestamp, session, and user identifiers

**Policy configurability:**
- The conditions that trigger a blocking warning must be configurable at the tenant level — platform defaults should be conservative; tenants may configure additional triggers
- The specific resolution actions required must be configurable — some tenants may require typed confirmation for certain actions; others may accept a checkbox
- Escalation behavior when a user cannot resolve the blocking condition must be configurable (does it route to an escalation path? Does it log an incident?)

**Multi-tenant:** Blocking warning policies are tenant-scoped and should be reviewed as part of tenant onboarding. Tenants in regulated industries will typically have a broader set of blocking triggers than general enterprise tenants.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Blocking on low-stakes actions | Blocking warning fires for routine, easily reversible actions | Users develop a habit of bypassing blocking screens without reading them |
| Unclear resolution path | Blocking warning explains the problem but not what to do | User is stuck; they cannot proceed and do not know how to exit the state |
| No cancel option | Blocking warning does not provide a way to abandon the action | User is trapped; if they cannot resolve the condition, they have no exit |
| Passive acknowledgment accepted | Resolution is a click-through "I understand" checkbox | Provides false assurance; users check it without reading |
| Blocking condition resolves silently | System detects the blocking condition is resolved but does not update the UI | User is confused; they completed the resolution action but are still blocked |
| Too many simultaneous conditions | Blocking warning presents multiple unrelated conditions | User cannot prioritize; attention is split and resolution is delayed |

---

## Recovery Path

The blocking warning itself is a checkpoint within a recovery context. Once the user completes the resolution action, the workflow resumes from the blocked point. If the user cancels, they return to their prior state with all input preserved. If the blocking condition cannot be resolved by the user and they need assistance, the blocking warning must surface an escalation option — see [`patterns/escalation/role-escalation.md`](../escalation/role-escalation.md) _(planned)_.

---

## Related Patterns

- **[Modal warning](modal-warning.md)** — Use instead when the concern requires acknowledgment but the user can proceed after confirming; reserve blocking warning for conditions requiring actual resolution
- **[Progressive warning](progressive-warning.md)** — Use to escalate toward a blocking warning before the user reaches the blocked action
- **[Policy warning](policy-warning.md)** — Use alongside when the blocking condition is specifically a policy violation requiring both the block and a policy explanation
- **[Soft permission gate](../permission/soft-gate.md)** — Distinguish: a blocking warning requires user-driven resolution; a permission gate requires explicit user authorization to proceed
- **[Hard permission gate](../permission/hard-gate.md)** — Use instead when the resolution requires not just user action but formal authorization
- **[Role escalation](../escalation/role-escalation.md)** — Pair with when the blocking condition cannot be resolved by the current user and requires elevated authority

---

## Example Scenario

**Context:** An enterprise AI is assisting an HR manager in generating a bulk salary update file to be submitted to the payroll system. The AI generates the file, but the policy engine detects that 14 employee records are marked as "Pending Manager Approval" — their current manager has not approved their annual review, so their salary updates are not cleared for processing.

**Blocking warning rendered:**

> **14 records cannot be included in this payroll file**
>
> These employees have pending manager approvals that have not been completed. Your organization's payroll policy requires all pending approvals to be resolved before salary updates can be submitted.
>
> To continue:
> 1. Remove the 14 pending records from this file and submit the remaining records now.
> 2. Or, wait for pending approvals to be completed, then regenerate the file.
>
> [Remove 14 pending records and continue] [Cancel payroll submission]

**What the manager can do:** Remove the blocked records and submit the rest immediately, or cancel and wait. They cannot submit the file with the pending records included.

**What would go wrong without this pattern:** The payroll file is submitted with 14 unreviewed salary updates. Incorrect figures are processed before the approval cycle completes, creating payroll corrections, employee disputes, and audit findings.

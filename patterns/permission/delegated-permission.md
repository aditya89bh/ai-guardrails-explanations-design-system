# Delegated Permission

**Category:** Permission gate
**Sub-type:** Delegated gate
**Severity:** Blocking (Level 3) to Critical (Level 4)
**Status:** stable
**Phase:** 2C

---

## Problem It Solves

Some AI actions require authorization from a person other than the user making the request — a resource owner, a manager, a compliance officer, or a system administrator. The requesting user does not have the authority to grant permission unilaterally. Without a structured delegation mechanism, these situations result in one of two failures: the AI refuses without explaining that delegation is the solution, or the AI proceeds without obtaining the required authorization. Delegated permission provides the mechanism for the AI to route an authorization request to the appropriate party, hold the action in a pending state, and proceed only when authorization is received.

---

## Definition

A delegated permission routes an authorization request to a designated approver — a party other than the requesting user — who has the authority to grant or deny permission for the requested action. The AI holds the action in a suspended state until the delegated approver responds. If approved, the action proceeds; if denied, the action does not proceed and the requesting user is notified with the reason.

---

## When to Use

- The requested action requires authorization from a specific role or individual that the requesting user does not hold
- The AI can identify or look up the appropriate approver from the authorization structure (org chart, role configuration, resource ownership records)
- The approval workflow has a defined SLA or timeout behavior
- The requesting user needs to know the action is pending and will not proceed until approved
- The action is significant enough to warrant a formal approval chain

---

## When Not to Use

- The requesting user has the authority to approve their own actions — use one-time, session, or persistent permission instead
- No approver can be identified — if the system cannot determine who should approve, do not send to an unknown approver; surface as a configuration gap and notify an administrator
- The approval would be purely ceremonial (the approver always approves without review) — work with policy owners to eliminate the delegation requirement or make it meaningful
- The action is time-critical and the delegation latency is incompatible with operational requirements — surface this incompatibility explicitly; do not silently skip the delegation

---

## Trigger Conditions

- **Authorization gap:** The user's role or permission level does not cover the requested action, but an approver with the required authority can be identified
- **Resource ownership gate:** The action involves a resource owned by a different user or team; the resource owner must authorize access or modification
- **Policy-mandated approval:** Deployment policy requires multi-party authorization for specific action categories (e.g., budget approvals above a threshold, data exports above a certain sensitivity level)
- **Compliance checkpoint:** Regulatory or organizational requirements specify that certain AI-assisted actions must have a second-party sign-off before execution

---

## Permission Scope

The delegated permission request defines:
- **What is being requested:** The action and its full scope
- **Why delegation is required:** Which authorization gap or policy requires external approval
- **Who the approver is:** Named individual or role (e.g., "Your manager, Jordan Lee" or "The Data Governance Team")
- **What the approver is deciding:** The specific question the approver must answer (approve / deny / approve with conditions)
- **Expiry:** If the approval is not received within the configured window, what happens (action automatically cancelled, user notified to re-initiate)

---

## User Action Required

**Requesting user:**
- Initiates the delegation by confirming the request should proceed to the approver
- May add a message to the approver explaining context
- Receives notification when the approver responds
- Does not take further action unless the approval requires modification of the original request

**Approver:**
- Receives a structured approval request with the action description, scope, and requesting user's context note
- Grants, denies, or conditionally approves (e.g., "approved but limit scope to X")
- Is informed of the consequence of granting (what the AI will be authorized to do)

---

## Explanation Requirements

**To the requesting user:**
1. Why authorization cannot be granted by the user alone
2. Who the approver is and how they will be contacted
3. What the approver will be asked to decide
4. Expected response time (if a configured SLA exists)
5. What happens if the approval is not received in time

**To the approver:**
1. Who is requesting, what they are requesting, and why
2. The full scope of what the AI would be authorized to do if approved
3. Any relevant context the requester has provided
4. The consequence of granting or denying
5. A simple mechanism to approve, deny, or approve with conditions

---

## Copywriting Guidance

**To the requesting user (confirmation of delegation):**
> "This action requires approval from your manager. I've sent an approval request to Jordan Lee.
>
> Requested: Export the Q3 Sales Report (including customer PII fields) to your personal drive
> Sent to: Jordan Lee (your manager)
> Expires: If not approved within 48 hours, this request will be cancelled
>
> You'll be notified when Jordan responds. [View request status ↗]"

**To the approver (approval request notification):**
> "[Employee name] has requested AI assistance to export the Q3 Sales Report, including customer PII fields, to their personal drive.
>
> Action: Export 'Q3 Sales Report (Full)' to [user]'s personal Google Drive
> Includes: Customer names, email addresses, and purchase history
> Requestor's note: "I need this for the board presentation — no other path to get it in the right format."
>
> [Approve] [Deny] [Approve with conditions]"

**Approval with conditions response:**
> "Jordan Lee approved this export with the following condition: The file must be password-protected and deleted from personal drive within 7 days.
>
> [Acknowledge conditions and proceed] [Cancel export]"

---

## Accessibility Requirements

- **Approval request notifications:** Must be accessible in the approver's notification channel — emails, in-app notifications, and approval request pages must all meet WCAG 2.1 AA.
- **Approve/deny controls:** All approval controls must be keyboard accessible in the approver's interface.
- **Status updates:** The requesting user's status notification must use accessible notification patterns — not ephemeral toasts that disappear before screen reader users can read them.
- **Conditional approval:** The conditions communicated to the requesting user must be readable text, not only visual formatting.

---

## Enterprise Audit Considerations

**Audit logging:** Required for all delegated permission events. Log:
- The full approval request as sent to the approver
- The approver's response (granted / denied / conditionally approved) and the timestamp
- Any conditions attached to the approval
- Whether the action was executed following approval
- Timeout events (if approval was not received in the configured window)

**SLA configuration:** Approval request expiry windows must be configurable per action category. Different action types may have different urgency levels. Expired approval requests must be logged as cancelled, not silently dropped.

**Approver identity verification:** In high-compliance contexts, the approver's identity must be verified at the time of approval (e.g., re-authentication required to submit an approval decision). Log the authentication event alongside the approval decision.

**Approval chain audit:** For actions requiring sequential multi-party approval, each step in the chain must be individually logged with approver identity, decision, timestamp, and any conditions applied.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| No approver identified | System cannot determine who should approve; sends to a generic queue or no one | Request is lost or delayed indefinitely; action never proceeds or proceeds without approval |
| Approver not notified | Approval request sent but notification system fails | Approver is unaware; request expires silently; requesting user waits indefinitely |
| Approval request too vague | Approver cannot determine what they are approving from the notification | Approver approves without understanding the scope; the permission is meaningless |
| No timeout enforcement | Approval request sits indefinitely without expiry | Stale requests accumulate; actions that were time-sensitive are executed long after the window has passed |
| Conditional approval not enforced | Approver attaches conditions but the system does not enforce them | Conditions exist on paper but do not constrain the action |

---

## Revocation or Recovery Path

Approved delegated permissions are typically one-time or task-specific — they do not persist beyond the approved action. If the action must be repeated, a new delegated permission request is initiated.

If the requesting user no longer needs the approval before the approver responds, they must be able to cancel the pending request. The cancellation must notify the approver that the request has been withdrawn.

If the action was executed under a delegated approval and the outcome is disputed, the audit log (including the approval decision and any conditions) provides the evidentiary basis for review.

---

## Related Patterns

- **[Scoped permission](scoped-permission.md)** — Delegated permissions often include scope definition; combine these patterns for resource-bounded delegation
- **[Audit-required permission gate](../../docs/patterns/index.md)** — Delegated approvals in regulated contexts typically generate audit records; the audit-required gate pattern governs the audit record requirements
- **[Role escalation](../escalation/role-escalation.md)** — When no approver is available and the action cannot proceed, role escalation provides an alternative path
- **[Revocation](revocation.md)** — Conditionally granted delegated permissions may need revocation if conditions are not met

---

## Example Scenario

**Context:** An enterprise AI assistant is helping a data analyst prepare a report. The analyst asks the AI to query a dataset that contains personally identifiable information at a sensitivity level above the analyst's read access level. The system identifies that the data owner (the DPO's office) must approve access.

**To the analyst:**
> "This query includes fields from the Customer PII dataset, which requires approval from the Data Protection Officer's office before access can be granted.
>
> I've sent an approval request to the DPO team.
> Requested access: Read-only query of Customer PII fields (email, purchase history) for the Q3 Churn Analysis
> Expected response: 1–2 business days (per data access policy)
>
> You'll be notified by email and in-app when they respond. [View request ↗]"

**To the DPO team (approval notification):**
> "[Analyst name] has requested read-only access to Customer PII fields for a Q3 Churn Analysis report.
>
> Fields requested: customer_email, purchase_history, last_activity_date
> Purpose stated: Q3 churn analysis for the sales leadership team
> Access type: Read-only, single query
>
> [Approve] [Deny] [Approve with conditions — e.g., require anonymization]"

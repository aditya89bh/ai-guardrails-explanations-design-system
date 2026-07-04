# Role Escalation

**Category:** Escalation path
**Sub-type:** Role authority
**Severity:** Advisory (Level 1) to Blocking (Level 3)
**Status:** stable
**Phase:** 2F

---

## Definition

Role escalation routes a request, decision, or exception from the current user's role to a role with higher organizational authority. The AI triggers the escalation because the current user's role lacks the authority to approve, execute, or override the requested action — not because the user is wrong or incompetent, but because the organizational model requires a higher-authority decision-maker for this action type.

Role escalation is distinct from human handoff escalation in that it is specifically about organizational authority levels, not about specialist expertise or support queue routing. The escalation target is a person in the same organizational hierarchy as the requester, at a higher tier.

---

## Trigger Conditions

Role escalation is triggered when:

- The requested action or decision exceeds the current user's configured authority ceiling (e.g., approving a budget above their authorization limit)
- A policy rule requires a specific role tier or above to approve this action type (e.g., only Compliance Officers can approve an exception to a data retention policy)
- The user is attempting to override a guardrail or exception that requires a higher-authority sign-off
- The AI's output requires a management or compliance sign-off before it can be acted on (e.g., a generated contract that requires legal counsel review)
- An audit or compliance workflow mandates dual-authority approval (four-eyes requirement)

---

## Routing Target

The routing target is the lowest-authority role eligible to approve or authorize this escalation, as defined in the deployment's role hierarchy configuration. Role escalation must not over-escalate: routing to a C-suite executive when a line manager has sufficient authority is a failure mode that wastes high-value capacity.

Role eligibility must be defined by:
1. The organizational role model configured for this deployment (e.g., RBAC hierarchy)
2. The specific action type requiring escalation (different action types may require different minimum roles)
3. The absence of a closer authority (e.g., if the direct manager is the requester, escalation goes to the skip-level)

---

## Routing Criteria

| Escalation trigger | Minimum escalation target |
|---|---|
| Financial approval above authority limit | Line manager or budget authority for the amount range |
| Policy exception request | Policy owner or compliance officer for the policy in question |
| Override of a safety or quality guardrail | Safety or quality lead |
| Contract or legal document approval | Legal counsel or designated legal reviewer |
| Dual-authority compliance requirement | Any second authorized approver with the required role |
| Data access beyond current permission scope | Data governance authority or data steward |

---

## Context Transfer Requirements

| Context element | Required |
|---|---|
| The requesting user's identity and role | Yes |
| The specific action or decision requiring escalation | Yes |
| Why this action requires a higher-authority decision (which rule or authority ceiling) | Yes |
| Any work the AI or requesting user has already completed | Yes |
| The AI's assessment or recommendation (if any) | Yes |
| Urgency level and deadline (if applicable) | Yes |
| What specific decision or approval the escalation target must provide | Yes |

The escalation notification to the target must make clear what is being asked of them — approve, deny, or redirect — and must not require the target to reconstruct the context from a bare notification.

---

## Authorization Chain

The authorization chain for role escalation defines:

1. **Who can accept:** The minimum eligible role and all roles above it in the hierarchy
2. **Who can delegate:** An eligible approver may delegate to another eligible approver — the delegation must be logged with both identifiers
3. **Who can deny and return:** The escalation target may deny the request (not just the escalation) — the denial reason must be logged and communicated to the requester
4. **Who can redirect:** If the escalation target determines they are not the correct approver, they may redirect — the redirect is logged; the original requester is notified of the redirect

---

## Timeout Behavior

| Timeout stage | Behavior |
|---|---|
| Initial SLA window expires | Reminder notification to the escalation target; urgency level increased in the queue |
| Second SLA window expires | Auto-escalation to the next tier in the configured hierarchy (e.g., from manager to director) |
| Maximum wait threshold | Requester is notified; operational escalation alert is raised; task record is preserved |

For time-critical approvals (contract deadlines, regulatory submission windows), the SLA window must be set tightly enough that timeout escalation can complete before the external deadline. This is a deployment configuration responsibility.

---

## User Communication Requirements

The requesting user must be informed at every stage:

1. **At escalation initiation:** Who the escalation has been routed to (role or name, depending on disclosure policy), the SLA window, and the reference identifier
2. **At SLA expiry:** That the SLA has lapsed and escalation has been elevated; updated expected response time
3. **At resolution:** Approval, denial, or redirect outcome, with the reason if denied
4. **At timeout breach:** That a timeout has occurred, with instructions for urgent follow-up

The escalation target must be informed clearly of what is expected of them — they must not have to infer whether they are being asked to approve, deny, or simply review.

---

## Audit Logging Requirements

Log all of the following for every role escalation event:

- Requesting user identity and role
- The specific action or decision that triggered escalation
- The authority rule or ceiling that was exceeded
- The escalation target (role and, once accepted, individual identity)
- All routing, redirect, and delegation events with timestamps
- The approval, denial, or timeout outcome
- Denial reasons (free-text or structured, depending on deployment configuration)
- All notification events (sent, acknowledged, unacknowledged)
- Total elapsed time from initiation to resolution

In dual-authority (four-eyes) scenarios, both approvers must be individually logged.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Over-escalation | Request routed to an authority level higher than required | High-value approver time is consumed unnecessarily; the organizational hierarchy is bypassed |
| Under-escalation | Request routed to an authority level below the required minimum | Approval obtained without the required authority; compliance gap |
| Escalation to the requester's own chain | Requester is also the approver or can influence the approver | Circular authorization; audit failure |
| No denial path | Escalation only supports approval, not denial | Escalation target cannot properly reject an invalid request |
| Missing context at routing | Approval request arrives without the context needed to evaluate it | Target must request additional information; SLA is at risk |
| No audit of delegation | A delegated approval is not logged | Authorization chain is unverifiable; regulatory audit gap |

---

## Fallback Behavior if Escalation Fails

If the escalation fails — no eligible approver is available within the SLA, or all escalation tiers have been exhausted:

1. The requesting user is notified with a specific alternative path (e.g., emergency approval contact, alternative escalation route outside the system)
2. The task is placed in a held state — not abandoned — so the workflow can resume when an approver is available
3. The operational team receives an alert that an escalation path is exhausted
4. If the action has a hard external deadline that cannot be met, the AI notifies the requester and suggests the appropriate contingency

---

## Related Warning Patterns

- **Modal warning** — often precedes a role escalation when the user attempts an action that requires elevated authorization; the warning surfaces before the escalation initiates
- **Blocking warning** — used when the user's action is blocked pending approval; the block is held until the role escalation resolves

---

## Related Explanation Patterns

- **Decision summary** — the AI should generate a decision summary of its assessment as part of the escalation context package, so the approver has the AI's analysis available
- **Limitation disclosure** — surfaces to the requesting user to explain why their current role cannot proceed

---

## Related Permission Patterns

- **Delegated permission** — role escalation frequently resolves in a delegated permission: the approver authorizes the AI or the requesting user to act on the approver's behalf for this specific task
- **Scoped permission** — may be granted at the resolution of a role escalation to allow the requesting user to proceed without re-escalating for the same action type in the same scope

---

## Related Uncertainty States

- **Insufficient information state** — role escalation may be triggered when the escalation target requires additional information before deciding; the state activates in the escalation context pending the required information

---

## Related Refusal Patterns

- **Policy refusal** — if role escalation fails and there is no path to the required authorization, policy refusal is the appropriate exit for the original request
- **Partial completion** — if the escalation covers only part of a multi-step task, the AI may continue the non-escalated portions under partial completion while the escalation is pending

---

## Related Recovery Flows

- **Retry recovery** — once the escalation resolves with approval, the AI retries the original action under the newly granted authorization
- **Redirect recovery** — if the escalation resolves with a denial, the redirect recovery flow returns the user to an alternative path

---

## Example Scenario

**Context:** A procurement manager asks an enterprise AI to generate and submit a purchase order for a software license costing $62,000. The manager's authorization ceiling is $50,000. The purchase order requires the CFO or a delegate to approve amounts above $50,000.

**Role escalation initiated:**
```
The purchase order is ready but requires CFO-level approval for amounts over $50,000.

I've routed the approval request to [CFO Name / CFO Office] with the following:
• Purchase order (attached)
• Vendor justification summary
• Budget impact assessment for Q3

Reference: PO-2026-07891
Approval SLA: 3 business days

You'll be notified at [your email] when the approval is granted or if there are questions.

If this is time-sensitive, flag the request as urgent using reference PO-2026-07891 — 
the SLA drops to 8 business hours for urgent approvals.
```

The manager has a complete status picture: what was routed, to whom, what it contained, when to expect a response, and how to accelerate if needed. The AI did not attempt the submission — it held it pending the required authority.

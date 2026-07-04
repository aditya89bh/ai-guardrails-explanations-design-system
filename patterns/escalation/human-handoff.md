# Human Handoff (Escalation)

**Category:** Escalation path
**Sub-type:** Human escalation
**Severity:** Caution (Level 2) to Blocking (Level 3)
**Status:** stable
**Phase:** 2F

---

## Definition

The human handoff escalation path routes a request, decision, incident, review, or exception to a human agent — operator, domain expert, reviewer, support specialist, or manager — because the AI's authorization level, policy scope, confidence ceiling, or operational boundary is insufficient to proceed autonomously. This pattern governs the mechanics of that routing: how ownership is assigned, what context transfers, what the user is told, how long the handoff can wait, and what happens if no human accepts it.

**This pattern is distinct from the refusal human handoff (`patterns/refusal/human-handoff.md`).** The refusal variant is triggered by the AI's inability to complete a request and focuses on what the user receives and what the AI can still do. This escalation variant is triggered by authorization or scope constraints and focuses on routing mechanics, ownership, SLA enforcement, and fallback behavior when the handoff fails.

---

## Trigger Conditions

A human handoff escalation is triggered when:

- The AI's authorized action scope does not cover the decision required to proceed (authorization gap)
- A policy rule mandates human review for this request type before the AI can act — the AI can process the request but cannot approve or execute it
- The AI's output is flagged for mandatory human review by a compliance, safety, or quality control policy
- A confidence or confidence + stakes combination exceeds the threshold configured for mandatory human review (e.g., low-confidence medical output requiring physician review)
- The user or operator has explicitly configured this request category to require human oversight
- An upstream pattern (unresolvable state, emergency detection, policy match) routes directly to human handoff as the defined exit path

---

## Routing Target

The routing target is determined by the request type, organizational role model, and deployment configuration:

| Request type | Default routing target |
|---|---|
| Content requiring specialist judgment | Domain expert or specialist team queue |
| Decisions requiring organizational authority | Role-appropriate approver (manager, VP, compliance owner) |
| Safety or harm-flagged content | Safety reviewer or trust and safety team |
| Policy exception requests | Compliance officer or policy owner |
| Support or resolution requests | Support agent or account team |
| Audit-required outputs | Compliance auditor or designated reviewer |

Routing targets must be defined in deployment configuration, not hard-coded in the pattern. The pattern governs the routing mechanism; the configuration governs the target.

---

## Routing Criteria

The routing decision — which specific human or queue receives the escalation — is made by evaluating:

1. **Request type category** — the primary determinant; maps to a configured routing rule
2. **Organizational role or tier of the requesting user** — affects which approver level is appropriate
3. **Urgency signal** — immediate or deferred; affects queue priority
4. **Existing ownership** — if the user already has an assigned account manager or case owner, route to them first
5. **Load and availability** — if a specific agent is assigned but unavailable, routing falls to the queue

The routing system must log which routing rule was applied for every handoff event.

---

## Context Transfer Requirements

The following context must be passed to the receiving human agent at the point of handoff. Omitting any of these is a failure mode.

| Context element | Required | Notes |
|---|---|---|
| User's original request or task description | Yes | Verbatim or accurate summary |
| What the AI was able to complete (if any) | Yes | Partial outputs, analyses, or context the AI generated |
| Why the AI cannot proceed autonomously | Yes | The specific authorization gap, policy rule, or scope constraint |
| Relevant session context | Yes | Session ID, user identity, timestamp, prior turns if relevant |
| Urgency level | Yes | Affects queue priority |
| Any pending decisions or actions awaiting the human | Yes | What specifically the human needs to do |
| User communication preference | If available | How the user expects to hear back |

The context transfer must be machine-structured where possible (JSON or equivalent) to allow the receiving system to ingest it automatically. A free-text summary alone is insufficient in enterprise deployments with routing systems.

---

## Authorization Chain

The authorization chain defines who has authority to accept, redirect, or deny a human handoff escalation:

1. **Accepting the handoff:** Any agent with the role mapped to this routing target can accept
2. **Redirecting the handoff:** Agents may redirect to another queue or specialist if they determine the routing was incorrect — the redirect must be logged
3. **Denying the handoff:** Only agents with escalation administrator rights can deny a handoff and return the task to the AI; the denial reason must be logged
4. **Timeout escalation:** If no agent accepts within the configured SLA window, the timeout escalation path activates (see below)

---

## Timeout Behavior

Every human handoff escalation must have a configured SLA window. Timeout behavior is not optional.

| Timeout stage | Behavior |
|---|---|
| Initial SLA window expires | Escalation is automatically elevated to the next tier in the configured escalation hierarchy |
| Second SLA window expires | The user is notified of the delay with an updated expected resolution time |
| Maximum wait threshold reached | Fallback behavior activates (see below); the event is logged as a timeout breach |

SLA windows are configurable per routing target and request urgency level. The pattern does not prescribe specific durations — these are deployment configuration decisions.

---

## User Communication Requirements

The user must be informed of the handoff at the moment it is initiated. The communication must include:

1. **What is happening:** The AI is routing this to a human — not failing, not ending the session
2. **Who will handle it:** The routing target category (team or role, not necessarily a specific person) and the expected channel of response
3. **Expected timeframe:** The SLA window for initial response
4. **Reference identifier:** A ticket, case, or reference number the user can use to follow up
5. **What to do while waiting:** If any preparatory action would help the human agent, name it
6. **How to escalate further:** If the user needs a response faster than the SLA, the path to urgent escalation

The AI must not communicate the handoff as a failure or an apology — it is a routing decision, not a service breakdown.

---

## Audit Logging Requirements

Audit logging for human handoff escalations is mandatory. Log:

- Session and user identifiers
- The trigger that initiated the escalation (which rule, pattern, or condition)
- The routing target (queue, team, or role)
- The context package transferred
- The timestamp of escalation initiation
- The identity of the agent who accepted the handoff (once accepted)
- Whether a redirect occurred (and the reason)
- The SLA window and whether it was met
- The resolution outcome and timestamp
- Any timeout events and the escalation tier reached

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Missing context transfer | Escalation is routed but the context package is incomplete or missing | Human agent cannot handle the task without starting over; user must repeat themselves |
| No routing target configured | The request type has no routing rule defined in deployment configuration | Escalation silently fails; user is left waiting with no response |
| No timeout enforcement | SLA window passes with no automatic escalation | Escalation stalls; user is not informed; breach goes undetected |
| User not notified | Handoff is initiated silently — user is not told it is happening | User continues to expect AI response; the session appears to hang |
| Silent redirect | An agent redirects the escalation to another queue without logging | Audit trail breaks; ownership becomes unclear |
| Fallback not defined | Timeout escalation fails and no fallback behavior is configured | Total loss of escalation path; user is stranded |

---

## Fallback Behavior if Escalation Fails

If the human handoff escalation fails — routing target is unavailable, SLA is exhausted, or the fallback tier also fails — the system must:

1. Notify the user of the delay with a specific alternative action (contact an emergency line, submit a form, try again in a defined window)
2. Log the failure as a critical operational event
3. Preserve the full escalation record — task context, attempts, timestamps — so the handoff can be resumed when capacity is restored
4. Alert the deployment operations team that the escalation path has failed for this request type

The fallback must be defined in deployment configuration. "We'll get back to you" without a specific path or timeframe is not a valid fallback.

---

## Related Warning Patterns

- **Ambient warning** — may be active in a session where human handoff is a standing requirement for certain output types
- **Policy warning** — often precedes a policy-triggered human handoff escalation

---

## Related Explanation Patterns

- **Decision summary** — the AI should produce a decision summary of what it assessed and why the handoff was triggered, as part of the context package
- **Limitation disclosure** — used in user communication to explain why the AI cannot proceed autonomously

---

## Related Permission Patterns

- **Delegated permission** — the human handoff often resolves in a delegated authorization: the human agent approves the action and the AI executes it upon return
- **Scoped permission** — the escalation may result in a scoped permission grant that expands what the AI can do for this specific task

---

## Related Uncertainty States

- **Unresolvable state** — the unresolvable state routes to human handoff when the task is time-sensitive and a human expert can succeed where the AI cannot
- **Low confidence state** — may trigger human handoff when the deployment policy mandates human review at this confidence level for the output type

---

## Related Refusal Patterns

- **Human handoff (refusal)** (`patterns/refusal/human-handoff.md`) — the refusal-category counterpart. Triggered by inability, not authorization gap. Focuses on what the user receives, not on routing mechanics.
- **Policy refusal** — if the escalation fails entirely and the task cannot be completed through any path, policy refusal may apply

---

## Related Recovery Flows

- **Redirect recovery** — if the human agent resolves the escalation and the AI resumes the task, a redirect recovery flow re-enters the user into the workflow
- **Retry recovery** — if the escalation resolves a blocking condition, the AI retries the original task under the new authorization

---

## Example Scenario

**Context:** An enterprise AI assistant is asked to approve a software purchase request for $85,000. The AI's authorized approval threshold for this deployment is $25,000. The request exceeds the AI's authorization ceiling by the configured margin that requires VP-level human approval.

**Escalation initiated:**
```
Your software purchase request for $85,000 has been routed for approval.

This amount requires VP-level authorization, which is outside my approval scope. 
I've routed the full request with supporting documentation to your VP of Technology.

Reference: PRQ-2026-04471
Expected response: Within 2 business days

What I've passed along:
• Purchase request summary and vendor justification
• My cost-benefit analysis (completed separately)
• Budget impact assessment for this quarter

You'll hear back via email. If you need a faster response, contact your VP directly 
or flag this case as urgent using reference PRQ-2026-04471.
```

The AI has completed all the analytical work it is authorized to do and has transferred the decision — not the task — to the appropriate human authority with the full context needed to decide.

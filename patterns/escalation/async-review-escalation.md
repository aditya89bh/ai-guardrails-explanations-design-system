# Async Review Escalation

**Category:** Escalation path
**Sub-type:** Non-immediate review
**Severity:** Informational (Level 0) to Caution (Level 2)
**Status:** stable
**Phase:** 2F

---

## Definition

Async review escalation routes a request, output, or decision to a review queue for non-immediate human evaluation. The user does not wait for the review to complete before the current session continues in some form. The review is deferred — time-separated from the originating interaction — and the AI's continued behavior depends on whether the outcome of the review is needed before proceeding or can be handled when the review resolves.

Async review escalation is the lowest-urgency escalation path. It is appropriate when the risk of proceeding without immediate review is low enough that the user's workflow does not need to be fully blocked, but the review is still required before certain follow-on actions can be executed.

Async review differs from all other escalation paths in that the user continues to use the system after escalation is initiated — they are not waiting at a blocking prompt. The escalation runs in the background.

---

## Trigger Conditions

Async review escalation is triggered when:

- A policy rule requires human review of this output type before it can be published, sent, or acted on — but does not require the review to be synchronous
- An AI-generated output requires a quality or accuracy review as part of an internal editorial, compliance, or governance workflow
- An exception request (e.g., a policy exception, a scope extension) requires review and approval before the exception can be granted — but the user can continue with other work while it is processed
- The AI generates output that meets a threshold for discretionary review (not a mandatory review, but configured as "flag for human review if above confidence threshold in a sensitive domain")
- A multi-step workflow has a review gate that must be cleared before the AI can proceed to a specific consequential step — the earlier steps can complete, the review gate holds the consequential step

---

## Routing Target

The routing target is a named review queue or workflow, not an individual:

| Review type | Routing target |
|---|---|
| Content quality review | Editorial review queue |
| Compliance or regulatory review | Compliance review queue |
| Policy exception review | Policy governance queue |
| Legal or contract review | Legal review queue |
| Data governance review | Data stewardship queue |
| AI output accuracy review | Human-in-the-loop review queue |

Routing to a named queue (not an individual) ensures the review is processed even if specific reviewers are unavailable. Queue assignment to an individual reviewer is the receiving system's responsibility, not the AI's.

---

## Routing Criteria

| Factor | Effect on routing |
|---|---|
| Output or request type | Determines which review queue receives the escalation |
| Domain sensitivity | Affects queue priority within the target queue |
| Pending action dependency | If a consequential step is held pending this review, the escalation is marked as workflow-blocking even if not time-critical overall |
| User role and history | May affect whether the review is mandatory or discretionary for this user |

---

## Context Transfer Requirements

| Context element | Required |
|---|---|
| What is being submitted for review | Yes — the full output or request, not a summary |
| Why it is being submitted (trigger condition) | Yes |
| What follow-on action is pending this review (if any) | Yes — the reviewer must know what they are unblocking |
| The originating user's identity and context | Yes |
| Any AI assessment or confidence signal relevant to the review | Yes |
| The SLA by which the review must complete (if there is a downstream deadline) | Yes, if applicable |
| Reference identifier | Yes — the user and the AI use this to track status and receive the outcome |

---

## Authorization Chain

Async review escalations are authorized to proceed at the queue level. Individual review assignment is the queue management system's responsibility. The authorization chain for async review is:

1. **Queue membership:** Any reviewer assigned to the target queue is authorized to review this submission
2. **Approval authority:** Approval is binding when provided by any queue-eligible reviewer (unless the policy requires a specific role or dual approval)
3. **Denial authority:** Same as approval authority — reviewers can deny as well as approve
4. **Return for revision:** Reviewers may return the submission to the AI or the originating user for revision rather than approving or denying — the return must include specific revision instructions
5. **Escalation within the review queue:** If a reviewer determines the submission requires higher authority, they may escalate within the queue system — this is logged as an internal queue event

---

## Review Queue Behavior

The review queue holds the submission until a reviewer takes action. The queue must:

- Display submissions in priority order (by SLA proximity, then by submission time)
- Prevent duplicate assignment — two reviewers should not simultaneously work the same submission
- Support assignment, reassignment, and return-for-revision workflows
- Track reviewer actions with timestamps and identities
- Surface SLA expiry warnings to the queue manager before breaches occur

Queue management is the responsibility of the deployment's workflow infrastructure, not the AI. The AI's responsibility ends at submission; it resumes when it receives the review outcome.

---

## SLA and Timeout Handling

| Timeout stage | Behavior |
|---|---|
| Review SLA approaching (configurable warning threshold) | Queue manager receives a warning; priority in queue is elevated |
| Review SLA breached | Queue manager receives an alert; submission is flagged as overdue; the originating user is notified of the delay |
| Maximum wait threshold | Submission is escalated within the queue to senior reviewer or queue manager; an operational alert is raised |
| Total queue failure | If no review occurs within the maximum threshold and no fallback is configured, the pending consequential action is held indefinitely — this state must trigger an operational alert |

---

## User Expectation Setting

The user must be informed at multiple points:

1. **At submission:** What was submitted for review, to what queue, the reference identifier, and the expected review SLA
2. **At SLA expiry (if applicable):** That the SLA has been exceeded; updated expected completion time
3. **At outcome receipt:** Approval (AI continues with the pending action), denial (AI applies the appropriate refusal or alternative suggestion), or return for revision (the user is asked to revise specific elements before resubmission)

The AI must not proceed with the pending consequential action until the review outcome is received and validated. If the user asks about the status of a pending review, the AI must be able to look it up by reference identifier and report the current state.

---

## Status Tracking

The AI must maintain a status record for every open async review escalation:

| Status | Meaning |
|---|---|
| Submitted | In the review queue; not yet assigned |
| In review | Assigned to a reviewer; in progress |
| Returned for revision | Reviewer requested changes; awaiting revision |
| Approved | Review complete; pending action is unblocked |
| Denied | Review complete; pending action is blocked |
| Overdue | SLA breached; escalation in progress within the queue |

The user should be able to query the status of their pending review at any time. The AI should proactively notify the user when the status changes to Approved, Denied, or Returned for revision.

---

## Approval and Denial Result Handling

**On approval:**
- The AI proceeds with the pending consequential action
- The approval event is logged with the reviewer's identity and timestamp
- The user is notified that the review is complete and the action has proceeded

**On denial:**
- The AI applies the appropriate refusal or alternative suggestion pattern
- The denial reason (if provided by the reviewer) is communicated to the user
- The denial event is logged with the reviewer's identity, timestamp, and reason

**On return for revision:**
- The AI surfaces the reviewer's specific revision instructions to the user
- The user revises and the AI resubmits to the review queue (a new submission, not the same one)
- The original submission record remains; the revised submission is linked to it in the audit trail

---

## Audit Logging Requirements

Log for every async review escalation:

- Submission timestamp, submitting user, and submission content reference
- Queue target and initial priority
- Assignment events (who received the submission and when)
- All status transitions with timestamps
- Approval or denial outcome, reviewer identity, and reason
- Revision cycles (how many, with timestamps)
- Whether the SLA was met
- Any timeout or escalation events within the queue
- The final action taken by the AI based on the outcome

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Missing outcome handling | The review queue returns an outcome but the AI does not act on it | The pending action is held indefinitely; the user is not notified |
| No status tracking | The AI cannot respond to "what is the status of my review?" | User experience degrades; trust in the async workflow erodes |
| SLA breach not surfaced | SLA expires without alerting the queue manager or the user | Reviews pile up undetected; consequential actions are blocked without cause |
| Duplicate submission | The same output is submitted to the review queue more than once | Reviewers duplicate work; conflicting outcomes are possible |
| Return-for-revision not actionable | The reviewer returns for revision without specific instructions | The user and AI cannot revise effectively; a revision cycle is wasted |

---

## Fallback Behavior if Escalation Fails

If the review queue system is unavailable:

1. The submission is stored locally in a durable queue for resubmission when the system recovers
2. The user is informed that the review submission encountered a technical issue and the pending action remains on hold until submission is confirmed
3. An operational alert is raised for the deployment infrastructure team
4. If the pending action has a hard external deadline that cannot be met while waiting for the queue to recover, the AI notifies the user and routes to an emergency escalation or human handoff for out-of-band resolution

---

## Related Warning Patterns

- **Ambient warning** — if the review queue is experiencing degraded performance or elevated SLA times, an ambient warning informs users in relevant sessions
- **Progressive warning** — in workflows with multiple steps, a progressive warning pattern may signal an approaching review gate before the user completes the step that triggers it

---

## Related Explanation Patterns

- **Decision summary** — the AI should include a decision summary with the submitted output to give reviewers the context they need to evaluate it efficiently
- **Confidence disclosure** — if the output being reviewed is moderate or low confidence, the confidence disclosure should accompany the submission so reviewers can weight it appropriately

---

## Related Permission Patterns

- **Session permission** — the review may grant a session-scoped permission that allows the AI to proceed with similar outputs without re-reviewing within the same session
- **Persistent permission** — for users who routinely produce outputs in this category and consistently receive approvals, a persistent permission upgrade may remove the review requirement

---

## Related Uncertainty States

- **Moderate confidence state** — async review escalation is frequently triggered when outputs are at moderate confidence and the deployment policy requires review before action at this confidence level
- **Stale context state** — if an output contains stale data, the review gate may be used to allow a human reviewer to confirm that the output is acceptable before the user acts on it

---

## Related Refusal Patterns

- **Partial completion** — if the pending action is blocked pending review but other parts of the task can proceed, partial completion applies to the deliverable-so-far
- **Alternative suggestion** — if the review is denied, alternative suggestion surfaces an alternative path for the user

---

## Related Recovery Flows

- **Retry recovery** — upon approval, the AI retries the pending action under the newly authorized state
- **Redirect recovery** — upon denial, the redirect recovery flow returns the user to an alternative path toward their goal

---

## Example Scenario

**Context:** A content operations AI is being used to generate marketing copy for a new product launch. The deployment policy requires that all externally publishable marketing content pass through a brand and compliance review queue before it can be uploaded to the CMS or sent to the distribution platform. The review queue has a 24-hour SLA.

**Async review escalation initiated:**
```
The marketing copy is ready and has been submitted for brand and compliance review.

Reference: MCR-2026-04201
Queue: Brand and Compliance Review
Expected review completion: Within 24 hours

You'll receive an email notification when:
• The review is approved — at which point I can publish to the CMS automatically
• The review requests revisions — I'll share the specific feedback so we can update the copy
• The SLA has been exceeded — if 24 hours pass without a review decision

In the meantime, I can help you prepare:
• The social media variant of this copy (shorter, same review queue — can be submitted together)
• The email campaign version (same copy structure, separate template)
```

The user knows their work is not blocked — they can continue with related tasks while the review proceeds. They have a specific reference, a clear timeline, and a proactive list of what to do next.

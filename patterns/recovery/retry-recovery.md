# Retry Recovery

**Category:** Recovery flow
**Sub-type:** Retry
**Severity:** Informational (Level 0) to Advisory (Level 1)
**Status:** stable
**Phase:** 2G

---

## Definition

Retry recovery is the recovery flow that re-attempts the same or substantially similar action after a transient failure, confidence degradation, or recoverable block — without requiring the user to reformulate their request or pursue a different goal. The underlying goal and approach remain the same; what changes is the attempt itself. Retry recovery exists in three modes: automatic (AI-initiated without user action), assisted (AI-initiated with user acknowledgment), and manual (user-initiated after being given the option to retry).

Retry recovery is not repair. Repair (see `repair-recovery.md`) changes something before resuming — corrects data, state, or configuration. Retry re-attempts the same action under the same conditions, appropriate when the blocking condition was transient rather than structural.

---

## Problem Solved

Transient blocking conditions — system timeouts, temporary data unavailability, momentary confidence threshold breaches — should not terminate a user's workflow permanently. Retry recovery allows the AI to re-attempt cleanly without the user having to restart from scratch, while preventing runaway retry loops and duplicate-action side effects.

---

## When to Use

- A system escalation timed out and the target system is now available
- A confidence score temporarily dropped below threshold due to a data retrieval issue that has since resolved
- A permission gate was not processed correctly and the authorization is valid on re-attempt
- A transient integration error (network timeout, rate limit) prevented an action that would succeed on re-attempt
- The user made a minor modification to their input and is attempting the same underlying action again
- An upstream dependency (data feed, policy engine) was temporarily unavailable and has recovered

---

## When NOT to Use

- The blocking condition is structural, not transient — a policy prohibition, a confirmed authorization gap, a hard confidence floor in this domain. These require redirect, repair, or escalation, not retry.
- The action has already partially completed — retrying a partially-completed action without idempotency guarantees risks duplication.
- The user has reformulated their request significantly — this is a new request, not a retry of the original.
- Retry limits have been reached for this action type — further retries are not permitted without human review or explicit user override.
- The blocking condition produced a result (a refusal decision, a policy determination) that is deterministic — re-running the same request will produce the same result.

---

## Entry Conditions

Retry recovery activates when:

- A prior attempt at an action was blocked by a transient condition that has since resolved or is expected to resolve within a retry window
- An error was classified as retryable (not permanent) by the AI or the calling system
- The retry count for this action is below the configured maximum
- The action has not been partially completed in a way that makes re-attempt unsafe without cleanup

---

## Exit Conditions

Retry recovery exits successfully when:

- The retried action completes without error
- The output passes validation
- Any dependent downstream steps can proceed

Retry recovery exits without success when:

- Retry limit is reached — exits to redirect recovery or human handoff escalation
- The condition is reclassified as structural (non-transient) on retry — exits to the appropriate refusal or escalation path
- A duplicate action is detected — exits immediately with duplicate prevention; user is notified

---

## Recovery Objective

Return the user to productive task completion by re-executing the blocked action without duplicating side effects, without exceeding safe retry limits, and without burdening the user with re-specifying their intent.

**Success criteria:** The action completes, the output is valid, and no duplicate side effects were produced.

**Completion conditions:** The recovered action returns a successful result and dependent workflow steps can proceed.

---

## Recovery Owner

| Mode | Owner |
|---|---|
| Automatic retry | AI system — user is not involved until the retry succeeds or fails |
| Assisted retry | AI system initiates; user is notified of the retry and may approve or abort |
| Manual retry | User — the AI presents the retry option; the user decides whether to retry |

---

## Recovery Modes

### Automatic Retry

Appropriate for: transient integration errors (timeouts, rate limits, momentary data unavailability) where retry is safe and invisible to the user.

Requirements:
- Idempotency: the action must be safe to re-execute without producing duplicate side effects. If idempotency cannot be confirmed, automatic retry is not permitted.
- Backoff: exponential backoff is required between automatic retries. Fixed-interval retry loops are prohibited.
- Retry limit: a maximum retry count must be configured. When reached, the retry exits to assisted or manual mode.
- User visibility: automatic retry that succeeds need not surface the retry. Automatic retry that fails and exits to a higher mode must surface the history ("I tried 3 times; the service is still unavailable").

### Assisted Retry

Appropriate for: actions where the AI determines a retry is likely to succeed, but the user should be aware of and confirm the re-attempt before it proceeds.

Requirements:
- The AI must present a specific reason why a retry is warranted: what changed or why a retry is expected to succeed now.
- The user must be able to abort the retry without consequence.
- If the retry requires any adjustment (e.g., a slightly modified parameter), the AI must disclose the adjustment.

### Manual Retry

Appropriate for: situations where the AI cannot determine independently whether a retry would succeed, and the user is better positioned to decide.

Requirements:
- The AI presents the retry option with: what failed, what the user can do to increase the chance of success, and what happens if they choose not to retry.
- If the user selects retry, the AI proceeds immediately.
- If the user declines, the AI transitions to redirect recovery or abandon recovery as appropriate.

---

## Duplicate Prevention

Duplicate prevention is mandatory for any retry that involves:

- Writing to an external system (databases, APIs, file stores)
- Sending a communication (email, notification, message)
- Executing a financial transaction or approval

For these action types, the AI must:
1. Assign an idempotency key to the original attempt before executing it
2. Verify that the idempotency key has not already produced a successful result before re-attempting
3. If a duplicate result is detected, surface the original result and abort the retry

Idempotency enforcement is the responsibility of the AI system for AI-initiated retries and the calling API for system-level retries.

---

## Retry Limits and Backoff

- Retry limits are configured per action type and deployment. The default maximum is three retries for automatic mode before escalating to assisted or manual.
- Backoff between automatic retries: minimum 1 second × 2^(retry_count). The AI must not execute retry loops at zero delay.
- If the retry limit is exceeded without success, the AI transitions to the appropriate next recovery flow — redirect, repair, or escalation — not to indefinite waiting.

---

## Required Explanation Patterns

- **Limitation disclosure** — when surfacing a failed retry to the user, explain what the transient condition was and why it prevented the action.
- **Confidence disclosure** — if the retry is triggered by a confidence dip that has since recovered, disclose the confidence improvement that enabled the retry.

---

## Required Permission Patterns

- **One-time permission gate** — required if the retried action is consequential and the original one-time permission grant has expired or was not recorded.
- Automatic retries on previously authorized actions do not require a new permission gate if the original authorization is still valid (session scope has not ended, persistent permission is active).

---

## Related Uncertainty States

- **Stale context state** → if fresh data has arrived that resolves the stale context, retry recovery can proceed
- **Insufficient information state** → retry is appropriate only if the missing information has since become available; otherwise redirect applies
- **Moderate confidence state** → if confidence has recovered above the threshold, retry recovery can proceed for the previously blocked action

---

## Related Refusal Patterns

- **Partial completion** → retry recovery may re-attempt the excluded portions of a partial completion if the blocking condition was transient
- **Clarification request** → once the user has answered the clarifying question, the original action can be retried under retry recovery

---

## Related Escalation Paths

- **System escalation** → retry recovery often follows a system escalation resolution — once the target system confirms availability, the original action is retried
- **Async review escalation** → on approval, the pending action is retried under retry recovery
- **Human handoff (escalation)** → once the human agent resolves the blocking condition, the AI may retry the original action under retry recovery

---

## User Communication

| Mode | Communication |
|---|---|
| Automatic retry (success) | No communication required unless the user asked for status |
| Automatic retry (failure, transitioning to assisted/manual) | "I tried [n] times — the issue hasn't resolved. [Reason]. You can retry now or I can help you find another path." |
| Assisted retry | "I'd like to try again — [what changed]. Shall I proceed?" |
| Manual retry | "[What failed] [Why a retry might work now] [Option to retry or choose alternative]" |

---

## Audit Requirements

**Configurable.** For consequential actions, log:
- All retry attempts with timestamps and outcomes
- The idempotency key used
- Whether duplicate prevention was triggered
- The retry mode used (automatic/assisted/manual)
- How the recovery flow exited (success, limit reached, user declined)

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Retry without idempotency key | Re-attempting a write action without verifying the original attempt's outcome | Duplicate side effects: duplicate messages sent, duplicate records created, duplicate charges |
| Zero-delay retry loop | Retrying at maximum speed with no backoff | Amplifies the original error; causes downstream system overload |
| Retry of a deterministic failure | Re-attempting an action that will produce the same refusal or error result | Wastes user time; generates noise in audit logs; the user should have been redirected |
| Missing retry count display | User is not told how many retries have been attempted | User cannot assess whether to wait or change approach |
| Retry beyond limit without transition | Continuing to retry after the configured maximum without transitioning to the next flow | User is left waiting indefinitely; the situation cannot improve |

---

## Fallback Behavior

If retry recovery does not succeed within the configured limit:

1. Transition to redirect recovery — present an alternative path to the same goal
2. If no redirect is available, transition to human handoff escalation
3. Preserve all context so the user does not have to re-specify their intent if they pursue the goal later

---

## Accessibility Considerations

- Automatic retry must not cause unexpected layout shifts or content reflows in the UI that disrupt screen reader users or keyboard navigation
- Retry progress indicators (if shown) must use `aria-live="polite"` so they are announced without interrupting the user's current interaction
- When transitioning from automatic to manual retry, the focus must move to the retry prompt so keyboard users are not left in the previous context

---

## Enterprise Considerations

- **Idempotency at scale:** In multi-tenant deployments, idempotency keys must be scoped to tenant + session + action to prevent cross-tenant collision
- **Retry budget governance:** Enterprise deployments should configure retry limits by action type and track aggregate retry rates as an operational health metric — elevated retry rates indicate systemic issues
- **Audit for regulated actions:** Financial transactions, regulatory submissions, and clinical orders must log all retry attempts individually, including failed attempts

---

## Example Scenario

**Context:** An enterprise AI is processing a vendor invoice and submitting it to the organization's ERP system via API. The API returns a 503 (service temporarily unavailable). The action is idempotency-key tagged. The AI attempts automatic retry with exponential backoff.

**Attempt 1 (automatic, t+0):** API returns 503. Retry scheduled.
**Attempt 2 (automatic, t+2s):** API returns 503. Retry scheduled.
**Attempt 3 (automatic, t+6s):** API returns 503. Automatic retry limit reached.

**Transition to assisted retry:**
```
I've tried to submit Invoice #INV-2026-4421 three times in the last 8 seconds — 
the ERP system is returning a temporary unavailability error.

The ERP system's status page shows a maintenance window ending at 3:15 PM.

Options:
[Retry at 3:15 PM automatically] [Retry now] [I'll handle it manually]
```

The user selects "Retry at 3:15 PM automatically." The AI schedules a deferred retry, preserves the context, and notifies the user when the submission succeeds at 3:17 PM.

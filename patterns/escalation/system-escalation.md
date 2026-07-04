# System Escalation

**Category:** Escalation path
**Sub-type:** System authority
**Severity:** Advisory (Level 1) to Blocking (Level 3)
**Status:** stable
**Phase:** 2F

---

## Definition

System escalation routes a request, task, event, or decision from the current AI system or component to another automated system with greater authority, broader scope, or specialized capability. No human is in the immediate escalation path — the routing is from one system to another. System escalation applies when the AI cannot proceed autonomously and the solution requires a different system's authority or capability, not a human decision-maker.

Common system escalation paths: an AI assistant routes a policy evaluation to a policy engine; a local agent routes a task to a central orchestrator; a product AI routes a workflow to an enterprise approval system; a data access request is escalated to an entitlement management system.

System escalation is the most technically complex escalation path. It requires well-defined API or event contracts, retry logic, observability, and failure handling.

---

## Trigger Conditions

System escalation is triggered when:

- The AI's local policy evaluation is insufficient for the request — a dedicated policy engine has authority over this decision
- The task requires data or an action that the AI cannot access directly, but a connected system is authorized to provide or execute it
- A workflow step requires orchestration across multiple systems that a central coordinator must manage
- A compliance check, entitlement evaluation, or risk scoring must be performed by an authoritative external system
- The AI detects a condition (anomaly, threshold breach, policy violation) that must be reported to a monitoring or incident management system
- The AI's local context is insufficient and a system with broader context (e.g., a central knowledge graph, an enterprise data warehouse) must be consulted

---

## Routing Target

The routing target is a defined system endpoint configured for this deployment:

| Escalation trigger | Example routing target |
|---|---|
| Policy evaluation required | Policy engine (e.g., OPA, custom policy service) |
| Authorization check required | Identity and access management (IAM) system or entitlement service |
| Multi-step workflow coordination | Enterprise workflow orchestrator (e.g., Temporal, Airflow, custom orchestration layer) |
| Compliance or risk scoring | Compliance management system or risk engine |
| Anomaly or incident detection | Observability platform, SIEM, or incident management system |
| Data access outside local scope | Data governance or catalog system with access control enforcement |

Routing targets must be defined in deployment configuration as named integrations, not as ad hoc endpoint strings. The routing target is always a system, never a person — system escalation that requires a human decision uses role escalation or human handoff in sequence.

---

## Routing Criteria

The routing decision is made by evaluating:

1. **Event or request type** — the primary routing key; maps to a configured integration endpoint
2. **Payload schema** — the escalation system must receive a payload that matches the target system's expected schema
3. **Priority signal** — affects queue depth or routing urgency at the target system
4. **Idempotency key** — every escalation event must carry a unique idempotency key to prevent duplicate processing on retry

---

## Context Transfer Requirements

| Context element | Required | Format |
|---|---|---|
| Request or event type | Yes | Structured (enum or schema-defined string) |
| Full request or event payload | Yes | Structured (JSON or equivalent) |
| Originating session and user identifiers | Yes | Structured |
| Timestamp of escalation initiation | Yes | ISO 8601 |
| Idempotency key | Yes | UUID or equivalent unique identifier |
| Expected response type and schema | Yes | Structured — the target system must know what to return |
| Callback endpoint or correlation ID | Yes | For async escalations; the response routes back to the originating AI |
| Priority level | If applicable | Affects processing order at the target |

Context transfer in system escalation must be machine-structured throughout. Free-text summaries are not appropriate — the target system cannot parse them.

---

## Authorization Chain

System escalation authorization is enforced at the integration layer:

1. **Service identity:** The AI system must authenticate to the target system using a service account, token, or certificate with the appropriate permissions for this escalation type
2. **Action scope:** The service identity must have only the permissions required for this specific escalation type — principle of least privilege applies
3. **Audit of service actions:** All system escalation events must be auditable at both the originating system and the receiving system — both must log the event with the same correlation identifier
4. **Target system authority:** The target system's response is authoritative — if the policy engine says "deny," the AI must honor it without override

---

## Timeout Behavior

System escalations must define synchronous and asynchronous timeout behavior separately:

| Mode | Timeout behavior |
|---|---|
| Synchronous (inline call) | Configured request timeout; if exceeded, retry once with exponential backoff; if still failed, activate fallback |
| Asynchronous (event-based) | Configured response deadline; if no response by deadline, send a status check; if no response by secondary deadline, activate fallback |
| Retry budget | Maximum retry count is configured per integration; retries beyond the budget activate fallback |

The AI must not block a user interaction indefinitely waiting for a system escalation to resolve. If the synchronous call cannot return in a user-acceptable latency window, escalate asynchronously and communicate the deferred resolution to the user.

---

## User Communication Requirements

For system escalation, user communication depends on whether the escalation is transparent or opaque to the user:

- **Transparent escalation (user can see it is happening):** Inform the user that the AI is consulting an authoritative system; provide an expected latency window; do not expose internal system names unless the deployment policy allows it
- **Opaque escalation (internal to the system):** No user communication is required — the system escalation is an internal implementation detail
- **Deferred resolution (async):** Inform the user that processing is in progress and will complete asynchronously; provide a reference identifier; state the expected completion window

Never leave the user in a state where they believe the AI has responded when it is actually waiting for a system escalation response. A clear "processing" state with a time estimate is required.

---

## Observability Requirements

System escalation paths must be observable in production:

- Every escalation event must emit a structured log entry with the correlation ID, routing target, payload type, and outcome
- Escalation success rate, latency, and timeout rate must be tracked as metrics for every integration endpoint
- Alert thresholds must be configured for: elevated error rate, sustained high latency, and sustained timeout rate
- Failed escalations must be surfaced in the deployment operations dashboard, not only in logs

Unmonitored system escalation paths are a production reliability risk. An escalation path that fails silently is indistinguishable from one that succeeds silently.

---

## Audit Logging Requirements

Log for every system escalation event:

- Originating system and session identifiers
- Escalation target system identifier
- Event type and payload (summary or full, depending on data classification)
- Idempotency key
- Timestamps: initiation, receipt confirmation, response, completion
- Outcome: success, failure, timeout, retry count
- Any retry events with timestamps
- Service identity used for authentication

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| No idempotency key | Escalation is retried without an idempotency key | Duplicate events processed at the target; data integrity failure |
| Schema mismatch | Payload does not match the target system's expected schema | Target system rejects the event; escalation fails silently if the error is not handled |
| Service identity over-permissioned | The AI's service account has broader permissions than required for this escalation | Security risk; audit gap |
| No timeout configured | Synchronous call blocks indefinitely | User interaction hangs; system resource exhaustion |
| Silent failure | The escalation fails but no error is raised or logged | Downstream processing never occurs; issue is not detected |
| No correlation between systems | Originating and receiving system logs are not correlated by ID | Cannot reconstruct the event history across systems for audit or debugging |

---

## Fallback Behavior if Escalation Fails

If system escalation fails after retries are exhausted:

1. Log the failure with full context, timestamps, and retry history
2. Raise an operational alert — system escalation failures are infrastructure events, not just application errors
3. Determine whether the task can continue without the escalation result:
   - If yes, continue with a disclosed limitation (e.g., "proceeding without policy engine validation — results should be reviewed before action")
   - If no, halt the task and inform the user with the expected resolution path (when the target system recovers, the task will resume or be resubmitted)
4. Preserve the task state so the escalation can be re-attempted when the target system is available

---

## Related Warning Patterns

- **Ambient warning** — when a connected system is experiencing degraded availability, an ambient warning at the session level informs users that certain AI capabilities may be limited

---

## Related Explanation Patterns

- **Limitation disclosure** — surfaces to the user when a system escalation failure limits the AI's ability to produce authoritative output
- **Reasoning trace** — for compliance-relevant system escalations, the full escalation chain should be included in the reasoning trace for audit purposes

---

## Related Permission Patterns

- **Scoped permission** — the target system's response may include a scoped permission grant that expands what the AI can do for this specific task
- **Delegated permission** — in multi-system authorization chains, the target system may delegate authority back to the AI for specific follow-on actions

---

## Related Uncertainty States

- **Stale context state** — if the connected system's data is outdated, the AI may enter a stale context state after a system escalation that returns aged data
- **Insufficient information state** — if the target system returns a non-definitive response (insufficient data for a policy decision), the AI may enter the insufficient information state

---

## Related Refusal Patterns

- **Policy refusal** — if the policy engine returns a deny decision, the AI applies a policy refusal to the user's request, citing the policy engine's determination
- **Constrained completion** — if the system escalation returns a partial authorization (allowed with constraints), the AI applies constrained completion

---

## Related Recovery Flows

- **Retry recovery** — once the target system recovers from a failure, the task is retried under the retry recovery flow
- **Redirect recovery** — if the target system is permanently unavailable, the redirect recovery flow routes the user to an alternative path

---

## Example Scenario

**Context:** An enterprise AI assistant is helping a data analyst generate a report that requires joining datasets from two different data domains. One domain is in the analyst's authorized scope; the other requires an entitlement check through the organization's data governance system (a centralized entitlement management platform) before the AI can retrieve it.

**System escalation initiated (transparent to user):**
```
[Checking data access authorization...]

Verifying your access to the customer transaction dataset — this dataset requires 
entitlement confirmation from the Data Governance Platform before I can retrieve it.

This typically takes a few seconds.
```

*[Escalation occurs internally: AI calls the entitlement service with the analyst's identity and the dataset identifier.]*

**Escalation returns: access granted**
```
Access confirmed.
```

*[AI retrieves the dataset and continues with the report.]*

**If escalation fails (service timeout after retries):**
```
The Data Governance Platform is not responding at the moment. I can complete the 
report using the data in your authorized scope — the customer transaction analysis 
will need to be added once access can be confirmed.

I'll include a placeholder section for the transaction data with a note to complete 
it once access is restored. Reference: DGA-20260704-0882 — use this to follow up 
with the data governance team.
```

The analyst understands exactly what happened, what the report contains, what is missing, and how to resolve it — without any technical details of the system escalation mechanics.

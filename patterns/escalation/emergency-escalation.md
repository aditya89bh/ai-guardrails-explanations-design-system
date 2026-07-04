# Emergency Escalation

**Category:** Escalation path
**Sub-type:** Critical risk
**Severity:** Critical (Level 4)
**Status:** stable
**Phase:** 2F

---

## Definition

Emergency escalation is an immediate, high-priority routing of a safety, security, compliance, or operational emergency — a situation in which delay creates material harm risk, regulatory liability, or operational failure. Emergency escalation bypasses normal queues, SLA windows, and sequential approval chains. It is the only escalation path that operates in interrupt mode: it does not wait for the current workflow to complete before initiating.

Emergency escalation is not a high-priority version of another escalation pattern. It is qualitatively different: it can interrupt active sessions, it routes to on-call or emergency response channels that are active 24/7, and it mandates immediate notification across multiple parties simultaneously.

This pattern must not be triggered for non-emergency situations. Over-triggering emergency escalation erodes its operational effectiveness — it is the highest-cost escalation signal, and its credibility depends on it being reserved for genuine emergencies.

---

## Trigger Conditions

Emergency escalation is triggered when:

- **Safety emergency:** Content or context indicates an imminent threat to life, safety, or physical wellbeing (including user distress signals meeting crisis thresholds)
- **Security incident:** A detected or suspected unauthorized access, data breach, or system compromise that requires immediate containment
- **Critical compliance failure:** A regulatory violation or imminent violation that carries mandatory immediate notification requirements under applicable law or regulation (e.g., a data breach requiring notification within 72 hours under applicable law)
- **Operational emergency:** A system failure, service outage, or data integrity event affecting critical business operations that requires immediate incident response
- **Policy-defined emergency:** A policy rule explicitly classifies this trigger condition as a mandatory emergency escalation event for this deployment

**What does not qualify:**
- High-importance but non-urgent requests (use async review escalation or role escalation)
- Situations where the user or operator can wait for a normal escalation path
- Any escalation that can be adequately handled by a standard SLA window without material risk of harm

---

## Routing Target

Emergency escalation routes simultaneously to multiple targets. The routing is non-sequential — all required parties are notified immediately, not in a chain.

| Emergency type | Primary routing targets |
|---|---|
| Safety emergency (life safety, crisis) | On-call safety team, emergency services (if immediate danger), user's designated emergency contact if configured |
| Security incident | On-call security operations center (SOC), designated incident commander, and the deployment's data protection officer (DPO) if personal data is involved |
| Critical compliance failure | On-call compliance officer, legal counsel if regulatory notification is triggered, data protection officer |
| Operational emergency | On-call engineering team, incident commander, and the deployment's technical operations lead |

Routing targets must be defined in deployment configuration as named on-call contacts or channels, not as static email addresses. On-call rotations change; the escalation system must pull the current on-call state at routing time.

---

## Routing Criteria

Emergency escalation overrides all standard routing criteria:

1. **Emergency type classification** — determines the required notification set
2. **Severity and scope** — affects escalation breadth (a localized incident may require fewer parties than a broad system compromise)
3. **Time-of-day and on-call state** — the routing system must resolve who is currently on-call for each required role
4. **Affected-party scope** — if the emergency affects multiple users, tenants, or systems, the notification scope expands accordingly

---

## Context Transfer Requirements

Emergency escalation context must be immediate and complete. The receiving parties cannot ask follow-up questions before taking action — they must have enough information to act from the first notification.

| Context element | Required |
|---|---|
| Emergency type and classification | Yes — must be prominent, not buried |
| What the AI detected or received that triggered escalation | Yes — verbatim or exact summary; no paraphrasing |
| Affected users, sessions, data, or systems | Yes — to the extent known |
| Timestamp of detection | Yes |
| Session and deployment identifiers | Yes |
| Current status (ongoing, contained, unclear) | Yes |
| Any immediate action the receiving party should take | Yes — specific, not generic |
| What the AI has done (if anything) to contain or limit harm | Yes |

The context package must be sent in every notification channel simultaneously — not as a link to a dashboard that requires the recipient to log in before seeing the context.

---

## Authorization Chain

Emergency escalation does not require pre-authorization to initiate — it is self-authorizing within the limits of the deployment's policy configuration. The reasoning: requiring authorization before initiating an emergency escalation would defeat its purpose.

Post-initiation authorization requirements:
- The incident commander or designated emergency authority must formally accept the escalation within the configured acknowledgment window
- If the emergency escalation was triggered in error (false positive), the acknowledging authority logs the determination — the event record remains; the false positive classification is added to it
- All actions taken by any party in response to the emergency escalation must be logged with the escalation's correlation identifier

---

## Timeout Behavior

Emergency escalation uses acknowledgment windows, not SLA windows:

| Stage | Behavior |
|---|---|
| Acknowledgment window (initial) | Each notified party must acknowledge within the configured window (typically minutes, not hours) |
| Non-acknowledgment | If a party does not acknowledge within the window, the escalation is automatically escalated to the next tier in the on-call hierarchy — and simultaneously to an escalation monitor role |
| Total non-response | If all configured tiers fail to acknowledge, an operational failure alert is raised; this itself becomes an incident requiring investigation |

Emergency escalation must never stall. The absence of acknowledgment must trigger automatic escalation up the hierarchy, not a waiting state.

---

## User Communication Requirements

User communication during emergency escalation depends on the emergency type:

**Safety emergency:** Prioritize direct, caring communication with the user. Confirm that their situation has been flagged and that support is being connected. Do not leave the user in silence while escalation is in progress.

**Security incident:** Inform the user if their data or account is potentially affected. Do not share details that could assist an attacker. Provide specific protective actions (e.g., change credentials, log out of all sessions).

**Compliance or operational emergency:** If the user's workflow is directly affected, inform them that processing is paused pending resolution. Provide a reference number and expected communication timeline.

In all cases: communicate that action is being taken. Silence during an emergency is a failure mode.

---

## Audit Logging Requirements

Audit logging for emergency escalations is mandatory, immutable, and time-critical:

- Log the triggering event immediately upon detection — before routing, if possible
- The log entry must be immutable: it cannot be modified after creation, only appended to
- Log every notification sent, every acknowledgment received, every action taken, and every escalation-tier transition
- The complete audit record must be accessible to designated authorities within minutes of initiation, not hours
- Retain the full audit record for the period required by the applicable regulatory framework (or the deployment's retention policy if longer)

In regulated environments (healthcare, financial services, critical infrastructure), the emergency escalation audit record may be a required evidentiary artifact. It must meet the applicable evidentiary standards for immutability and chain of custody.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Over-triggering | Emergency escalation activated for non-emergency situations | On-call fatigue; reduced responsiveness to genuine emergencies; credibility erosion |
| On-call contact not current | Routing targets not updated to reflect current on-call state | Notifications sent to unavailable or off-duty parties; delayed response |
| Context not included in notification | Parties are notified but must request context before acting | Delay before containment; time-critical window missed |
| Acknowledgment window too long | Non-acknowledgment not escalated promptly | Emergency escalation stalls; no one takes ownership |
| Immutability not enforced | Audit log entries can be modified after creation | Evidentiary integrity failure; potential regulatory liability |
| Silent user | User is not informed their situation triggered an emergency response | User feels abandoned; trust is catastrophically damaged, especially in safety scenarios |

---

## Fallback Behavior if Escalation Fails

If the emergency escalation system itself fails — notification infrastructure is down, on-call system cannot be reached:

1. The failure is itself an operational emergency; a secondary alert channel (out-of-band, e.g., SMS, phone) must be triggered immediately
2. The system must display the emergency contact information directly to any user or operator who needs it — if infrastructure is down, people must be able to act manually
3. All state and context at the time of failure must be preserved in a durable log store that survives infrastructure failures
4. A post-incident review of the emergency escalation system's resilience is mandatory after any infrastructure failure during an active emergency escalation

The emergency escalation path itself must be resilience-tested as a regular operational discipline.

---

## Related Warning Patterns

- **Blocking warning** — in some deployments, a blocking warning is shown to the user while the emergency escalation is in progress, making clear that the current action cannot proceed
- **Policy warning** — may precede an emergency escalation triggered by a policy classification

---

## Related Explanation Patterns

- **Reasoning trace** — the AI's detection logic that triggered the emergency escalation should be recorded in a reasoning trace as part of the audit record
- **Decision summary** — a decision summary of what the AI assessed and why it classified the situation as an emergency supports post-incident review

---

## Related Permission Patterns

- **No permission gate can block an emergency escalation** — the self-authorizing nature of emergency escalation means permission gates do not apply to the escalation initiation itself
- **Revocation** — in security incidents, the emergency escalation may trigger immediate revocation of active permissions as a containment measure

---

## Related Uncertainty States

- Emergency escalation is not uncertainty-driven in the standard sense. It is triggered by detection of a defined emergency condition, which is a classification decision rather than a confidence decision.
- **Unresolvable state** — in a safety emergency, the AI's uncertainty about what to do is overridden by the emergency classification: escalate, do not deliberate.

---

## Related Refusal Patterns

- **Safe refusal** — in a safety emergency context, the AI may apply safe refusal to any requests made during an active emergency escalation that could complicate the response
- **Human handoff (refusal)** — if the user makes additional requests during the emergency, the AI may route them to the human agent now handling the escalation

---

## Related Recovery Flows

- **Repair recovery** — after a security or compliance emergency is contained, a repair recovery flow may be required to restore data integrity or reinstate affected services
- **Retry recovery** — after an operational emergency is resolved, affected workflows may be retried under the retry recovery flow

---

## Example Scenario

**Context:** An enterprise AI is conducting a document processing session for a financial services firm. During the session, the AI detects that the user has inadvertently included a file containing production customer PII in what was described as a test dataset. The firm's data classification policy defines this as a mandatory emergency escalation event under its data handling protocols.

**Emergency escalation initiated:**

*Immediate multi-party notification:*
- On-call Data Protection Officer: "EMERGENCY — PII exposure in AI session [session ID]. Customer PII detected in test dataset processing. Action required immediately. Context: [full context package]. Acknowledge within 5 minutes."
- On-call Compliance Officer: same notification
- Incident management system: event logged as P1 with full context

*User communication:*
```
⚠ Data classification issue detected

I've stopped processing because one of the files appears to contain production 
customer data, which cannot be processed in a test environment.

This has been flagged to your Data Protection team. Reference: DPE-20260704-0112

What to do now:
1. Do not share or process this file further
2. Your Data Protection Officer will contact you within the next few minutes
3. Keep this session open so they can review what was processed

I'm pausing all processing until this is resolved.
```

The session is paused. The user is informed immediately and specifically. The escalation team has the full context before they have to ask a single question.

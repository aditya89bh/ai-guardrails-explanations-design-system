# Manual Override Recovery

**Category:** Recovery flow
**Sub-type:** Manual override
**Severity:** Caution (Level 2) to Blocking (Level 3)
**Status:** stable
**Phase:** 2G

---

## Definition

Manual override recovery is the recovery flow that allows an authorized user to intentionally bypass a guardrail — a warning, a permission requirement, a confidence restriction, or a policy constraint — and proceed with an action that the AI's standard logic would not permit autonomously. The override is authorized, logged, scoped, and time-bounded. The AI proceeds under the override but does not treat the override as a general change to its policy configuration.

Manual override recovery is not a workaround. It is a legitimate, governed capability for situations where a guardrail was designed for the general case but a specific authorized user has determined — with informed understanding of the risk — that it should not apply in this specific instance. The key controls are: authorization, risk acknowledgment, scope limitation, and immutable audit.

Manual override recovery is distinct from all other recovery flows because the blocking condition is not resolved — it is deliberately bypassed. The AI does not proceed because the problem was fixed; it proceeds because a person with authority accepted responsibility for proceeding despite the problem.

---

## Problem Solved

Guardrails are designed for general cases. In production environments, legitimate edge cases arise where a guardrail's standard behavior prevents an action that a qualified user has the authority and judgment to authorize. Without a governed override mechanism, organizations face one of two bad outcomes: the guardrail creates unacceptable operational friction, or the AI is deployed with guardrails weakened globally to accommodate the edge case. Manual override recovery provides the third path: a controlled, logged, time-limited override for the specific case, without weakening the guardrail globally.

---

## When to Use

- A blocking warning or hard permission gate is preventing an action that an authorized user has determined is necessary and acceptable in this specific instance
- A confidence restriction is preventing an output that a domain expert has reviewed and assessed as reliable in this case
- A policy rule is blocking an action for a legitimate operational reason that a compliance officer or system administrator can authorize as an exception
- An emergency situation requires proceeding without completing a standard review or permission flow
- A user with the appropriate authority needs to override an AI's refusal for a specific business reason that is captured in the audit log

---

## When NOT to Use

- The guardrail triggered a safe refusal on safety or harm grounds — manual override is not permitted for safe refusals. The risk acknowledgment mechanism does not override safety rules.
- The override would be used routinely for the same action type — routine overrides indicate a policy design problem, not an edge case. If a user is overriding the same guardrail repeatedly, the policy should be reviewed, not the overrides expanded.
- The user requesting the override is not authorized for this override type — authorization must be verified before the override proceeds.
- The override scope would affect other users, tenants, or sessions — manual override is always scoped to the specific action in the specific session. It is not a global configuration change.

---

## Entry Conditions

Manual override recovery activates when:

- A guardrail has blocked an action and the blocking condition cannot be resolved through retry, repair, or redirect
- An authorized user explicitly requests an override and provides a documented justification
- The override type is permitted by the deployment's override policy for this action category
- Authorization verification has been completed

---

## Exit Conditions

Manual override recovery exits when:

- The overridden action completes — the override is consumed; the guardrail re-activates for the next action of the same type
- The override window expires (time-bounded override) — the guardrail re-activates automatically
- The override scope is exhausted (scoped override) — the guardrail re-activates for actions outside the defined scope
- The user or an administrator revokes the override explicitly

---

## Recovery Objective

Allow an authorized user to proceed with a specific blocked action, with their informed acknowledgment of the risk and a complete audit record — without weakening the guardrail for other users, sessions, or action types.

**Success criteria:** The overridden action completes. The override is logged with full attribution. The guardrail re-activates on scope exit. The audit record is immutable.

**Completion conditions:** The action completes, the scope exits, or the override is explicitly revoked. The guardrail is confirmed re-active.

---

## Recovery Owner

| Component | Owner |
|---|---|
| Requesting the override | User |
| Authorizing the override | Designated override authority (may be the same user if they have sufficient role) |
| Logging the override | AI system (immutable) |
| Executing the overridden action | AI (under the override) |
| Confirming guardrail re-activation | AI system (automatic on scope exit) |

---

## Authorization

Authorization for a manual override must be verified before the override is granted:

1. **Role eligibility:** The requesting user's role must be in the configured override-eligible role set for this guardrail type. Role eligibility is defined in deployment configuration, not granted in-session.

2. **Override type eligibility:** Different override types (confidence bypass, permission bypass, policy exception) have different role requirements. A user may be authorized to override confidence restrictions but not policy rules.

3. **Dual authorization (if required):** For high-impact overrides (safety-adjacent guardrails, compliance-relevant policy rules), the deployment may require a second authorized approver before the override is granted. This is a deployment configuration requirement, not a user-level request.

4. **Justification requirement:** All overrides must include a documented justification. Justifications must be human-written — a user cannot pass an AI-generated justification for an AI guardrail override.

---

## Override Scope

Override scope defines precisely what the override applies to:

- **Action scope:** The override applies to this specific action in this session. It does not apply to the same action type in future sessions or for other users.
- **Data scope:** The override applies to this specific data element, document, or dataset. It does not expand the user's general data access.
- **Time scope:** The override has a configured expiration. When the override window closes, the guardrail re-activates automatically. Time scope is mandatory — overrides without expiration are prohibited.
- **Session scope:** The override applies only within the current session. It does not persist across sessions unless explicitly configured as a persistent override (which itself requires elevated authorization).

---

## Risk Acknowledgment

Before the override is granted, the user must explicitly acknowledge the risk the guardrail was designed to mitigate. Risk acknowledgment is not a disclaimer checkbox — it is a structured confirmation that demonstrates the user understands the specific risk, not just that a guardrail exists.

**Required elements of risk acknowledgment:**

1. The specific risk the guardrail was protecting against in this case
2. The user's basis for determining the risk is acceptable in this instance
3. The user's awareness that they are assuming responsibility for this decision
4. Confirmation that the override is for this specific action only

A blocking warning with these elements must be presented before the override is executed. The user must actively confirm — passive dismissal does not constitute acknowledgment.

---

## Required Explanation Patterns

- **Reasoning trace** — the AI's reasoning for why the guardrail was originally triggered must be recorded and presented to the authorizing user before the override is granted. The user must understand what they are overriding and why.
- **Decision summary** — after the overridden action completes, a decision summary documenting the override, the justification, and the action taken must be generated and stored.
- **Limitation disclosure** — if the AI's confidence or completeness is reduced for the overridden action (because the guardrail was protecting against a real risk that remains present), this must be disclosed after the override executes.

---

## Required Permission Patterns

- **Blocking warning** — the risk acknowledgment is delivered through a blocking warning pattern. The user must clear this before the override proceeds.
- **Delegated permission** — if the override requires authorization from a party other than the requesting user (dual-auth requirement), the delegated permission pattern governs the authorization request.
- **Revocation** — the override itself is a time-bounded, scoped permission. Revocation applies if the override must be withdrawn before expiration.

---

## Related Uncertainty States

- **Low confidence state** → manual override recovery may allow an authorized domain expert to proceed on a low-confidence output after reviewing the AI's stated confidence driver and accepting the risk
- **Unresolvable state** → manual override recovery may unblock an unresolvable state if the specific limiting factor (a policy rule, a permission requirement) is one the authorized user can override

---

## Related Refusal Patterns

- **Policy refusal** → manual override recovery is the mechanism for an authorized administrator to grant an exception to a policy refusal for a specific instance
- **Safe refusal** → manual override recovery is **not permitted** as a path after a safe refusal. Safe refusals are not overridable by user-level override authority.
- **Partial completion** → if a partial completion excluded an element due to a permission or policy constraint, an override may allow the excluded element to be completed

---

## Related Escalation Paths

- **Role escalation** → when the requesting user is not the override authority, role escalation routes the override request to the appropriate authority
- **Emergency escalation** → in genuine emergencies, a compressed override authorization workflow may be required; emergency escalation governs the time-critical path

---

## User Communication

**At override request:**
```
You're requesting to override [guardrail name]: [what the guardrail was preventing].

This guardrail exists because: [specific risk].

By proceeding, you confirm:
• You have reviewed this situation and assessed the risk as acceptable
• This override applies only to [specific action] in this session
• This override will expire at [time/scope boundary]
• This decision will be logged with your identity and justification

Your justification (required): [text input]

[Proceed with override] [Cancel]
```

**At override execution:**
```
Override authorized. Proceeding with [action].
Override reference: [ID] | Expires: [time/scope] | Logged.
```

**At override expiration:**
```
Override [ID] has expired. Standard guardrails are now re-active.
```

---

## Audit Requirements

**Mandatory. Immutable.** Log:

- The guardrail that was overridden (by name and rule ID)
- The requesting user's identity and role
- The authorizing user's identity and role (if different)
- The justification provided
- The risk acknowledgment text shown and confirmed
- The override scope (action, data, time)
- The timestamp of authorization and expiration
- The action taken under the override
- The outcome of the action
- Whether the override was revoked before expiration (and by whom, and why)

Override audit records must be immutable and retained for the period required by the applicable regulatory framework. They are not subject to standard log rotation or deletion policies.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Override without authorization verification | Override is granted without checking role eligibility | Unauthorized user bypasses a guardrail; compliance failure |
| Risk acknowledgment as checkbox | User confirms override without reading the risk | The acknowledgment is meaningless; the override record does not demonstrate informed consent |
| No scope limit | Override is granted without expiration or scope boundary | Guardrail is effectively disabled for the session or beyond; the override becomes a persistent bypass |
| Audit not immutable | Override record can be modified or deleted after creation | Evidentiary integrity is compromised; the record cannot be trusted |
| Override of a safe refusal | The override mechanism is applied to a safety or harm refusal | A prohibited action is executed under a false governance cover |
| Routine override without escalation | The same user overrides the same guardrail repeatedly | Systematic guardrail weakness goes undetected; the policy is not reviewed because the overrides hide the pattern |

---

## Fallback Behavior

If authorization verification fails (the requesting user is not in the override-eligible role set):

- Route to role escalation — the appropriate authority can authorize the override
- The requesting user is not told the details of the override role configuration (to prevent privilege escalation attempts through enumeration)

If the override was granted but the action still fails:
- The override is logged as attempted and failed
- The failure cause is investigated separately — the override itself is not re-issued without a new authorization cycle

---

## Accessibility Considerations

- The blocking warning presenting the risk acknowledgment must be keyboard-navigable and screen-reader accessible — it must not be implementable as a purely visual interstitial that blocks non-sighted users
- The justification text input must have an explicit label ("Justification for override") — not a placeholder that disappears on focus
- The override expiration state change must be communicated via `aria-live` if it occurs while the user is in an active session
- The confirm/cancel buttons must be distinct, clearly labeled, and not reversible without explicit confirmation

---

## Enterprise Considerations

- **Override governance reporting:** Enterprise deployments must generate periodic reports of all overrides granted, by guardrail type, user, and frequency. These reports are a risk management artifact — patterns of frequent overrides in a specific category are a policy design signal.
- **Override policy review triggers:** If the same guardrail is overridden more than a configured frequency threshold within a time window, the policy engine should automatically flag the guardrail for policy review. High override frequency indicates the guardrail may be miscalibrated.
- **Regulatory disclosure:** In regulated environments, override events may need to be disclosed in regulatory filings or audit submissions. The audit record format must meet the applicable evidentiary standard.

---

## Example Scenario

**Context:** A clinical AI assistant is being used in a hospital system. A senior physician is reviewing a treatment protocol recommendation for a patient with an atypical presentation. The AI's clinical confidence restriction prevents it from providing a specific dosing recommendation below its reliability threshold for this rare presentation. The physician, who has direct clinical expertise with this patient, needs to proceed.

**Manual override recovery:**
```
Clinical confidence restriction active

The dosing recommendation for this atypical presentation falls below the 
reliability threshold configured for this deployment. I can provide the 
general dosing framework but not a patient-specific recommendation without 
confidence threshold override.

This restriction exists because: Atypical presentations in this category 
have higher inter-patient variability, and automated dosing recommendations 
without specialist review carry elevated error risk.

To override this restriction for this patient:

Your authorization level (Senior Physician) permits clinical confidence overrides.

You confirm:
• You have reviewed this patient's presentation and assessed the clinical risk
• You are overriding the AI confidence restriction for this specific recommendation only
• This override will not be applied to any other patient in this session
• This decision is logged under your credentials

Justification (required): [text input — minimum 20 characters]

[Override for this patient — proceed] [Do not override — request specialist consult]
```

The physician enters: "Atypical presentation consistent with [rare condition]. Clinical literature supports this dosing range. Patient reviewed in full."

The AI generates the specific dosing recommendation. The override record, including the physician's identity, justification, and the specific recommendation generated, is logged to the clinical audit trail. The restriction re-activates immediately after this patient's recommendation is delivered.

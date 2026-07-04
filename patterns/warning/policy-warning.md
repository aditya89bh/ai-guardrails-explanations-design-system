# Policy Warning

**Category:** Warning pattern
**Sub-type:** Policy warning
**Severity:** Advisory (Level 1) to Blocking (Level 3) — determined by policy rule configuration
**Status:** stable
**Phase:** 2A

---

## Problem It Solves

Enterprise AI deployments operate within a set of organizational policies — data classification rules, acceptable use policies, compliance mandates, and operational controls. When a user's request or action intersects with a defined policy boundary, the system must communicate the intersection clearly and specifically: which policy applies, what it requires, and what the user can do next. Generic warnings ("This is not permitted") fail to connect the user's action to the policy reason, making appeals and corrections harder. Policy warnings establish the specific policy ground — enabling appropriate responses from users, clear audit trails for compliance teams, and an accountable escalation path when the policy itself is contested.

---

## Definition

A policy warning is a warning pattern variant triggered by a match between a user's action or request and a defined organizational or regulatory policy rule. It communicates which policy applies, what specifically triggered it, and what the user's available paths are — including appeal or escalation if the user believes the policy match is incorrect.

---

## When to Use

- The system has matched the user's request or action against a specific, named policy rule
- The policy rule has a defined response behavior (warn, block, require acknowledgment, or route to escalation)
- The user needs to know which policy is implicated — not just that "something is not permitted"
- The policy has an appeal or exception process that the user should be informed of
- The warning needs to generate an audit record that references the specific policy rule and the user's response

---

## When Not to Use

- The concern is not policy-derived — it is a capability, confidence, or data quality issue — use inline, ambient, or modal warning instead
- The policy rule mandates a refusal with no path forward — use a refusal state instead; policy warnings imply some resolution path exists
- The policy rule requires external authorization to override — use a permission gate or escalation path
- The policy match is speculative (the system cannot confirm the match confidently) — do not falsely attribute a policy violation; surface uncertainty first

---

## Trigger Conditions

- **Policy match (soft):** The user's action matches a policy rule configured to warn but not block — the user is informed and can continue with awareness
- **Policy match (hard):** The user's action matches a policy rule configured to block — the user cannot proceed without resolution
- **Data sensitivity signal (policy-classified):** The content or data involved is classified under a policy that mandates specific handling — the classification drives the warning
- **Compliance checkpoint:** The action intersects a mandatory policy verification step defined by an organizational or regulatory requirement
- **Manual review flag (policy-triggered):** An administrator has configured a specific trigger that requires a policy warning message to be surfaced

---

## Severity Level

**Advisory (Level 1) to Blocking (Level 3), determined by policy configuration.**

| Policy rule configuration | Severity | Treatment |
|---|---|---|
| Warn only (soft match) | Advisory | Inline or ambient policy warning |
| Warn and require acknowledgment | Caution | Modal policy warning |
| Block until resolved | Blocking | Blocking policy warning with resolution path |
| Block with no resolution path | — | Escalate to refusal state — do not use a policy warning |

The severity of a policy warning is a configurable property of the policy rule, not of the pattern implementation. Policy rules must specify their required severity at configuration time.

---

## User Action Required

Depends on the policy rule's configured severity:

**Advisory:** No action required. User is informed and can continue.

**Caution:** User must acknowledge the policy warning before proceeding. A modal with an explicit confirm action is required.

**Blocking:** User must take a defined resolution action:
- Modify their request to remove the policy-matching content
- Select an alternative path that does not trigger the policy
- Initiate an exception request or escalation if an exception process exists

---

## Explanation Requirements

The policy warning must state:
1. **Which policy was triggered** — the name or identifier of the policy rule, at whatever level of specificity the deployment's disclosure policy allows. Avoid vague references ("Your request violates policy") — name the policy.
2. **What specifically triggered it** — the element of the request or action that matched the policy rule
3. **What the policy requires** — what the user must do, or what the system will do
4. **Whether an exception or appeal process exists** — and how to initiate it if so
5. **The audit consequence** — if the action is being logged because of the policy match, the user should be aware

The policy warning must not include:
- The full text of the policy rule (link to it instead if it is accessible)
- Legal language that obscures the practical meaning
- A false implication that the user has done something wrong when the policy match is contextual and not the user's error

---

## Copywriting Guidance

**Structure:** `[Policy name] applies to this [action/content/request] — [What it requires] — [Resolution path]`

**Good examples:**

Advisory (inline):
- "Data Classification Policy — This export includes Level 3 data fields. These fields require secure transfer. Your download will be encrypted automatically."
- "External Communication Policy — This message includes content flagged for external communication review. No action needed; the message will proceed after a 15-minute automated review window."

Caution (modal):
- Title: "Acceptable Use Policy applies to this request"
  Body: "Your request references competitive intelligence gathering, which is governed by the Acceptable Use Policy for AI tools. This policy requires you to confirm that the information will be used for internal strategic planning only, not for distribution. Click 'I confirm appropriate use' to proceed, or cancel and revise your request."

Blocking:
- Title: "Data Residency Policy prevents this transfer"
  Body: "The selected records include data subject to Data Residency Policy EU-DR-01, which prohibits transferring these records to servers outside the EU. The selected destination is a US-East region instance. To proceed, select an EU-region destination, or submit a data residency exception request."
  Buttons: "Change destination" | "Request exception" | "Cancel transfer"

**Tone:** Institutional but clear. The language should sound like a well-written policy notice — specific, factual, and respectful of the user's intelligence. Not punitive. Not accusatory. The user triggered a policy match — that is a system event, not a moral failing.

---

## Accessibility Requirements

All requirements from the applicable warning sub-type (inline, modal, or blocking) apply. Additional policy warning requirements:

- **Policy name must be present as text:** Do not communicate the policy through color coding or icon alone. The policy identifier must be readable.
- **Exception/appeal path must be accessible:** If the warning includes a link to an exception request process, that link must be keyboard accessible and must open in a way that does not trap the user or destroy the current context.
- **ARIA:** Follow the ARIA requirements for the underlying warning type (inline → `role="note"`, modal → `role="dialog"`, blocking → `role="alertdialog"`).
- **Screen reader:** Policy name and required action must be included in the screen reader announcement. Do not assume the user will read the full modal body before deciding to act.

---

## Enterprise Audit Considerations

**Audit logging:** Required for all policy warning events, regardless of severity. The audit record is the evidentiary basis for compliance reporting. Log:
- Policy rule identifier (the specific rule that matched)
- The content or action that triggered the match
- The severity level of the warning as configured
- The user's response (acknowledged / resolved / escalated / cancelled)
- Whether an exception was requested and the outcome
- Timestamp, session, user, and tenant identifiers

**Policy configurability:**
- Every aspect of the policy warning is driven by policy rule configuration — trigger conditions, severity, resolution paths, exception availability, and audit behavior
- Tenants must be able to define, modify, and disable policy rules through a policy management interface without requiring code changes
- Policy rules must support versioning — when a policy rule changes, the version at the time of a policy match must be recorded in the audit log

**Multi-tenant:** Policy rules are strictly tenant-scoped. Policy warnings from Tenant A must not reference or be affected by policy rules from Tenant B. Shared platform-level policies (e.g., platform-wide prohibited content) may supplement but must not replace tenant-level policy rules.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Vague policy reference | Warning says "Policy violation" without naming which policy | Users cannot understand, contest, or comply with the warning; compliance teams have no audit basis |
| False positive policy match | Policy match fires on content that does not actually violate the policy | User trust is damaged; if it happens frequently, all policy warnings are treated as noise |
| No appeal path disclosed | Policy blocking warning gives no indication that exceptions exist | Users either abandon legitimate work or find informal workarounds; exception process is bypassed |
| Policy warning without audit log | Policy match is surfaced to user but not recorded | Compliance reporting is incomplete; the evidentiary record has gaps |
| Policy rule version not recorded | Audit log does not capture which version of the policy was in effect | Compliance and legal reviews cannot accurately reconstruct what rule applied at the time of the event |
| Stacked policy warnings | Multiple policy rules match simultaneously and all surface separately | User is overwhelmed; cannot address all simultaneously; UI becomes unusable |

**Note on stacked policy warnings:** When multiple policy rules match simultaneously, surface the highest-severity match first and note the number of additional matches. Allow the user to address them sequentially. Do not render all matches simultaneously.

---

## Recovery Path

**Advisory severity:** No recovery needed — the user is informed and continues.

**Caution severity:** User acknowledges and continues. If the subsequent action produces an issue, apply the relevant downstream recovery flow.

**Blocking severity:** User takes the specified resolution action (modifies the request, changes the destination, or initiates an exception) and the workflow resumes. If the user initiates an exception request, route to the exception/escalation path and suspend the current workflow until the exception is resolved. See [`patterns/escalation/`](../escalation/) for escalation path specifications.

---

## Related Patterns

- **[Blocking warning](blocking-warning.md)** — Policy warnings at Blocking severity follow blocking warning behavior and requirements
- **[Modal warning](modal-warning.md)** — Policy warnings at Caution severity follow modal warning behavior and requirements
- **[Inline warning](inline-warning.md)** — Policy warnings at Advisory severity follow inline warning behavior and requirements
- **[Progressive warning](progressive-warning.md)** — Use when a policy match should escalate in prominence as the user approaches the point of action
- **[Policy refusal](../refusal/policy-refusal.md)** — Use instead when the policy match has no resolution path and the action cannot proceed
- **[Role escalation](../escalation/role-escalation.md)** — Pair with when the resolution requires authorization from a higher role
- **[Audit-required permission gate](../permission/audit-required-gate.md)** — Use alongside when the policy match requires formal authorization in addition to the policy disclosure

---

## Example Scenario

**Context:** An enterprise AI assistant is helping a procurement manager prepare a vendor contract for signature. The manager selects a vendor entity that the AI cross-references against the company's Conflict of Interest Policy. The policy engine identifies that the vendor's principal has a registered relationship with a board member — triggering the Conflict of Interest Policy rule at Caution severity (requires acknowledgment before the contract can proceed to signature).

**Policy warning rendered (modal):**

> **Conflict of Interest Policy applies to this vendor**
>
> The selected vendor (Meridian Consulting LLC) has a registered relationship with a current board member under Conflict of Interest Policy COI-002. This policy requires a signed COI disclosure and Legal review before any contract with this vendor can proceed to signature.
>
> This event is being recorded in the compliance audit log.
>
> To proceed:
> 1. Submit a COI disclosure form via the compliance portal.
> 2. Wait for Legal review confirmation (typically 3–5 business days).
> 3. Return to this workflow after Legal approval is received.
>
> If you believe this policy match is incorrect, you may submit a policy exception request.
>
> [Open compliance portal] [Request policy exception] [Cancel contract submission]

**What the manager can do:** Initiate the compliance process, contest the match, or cancel. They cannot proceed to signature without resolution.

**What would go wrong without this pattern:** The contract is submitted for signature. The conflict of interest is discovered during an audit six months later. The contract is voided, the vendor relationship is disrupted, and the organization faces regulatory scrutiny for the compliance gap.

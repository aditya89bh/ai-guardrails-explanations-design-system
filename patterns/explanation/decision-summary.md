# Decision Summary

**Category:** Explanation pattern
**Sub-type:** Decision summary
**Severity:** Informational (Level 0)
**Status:** stable
**Phase:** 2B

---

## Problem It Solves

AI systems that operate in decision-support or agentic contexts produce outputs that can be acted on immediately — but the record of how a decision was reached, what inputs were considered, and what alternatives were weighed often evaporates with the session. When a decision is later questioned, reviewed, or audited, there is no structured artifact to examine. Decision summaries solve the documentation gap: they generate a structured, persistent record of what the AI recommended, why, what alternatives existed, and what the user decided to do — at the moment of decision, not reconstructed afterward.

---

## Definition

A decision summary is a structured explanation that captures the inputs, reasoning, alternatives considered, recommendation, and user action taken for a significant AI-assisted decision. Unlike a reasoning trace (which documents the AI's logic) or source citation (which documents data provenance), the decision summary documents the decision event itself — creating a record that persists beyond the session for review, audit, and accountability.

---

## When to Use

- The AI is assisting with a decision that has downstream consequence and should be documented (e.g., hiring recommendation, vendor selection, medical referral, financial action)
- The user is making a decision on behalf of others and needs to be able to explain and defend it later
- The deployment context requires decision audit trails — regulated industries, high-stakes enterprise workflows
- The AI's recommendation may be accepted, modified, or rejected, and the record of which path was taken matters
- Multiple alternatives were presented and which one was chosen (and why) needs to be captured

---

## When Not to Use

- The AI's output is informational and does not drive a consequential decision
- The interaction is exploratory — the user is researching, not deciding; premature decision summary generation creates friction
- The output type does not involve alternatives (a translation, a code snippet, a factual lookup) — a decision summary implies there was a decision point with choices
- The session already has a comprehensive workflow record in an external system — do not duplicate when integration is cleaner

---

## Trigger Conditions

- **Decision checkpoint:** The user confirms or submits an action that constitutes a decision (e.g., clicking "Approve", "Reject", "Apply recommendation", "Proceed")
- **Agentic task completion:** An autonomous agent completes a multi-step task and needs to produce a structured record of what was done and why
- **Significant branching:** The AI presented two or more meaningfully different options and the user selected one
- **User override:** The user chose not to follow the AI's recommendation — the decision summary must capture both the recommendation and the override
- **Compliance checkpoint:** The deployment requires a decision summary for every output in a specific category (e.g., all adverse credit decisions, all clinical triage decisions)

---

## Explanation Depth

Decision summaries are always output as structured artifacts, not prose. The depth determines which fields are included:

| Depth | Fields | Use when |
|---|---|---|
| **Standard** | Inputs, recommendation, decision taken, timestamp | Most enterprise decision-support contexts |
| **Extended** | Standard + alternatives considered, confidence level, sources used | High-stakes decisions; multi-option workflows |
| **Compliance** | Extended + policy basis, user identity, required sign-off fields, immutability hash | Regulated contexts; decisions that may be reviewed by auditors or regulators |

---

## User Action Supported

- **Review before confirming:** User reviews the summary at the decision point before committing the action
- **Modify before confirming:** User edits the summary to reflect a modified or partially accepted recommendation
- **Document override:** User records why they chose a different path than the AI recommended
- **Export for audit:** User or compliance team exports the decision summary to an external system
- **Reference for defense:** User uses the summary when explaining or defending a past decision

---

## Copywriting Guidance

Decision summaries are structured documents, not prose. Use labeled fields, not paragraph narrative.

**Standard depth template:**

```
DECISION SUMMARY
Generated: [timestamp]

Input
  Query or task: [what the user asked for]
  Key inputs considered: [data, documents, or context used]

AI Recommendation
  Recommended action: [what the AI recommended]
  Basis: [one-line explanation of why]

Decision Taken
  Action: [what the user did — accepted / modified / rejected]
  Modified to: [if applicable — what the user changed]
  Reason for modification: [if applicable — user-provided note]

Next steps: [if applicable — what follows from this decision]
```

**Tone:** Neutral, factual, and structured. Decision summaries are records, not reports. They must not include interpretive language from the AI about the quality of the user's decision.

**What to avoid:**
- "The AI recommends this option and believes it is the best choice" — prescriptive language does not belong in a record
- Omitting the user override when the user chose differently — a partial record is worse than no record
- Generating a summary that "pre-fills" the decision as accepted before the user has confirmed — the summary must reflect what actually happened

---

## Accessibility Requirements

- **Structured markup:** Decision summaries must be rendered with appropriate heading hierarchy (`<h3>` for sections, `<dt>/<dd>` for field/value pairs) so screen readers can navigate the structure
- **Exportable format:** If the summary is exportable, the exported format must also be accessible (e.g., a structured PDF with tagged content, or a CSV with labeled columns)
- **Read-only vs. editable fields:** Editable fields in the summary (e.g., "Reason for modification") must be clearly labeled and keyboard accessible
- **Timestamp:** Timestamp must be in a human-readable format, not Unix epoch or an ambiguous numeric format

---

## Enterprise Audit Considerations

**Audit logging:** Required for all compliance-depth summaries. Required for standard-depth summaries in regulated contexts. Log:
- The full decision summary content at time of generation
- Whether the user modified or rejected the AI recommendation and any reason provided
- The user and session identifiers
- The output version of any AI model that contributed to the recommendation

**Immutability:** Compliance-depth summaries must be immutable after user confirmation. If a correction is needed, a new summary supersedes the original — the original is preserved in the audit record with a notation that it was superseded.

**Signature and attestation:** In high-compliance contexts, the decision summary must support a sign-off step: the user (or a second approver) attests to having reviewed the summary before the decision is finalized. This attestation must be logged with a timestamp and user identifier.

**Retention:** Decision summaries are long-lived records. Retention periods are defined by the deployment's data retention policy, which must meet or exceed the requirements of applicable regulations for the decision type.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Summary generated after the fact | Summary is created after the user has already acted, reconstructing the decision from memory or logs | The record does not accurately represent the actual decision process; audit integrity is compromised |
| Override not captured | User rejects or modifies the AI recommendation but the summary records only the final action without noting it diverged from the recommendation | Decision accountability is lost; the audit record makes it appear the AI and user agreed when they did not |
| Summary too long | Compliance-depth summary runs to many pages for a routine decision | Users stop reading before confirming; attestation becomes a checkbox exercise |
| Premature summary | Summary generated for exploratory queries, not confirmed decisions | Noise; users stop reading summaries because most of them are irrelevant |
| No user identity | Summary does not record which user made the decision | Audit trail is incomplete; accountability cannot be established |

---

## Related Patterns

- **[Reasoning trace](reasoning-trace.md)** — The reasoning trace feeds the "Basis" section of the decision summary; pair for high-stakes decisions
- **[Source citation](source-citation.md)** — Sources referenced in the decision summary should be directly linked where available
- **[Confidence disclosure](confidence-disclosure.md)** — Include in extended and compliance depth summaries
- **[Audit-required permission gate](../permission/audit-required-gate.md)** — Decision summaries and audit-required permission gates are often paired in high-compliance workflows
- **[Human handoff escalation](../escalation/human-handoff.md)** — When a decision summary reveals that human judgment is required, escalation follows the decision point

---

## Example Scenario

**Context:** An AI-assisted vendor procurement platform helps a procurement manager evaluate three competing software vendors and generates a recommendation. The manager is about to submit the recommendation to the finance committee for approval.

**Decision summary generated at submission:**

```
DECISION SUMMARY
Generated: 2026-07-04 09:42 UTC
Workflow: Vendor Selection — CRM Platform (Q3 2026)

Input
  Query: Evaluate three shortlisted CRM vendors against procurement criteria
  Criteria applied: Cost (weight: 30%), Integration compatibility (40%), Support SLA (30%)
  Vendors evaluated: Vendor A, Vendor B, Vendor C
  Documents reviewed: 3 RFP responses, 2 independent analyst reports, IT integration assessment

AI Recommendation
  Recommended vendor: Vendor B
  Basis: Highest combined score across weighted criteria (87/100). Strongest integration 
  compatibility with existing ERP stack. Support SLA meets enterprise requirements.

Decision Taken
  Action: Modified — recommended Vendor A instead
  Reason for modification: "Finance committee has an existing commercial relationship with 
  Vendor A that provides a 15% volume discount not reflected in the RFP. Adjusted on this basis."

Next steps: Submit to finance committee for approval. Vendor A contract negotiations to begin Q3.
```

**What the procurement manager can do:** The summary is submitted to the finance committee as the documented basis for the recommendation. When the procurement decision is reviewed six months later, the reason for the override is clearly on record — the AI recommended Vendor B, the manager chose Vendor A, and the commercial rationale is documented.

# Reasoning Trace

**Category:** Explanation pattern
**Sub-type:** Reasoning trace
**Severity:** Informational (Level 0)
**Status:** stable
**Phase:** 2B

---

## Problem It Solves

AI systems can produce outputs that are correct — or appear correct — while using logic the user would reject if they could see it. A legal AI might reach the right answer by misapplying the relevant statute. A financial AI might generate a correct-looking recommendation based on an assumption the user would never have made. Without visibility into the AI's reasoning, users cannot catch these errors, cannot evaluate the quality of the logic, and cannot learn to use the system more effectively. Reasoning trace gives the AI's reasoning process a surface — not the raw internal computation, but a structured explanation of the logical steps the AI took from input to output.

---

## Definition

A reasoning trace is a structured explanation of the logical steps the AI took to arrive at a specific output: what it considered, what it weighted, what it ruled out, and why. It operates at the level of reasoning steps, not model internals — it is a user-readable account of the AI's decision logic, not a dump of attention weights or token probabilities.

---

## When to Use

- The output is a recommendation, conclusion, or judgment — not a simple retrieval or summary
- The user or a downstream reviewer needs to evaluate whether the reasoning is sound, not just the conclusion
- The deployment context involves consequential decisions where the reasoning quality matters independently of the output correctness (e.g., clinical decision support, financial risk analysis, legal interpretation)
- Users are domain experts who can evaluate the AI's reasoning and correct it if it is flawed
- Regulatory or organizational policy requires the AI's decision logic to be explainable and documented

---

## When Not to Use

- The output is a simple retrieval or search result — there is no non-trivial reasoning to trace; use source citation instead
- The user population is not equipped to evaluate reasoning — a non-expert reading a complex reasoning trace may be more confused or over-trusting than without it
- The reasoning trace would expose proprietary logic that cannot be disclosed under the deployment's IP or competitive policy
- The output is low-stakes and the reasoning is straightforward — a reasoning trace for "Good morning" would be absurd; reserve traces for consequential outputs

---

## Trigger Conditions

- **Output type classification:** Recommendations, risk assessments, interpretations, and decisions always trigger reasoning trace availability; the trace may be collapsed by default but must be accessible
- **User request:** User explicitly asks "Why did you conclude this?" or "How did you reach this answer?"
- **Low confidence output:** When confidence is low, showing the reasoning helps users evaluate whether the uncertainty is in the logic, the data, or both
- **Compliance checkpoint:** Certain output types in regulated contexts require reasoning trace as a mandatory element of the response (e.g., automated credit decision explanations)
- **Contradiction detected:** The AI's output contradicts a prior output or a user-provided assertion — reasoning trace is required to surface how the AI reconciled the contradiction

---

## Explanation Depth

Reasoning traces are always user-accessible but may be exposed at different depths:

| Depth | Content | Use when |
|---|---|---|
| **Summary** | 2–3 sentence high-level logic path — "I identified three options, eliminated two due to X, and recommended Y because Z" | Default depth for most enterprise contexts |
| **Step-by-step** | Numbered reasoning steps: each step names what was considered and why | Expert users who need to evaluate each stage of the logic |
| **Annotated** | Step-by-step with sources and confidence attached to each step | Regulated contexts; formal audits; situations where the reasoning must be reviewed and signed off |

The trace is typically collapsed by default (summary visible, full trace behind an expand control) to avoid overwhelming non-expert users.

---

## User Action Supported

- **Validation:** User evaluates whether each reasoning step is logically sound and factually accurate
- **Correction:** User identifies an error in the AI's reasoning and provides correcting input for a revised output
- **Audit:** Compliance reviewer examines the reasoning trace as part of a formal audit of an AI-assisted decision
- **Escalation decision:** User determines that the reasoning is sound but the decision is beyond the AI's authority and escalates to a human
- **Documentation:** User includes the reasoning trace in a record of the AI-assisted decision for future reference

---

## Copywriting Guidance

**Summary depth:**
Structure as a one-paragraph narrative of the logic path, not a list.
- "I reviewed the contract against three applicable regulatory requirements, found compliance with two, and identified a potential conflict with the third — specifically the indemnification clause, which may exceed the liability caps mandated by Clause 8.3 of the referenced regulatory framework. I recommend legal review of that clause before signing."

**Step-by-step depth:**
Label each step clearly and use plain language, not model terminology.
```
Step 1: Identified applicable regulatory framework
  The contract involves data processing in the EU and falls under the relevant data protection regulation.

Step 2: Checked data processing terms against regulatory requirements
  The data retention clause specifies 7 years. The applicable regulation permits a maximum of 5 years 
  for the data categories involved. Conflict identified.

Step 3: Evaluated other clauses
  No additional conflicts found in the remaining 14 clauses reviewed.

Step 4: Generated recommendation
  Legal review of the data retention clause is required before the contract can be executed.
```

**What to avoid:**
- "The model computed a softmax distribution over candidate outputs and selected the highest-probability token sequence" — this is model-internal and meaningless to users
- Single-sentence traces that merely restate the output ("I concluded X because X is correct")
- Steps that claim more certainty than the data supports — if a step involved inference under uncertainty, label it as such

---

## Accessibility Requirements

- **Expandable trace:** The full step-by-step trace must be behind an accessible expand control with `aria-expanded` state
- **Step numbering:** Steps must be rendered as ordered lists (`<ol>`) so screen readers announce step numbers
- **Reading order:** Summary trace appears immediately after the output. Expandable detailed trace appears after the summary.
- **Focus management:** When the expand control is activated, focus should move to the top of the expanded content
- **No image-only reasoning:** Do not render reasoning traces as diagrams or flowcharts without a text alternative

---

## Enterprise Audit Considerations

**Audit logging:** Required in regulated contexts. Log:
- Which reasoning trace depth was shown (summary / step-by-step / annotated)
- Whether the user expanded the full trace
- The full trace content at the time of the output (traces must be immutable after generation; they cannot be retroactively revised)
- Any user corrections applied following inspection of the trace

**Immutability requirement:** Once a reasoning trace is generated and displayed, it must not be silently modified. If the AI's reasoning for a prior output is revised (e.g., due to updated source data), the original trace must be preserved in the audit log and a new output generated with a new trace. This is critical for compliance contexts where the reasoning trace is the evidentiary record.

**Policy configurability:**
- Which output types trigger reasoning trace availability must be configurable
- Whether the trace is mandatory (always shown) or opt-in (shown on user request) must be configurable by deployment context
- The depth required for regulated output types must be configurable per compliance framework

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Post-hoc rationalization | The reasoning trace is generated after the output to explain it, rather than reflecting the actual logic used to produce it | The trace is misleading; it does not represent the actual reasoning; audit records are inaccurate |
| Opaque step | A reasoning step says "Evaluated options" without specifying what was evaluated or how | Users cannot verify or correct that step; the trace provides false transparency |
| Trace contradicts output | The reasoning steps lead logically to a different conclusion than the stated output | Users lose confidence in both the output and the trace; the error cannot be corrected without understanding which is wrong |
| Trace too long | Full annotated trace runs to thousands of words for a complex decision | Users do not read it; it exists for compliance theater rather than genuine explainability |
| Reasoning trace always collapsed | Default state is always collapsed with no prompt to expand | Users who would benefit from the trace do not know it exists |

---

## Related Patterns

- **[Confidence disclosure](confidence-disclosure.md)** — Attach confidence levels to individual reasoning steps in annotated traces
- **[Source citation](source-citation.md)** — Attach source references to specific steps in the reasoning trace where sources were used
- **[Decision summary](decision-summary.md)** — A decision summary distills the reasoning trace into a structured output record; use alongside for formal decision documentation
- **[Limitation disclosure](limitation-disclosure.md)** — Surface when the reasoning trace reveals that a step relied on incomplete or uncertain data
- **[Human handoff escalation](../escalation/human-handoff.md)** — Pair when the reasoning trace reveals an issue that requires human judgment rather than a revised AI response

---

## Example Scenario

**Context:** A financial AI platform analyzes a loan application and generates a credit risk assessment. The assessment must be explainable because regulatory requirements mandate that adverse decisions include an explanation of the factors considered.

**Collapsed summary trace (default view):**
> **Risk assessment: Elevated**
> I evaluated five financial indicators, found three within normal parameters, and identified two that indicate elevated risk: the debt-to-income ratio exceeds the threshold for this loan category, and the applicant has two open accounts with late payment history in the past 24 months. Both factors are weighted significantly in the applicable risk model.
> [View full assessment logic ↗]

**Expanded annotated trace:**
```
Step 1: Identified applicable risk model
  Applied: Small Business Credit Risk Model v2.3 (effective Jan 2025)
  Source: Credit Policy Manual §4.1

Step 2: Evaluated income verification
  Verified income: $92,000 annually (documentation confirmed)
  Threshold for this loan category: $75,000 minimum
  Result: ✓ Within parameters

Step 3: Evaluated debt-to-income ratio
  Calculated DTI: 51%
  Maximum permitted DTI for this product: 45%
  Result: ✗ Exceeds threshold by 6 percentage points — elevated risk flag
  Confidence: High (direct calculation from verified documents)

Step 4: Evaluated payment history
  Open accounts with late payments (90+ days) in past 24 months: 2
  Policy threshold: 0 permitted for this loan category
  Result: ✗ Exceeds threshold — elevated risk flag
  Confidence: High (direct from credit bureau data)

Step 5: Evaluated remaining indicators
  Credit utilization, account age, recent inquiries: all within parameters

Step 6: Generated risk level
  Two elevated-risk flags in high-weight categories → Elevated risk assessment
```

**What the loan officer can do:** Review each step, verify the underlying data, and — if they believe a flag is incorrect (e.g., the late payments are disputed) — initiate a manual review with the annotated trace as the basis for the dispute.

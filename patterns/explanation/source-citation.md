# Source Citation

**Category:** Explanation pattern
**Sub-type:** Source citation
**Severity:** Informational (Level 0)
**Status:** stable
**Phase:** 2B

---

## Problem It Solves

When AI systems generate outputs that draw on specific documents, databases, knowledge bases, or external sources, users cannot evaluate the reliability of that output without knowing where it came from. A response that says "The policy requires annual review" is meaningless without knowing which policy document the AI is referencing — the document may be outdated, may not apply to the user's jurisdiction, or may have been superseded. Source citation closes the traceability gap: users can verify claims, reviewers can audit the basis of AI decisions, and organizations can demonstrate that AI outputs are grounded in authoritative sources.

---

## Definition

A source citation discloses the specific documents, datasets, records, or knowledge sources the AI used to generate an output or support a specific claim within an output. It establishes a traceable link between the AI's assertion and the evidence it is based on, enabling verification and audit.

---

## When to Use

- The output is factual or advisory and the accuracy depends on the specific source (not general world knowledge)
- The user may need to verify, contest, or extend the AI's output by examining the underlying source
- The deployment context requires auditability of AI-generated content (compliance, legal, clinical, financial)
- The source is accessible to the user (either directly or through a request/access process)
- Multiple sources were used and attribution affects which parts of the output carry which reliability

---

## When Not to Use

- The output is derived entirely from parametric model knowledge with no discrete retrievable source — cite a limitation disclosure instead
- The source is classified or restricted and cannot be disclosed to the user making the request — note that sources exist but are access-controlled; do not fabricate a substitute
- The source list is so large (hundreds of documents for a broad synthesis) that citation adds noise rather than clarity — summarize provenance instead
- The output is a calculation or code result where sources are irrelevant — the inputs and logic are what matter, not external citations

---

## Trigger Conditions

- **Retrieval-augmented output:** The AI used a retrieval step to pull specific documents, records, or data before generating the response — all retrieved sources must be cited
- **Claim-level attribution needed:** The output contains specific factual claims, figures, or dates that are verifiable and traceable to a specific document or record
- **Compliance context:** The deployment policy mandates source citation for all AI outputs in this context (e.g., legal document analysis, clinical knowledge retrieval)
- **User request:** The user explicitly asks "Where did you get this?" or "What is the source?"

---

## Explanation Depth

| Depth | Content | Use when |
|---|---|---|
| **Summary** | Source name(s) and count only — "Based on 3 internal policy documents" | Outputs that synthesize many sources; surface-level trust signal |
| **List** | Named sources with titles, dates, and identifiers — document name, version, section | Standard enterprise deployment; user may need to locate the document |
| **Linked** | Named sources with direct links or navigation paths to the source document | Integrated knowledge management deployments where sources are accessible in-product |
| **Claim-level** | Per-claim attribution — each factual assertion linked to its specific source | High-stakes regulatory, legal, and clinical contexts; required for some compliance frameworks |

---

## User Action Supported

- **Verification:** User opens the cited source to confirm the AI's interpretation is accurate
- **Dispute:** User identifies that the cited source has been superseded, is inapplicable, or is misinterpreted
- **Audit:** Compliance or legal reviewer traces AI output back to original source material
- **Extension:** User reads beyond the cited passage to get fuller context
- **Access request:** User who cannot access the cited source submits a request through the appropriate channel

---

## Copywriting Guidance

**Summary depth:**
- "Based on 4 documents in your knowledge base."
- "Derived from SEC filings Q1–Q4 2024."

**List depth:**
- "Sources: Employee Handbook v3.2 (Jan 2025, §4.2), Remote Work Policy (Mar 2024), IT Security Policy v2 (Dec 2024)"
- Each source should include: name, version or date, section or page if applicable

**Linked depth:**
- Sources rendered as navigable links, opening the source in-context or in a side panel
- Link text must be the source name, not "click here" or "source"

**Claim-level depth:**
- Inline superscript or footnote style: "Annual review is required¹" → ¹HR Policy 4.2, §Annual Compliance Requirements, Jan 2025
- Do not use footnotes that require scrolling far from the claim; use expandable tooltips or side annotations

**What to avoid:**
- "According to my training data" — this is not a source citation; it is the absence of one
- Citing sources the AI did not actually retrieve — fabricating citations is a critical failure mode; see below
- Citing a source without enough identifying information for the user to locate it ("a policy document from 2023")

---

## Accessibility Requirements

- **Linked citations:** All source links must be keyboard accessible and have descriptive link text (not "source 1", "link")
- **Footnote references:** If inline superscripts are used for claim-level citations, they must be implemented with `aria-describedby` pointing to the footnote, so screen reader users get the citation without needing to navigate away
- **Expandable citation lists:** Must be keyboard accessible with `aria-expanded` state
- **Reading order:** Summary citations should appear after the output they reference. Claim-level citations should appear immediately adjacent to the claim.
- **Icon labels:** Any citation icon (e.g., a document icon, superscript number) must have an accessible name

---

## Enterprise Audit Considerations

**Audit logging:** Required in regulated contexts. Log:
- Which sources were cited for which output
- Whether the user accessed (clicked through to) any cited source
- The version or snapshot of each source at the time of the output generation (to support point-in-time audit reconstruction)

**Policy configurability:**
- Citation depth (summary / list / linked / claim-level) must be configurable per deployment context and output type
- Which source repositories are eligible for citation must be configurable — sources outside approved repositories should not be cited without disclosure
- Whether citations are mandatory (always shown) or conditional (shown below a relevance threshold) must be configurable

**Source version integrity:** In high-stakes deployments, the system must record which version of each source was used at output time. If a source is updated after the output is generated, the audit record must reflect the version in effect at the time — not the current version.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Citation hallucination | AI fabricates a plausible-sounding source that does not exist | Users act on unverifiable claims; legal and regulatory exposure; catastrophic trust failure |
| Outdated source citation | AI cites a document that has since been superseded | Users apply deprecated policy or guidance as if current |
| Inaccessible source | Source is cited but user cannot access it | User cannot verify; citation becomes a trust placebo rather than a transparency tool |
| Over-citation | Every sentence has a footnote; sources list is longer than the output | Cognitive overload; the signal drowns in noise |
| Source misattribution | Claim is attributed to Source A but was actually derived from Source B | User verifies against wrong source; error is undetected |

**Critical note on citation hallucination:** This is the highest-severity failure mode for this pattern. Any implementation of source citation must include a verification mechanism that confirms the cited source exists and was actually retrieved before rendering the citation. Never render a citation that the system cannot verify.

---

## Related Patterns

- **[Confidence disclosure](confidence-disclosure.md)** — Pair to explain how reliable the AI's interpretation of the cited sources is
- **[Reasoning trace](reasoning-trace.md)** — Pair when the user needs to understand not just what source was used, but how the AI used it
- **[Limitation disclosure](limitation-disclosure.md)** — Use when the source coverage has known gaps that affect the reliability of the output
- **[Decision summary](decision-summary.md)** — Source citation contributes to decision summaries for outputs that involve a decision recommendation
- **[Inline warning](../warning/inline-warning.md)** — Use alongside when the cited source has a known quality issue (staleness, partial coverage)

---

## Example Scenario

**Context:** An enterprise AI assistant is helping an HR business partner interpret an employee's leave entitlement. The AI retrieves three relevant documents from the company's HR policy knowledge base and generates a response.

**Response with list-depth citation:**

> Based on your question, this employee is entitled to 15 days of annual leave in their first year, prorated from their start date.
>
> **Sources used:**
> - Leave Entitlement Policy v4.1 (Feb 2025, §3.1 — First Year Entitlements)
> - Employee Handbook 2025 (§Employment Terms, Leave)
> - HR FAQ: Annual Leave (updated Jan 2025, Q: "How is leave prorated for mid-year starters?")

**What the HR business partner can do:** Open the Leave Entitlement Policy §3.1 directly to confirm the AI's 15-day figure and the proration method. If the employee questions the figure, the HR partner has a traceable, auditable basis for the answer.

**What would go wrong without this pattern:** The AI gives the 15-day figure with no source. The HR partner either relies on it without verification (and may be wrong if the policy was recently updated) or spends additional time manually searching the policy library — defeating the value of the AI assistant.

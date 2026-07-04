# Partial Completion

**Category:** Refusal state
**Sub-type:** Graceful degradation
**Severity:** Advisory (Level 1) to Caution (Level 2)
**Status:** stable
**Phase:** 2E

---

## Definition

Partial completion is a refusal pattern in which the AI fulfills the completable portions of a request and explicitly declines the portions it cannot fulfill — due to capability limits, confidence constraints, access restrictions, or policy boundaries. The user receives genuine value from what the AI can do, with a clear accounting of what was excluded and why.

Partial completion is not a compromised output dressed up as a complete one. The boundary between what was completed and what was refused must be visible and precise. The user must know exactly what they are getting and what they are not.

---

## Trigger Conditions

Partial completion is triggered when:

- A multi-part request contains some parts the AI can fulfill reliably and others it cannot (due to domain, confidence, or policy constraints)
- An output type requires some elements the AI has strong coverage for and others it does not — the reliable elements can be delivered while the uncertain elements are explicitly excluded
- A task is partially within the AI's deployment scope and partially outside it — the in-scope portion can be completed
- The user's underlying goal can be substantially advanced by completing a portion of the task, even though the full task cannot be completed
- Completing everything would require one component that triggers a confidence, policy, or safety constraint — removing that component allows the rest to proceed

---

## Why Refusal Occurred

Partial completion must explain what was excluded and why each exclusion occurred. The rationale must be:
- Specific to the excluded component — not a blanket limitation statement
- Honest about whether the exclusion is due to capability, policy, confidence, or access
- Free of ambiguity about which parts of the output were produced in full vs. excluded

---

## User Messaging

**Structure:** `[What was completed] + [What was excluded and why] + [What the user can do about the excluded parts]`

**Good examples:**
```
I've completed the contract analysis for Sections 1–6.

Section 7 (Arbitration and Dispute Resolution) was excluded — this section involves 
jurisdiction-specific legal interpretation that exceeds my reliable operating range for 
the applicable jurisdiction. This section should be reviewed by qualified legal counsel 
before signing.

Everything in Sections 1–6 is ready for your review below.
```

```
I've prepared the financial model through Q3 projections.

The Q4 projection was excluded — the required market assumptions for Q4 depend on 
regulatory decisions expected in September that have not been issued. I can complete 
Q4 projections once the regulatory landscape is clearer.

The Q1–Q3 model is complete and internally consistent.
```

**Tone:** Factual and forward-looking. The user should feel that what they have received is useful and that the gap is well-defined.

---

## What Can Still Be Completed

The completed portion must be clearly demarcated. In structured output (tables, reports, analyses), use explicit markers:
- Completed sections labeled as such
- Excluded sections labeled with the reason: `[EXCLUDED — [reason]]`
- Summary of coverage at the top: "Coverage: Sections 1–6 of 7 (Section 7 excluded — see note)"

If the user can supply information that would allow the excluded portion to be completed, say so specifically.

---

## Alternatives

For each excluded component:
- State whether the user can get it completed through another resource (human expert, specialized tool, different data source)
- State whether the AI could complete it if the user provided additional context
- State whether it is an absolute limit (policy, safety) or a conditional one (confidence, access)

Do not offer vague "feel free to ask" placeholders — offer specific completion paths.

---

## Recovery Path

- **User provides missing context** → AI completes the excluded portion, producing a revised full output
- **User engages a specialist for the excluded portion** → User combines the AI's partial output with the specialist's contribution
- **User reformulates the excluded portion as a separate request** → AI evaluates the new request independently

The partial completion output should be structured to make these recovery paths easy — for example, producing a document with a clearly marked gap that a specialist can fill in directly.

---

## Related Uncertainty States

- **Moderate Confidence State** → Partial completion often applies when some output elements are at high confidence and others are at moderate or low confidence — the high-confidence elements are completed and delivered, the low-confidence elements are excluded
- **Insufficient Information State** → If the missing information affects only part of the task, partial completion is the appropriate response for the completable parts
- **Stale Context State** → Time-sensitive output components may be excluded while stable components are delivered

---

## Related Permission Patterns

- If the excluded portion involves an access restriction, a **scoped permission** or **delegated permission** may allow it to be completed after the appropriate authorization is obtained
- For agentic tasks, the completed portion may be committed with a **one-time permission gate**; the excluded portion remains pending

---

## Enterprise Audit Considerations

**Audit logging:** Required in compliance-sensitive contexts where partial completion of a document or analysis has evidentiary implications. Log:
- Which portions were completed and which were excluded
- The reason for each exclusion
- The completed output (if subject to audit retention requirements)

**Completeness marking:** In regulated contexts, the output must carry a visible completeness marker — not just a note in the explanation, but a structural marker in the output artifact itself (e.g., a header, a watermark, or a field explicitly labeled `[INCOMPLETE — Section 7 excluded]`).

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Silent exclusion | The AI completes part of the task and omits the excluded portions without disclosure | User receives an apparently complete output with invisible gaps; decisions are made on incomplete information |
| Vague exclusion | "Some parts could not be completed" without specifying which parts | User cannot identify the gaps or act on them |
| Incorrect scope claim | AI claims to have completed everything when it excluded material portions | Active deception; trust failure |
| Completing the uncompleted | AI marks something as excluded but includes a low-quality version of it anyway | The output is internally inconsistent; the exclusion boundary is meaningless |

---

## Example Scenario

**Context:** An enterprise AI is asked to prepare a competitive landscape analysis covering five direct competitors. The AI has strong coverage for three of them (large, well-documented companies) but very limited data for the other two (smaller, private companies with minimal public information).

**Partial completion response:**

```
COMPETITIVE LANDSCAPE ANALYSIS — Partial

Coverage: 3 of 5 competitors (Competitors D and E excluded — see note below)

[Full analysis for Competitors A, B, C — delivered in full]

---
EXCLUDED: Competitor D, Competitor E

These two companies have minimal public documentation. The available information is 
insufficient to produce a reliable competitive profile without significant risk of 
generating inaccurate characterizations.

To complete the analysis for these two:
• Competitor D: A LinkedIn Sales Navigator search and their company filing in [jurisdiction] 
  would provide the needed revenue and headcount data
• Competitor E: Consider direct outreach or a market intelligence service with coverage 
  of private companies in this sector
```

The user has a fully usable analysis for three of five competitors and a specific, actionable path to complete the remaining two.

# Conflicting Evidence State

**Category:** Uncertainty state
**Sub-type:** Conflicting sources
**Severity:** Caution (Level 2)
**Status:** stable
**Phase:** 2D

---

## Definition

The conflicting evidence state is an active operating state triggered when the AI retrieves or identifies two or more sources that make materially contradictory claims about the same fact, figure, or assertion relevant to the user's query. The conflict is not a confidence issue in the statistical sense — each individual source may be high quality — but the sources disagree, and the AI cannot determine which is authoritative without additional context that it does not have.

This state is qualitatively different from the low confidence state. In the low confidence state, the AI has poor coverage of a domain. In the conflicting evidence state, the AI may have excellent coverage — but that coverage tells contradictory stories. The resolution strategy is different: the AI must surface both versions of the claim, explain the conflict, and let the user or an authoritative source resolve it.

---

## Entry Conditions

The AI enters the conflicting evidence state when any of the following are true:

- Two or more retrieved sources make materially contradictory claims about the same fact, figure, date, policy, or recommendation
- A retrieved source contradicts a claim the user has provided as context
- An internally generated output (e.g., from a prior reasoning step) conflicts with a retrieved source when compared
- The AI's training knowledge and a retrieved document contradict each other on a factual matter, and neither can be dismissed without additional context
- Multiple documents in the knowledge base reflect different versions of the same policy, regulation, or procedure with overlapping effective dates

---

## Exit Conditions

- **→ High Confidence State:** The user provides additional context (e.g., a definitive date, a document version, an authoritative source) that allows the AI to determine which source is correct and eliminate the conflict
- **→ Moderate Confidence State:** Additional context partially resolves the conflict — one source is clearly more applicable than the other, but some residual uncertainty remains
- **→ Insufficient Information State:** The conflict cannot be resolved because neither source can be evaluated for authority — the AI shifts to treating the underlying information as unavailable
- **→ Unresolvable State:** The conflict is material, the stakes are high, and resolution is required before any output can be produced — the AI cannot generate a useful output while the conflict stands

---

## Confidence Characteristics

- **Score range:** Not scored on the standard confidence scale — conflicting evidence represents a qualitatively different type of uncertainty. The state overrides the score-based confidence model.
- **Source quality:** Individual sources may be high quality; the problem is the conflict between them, not the quality of any one source
- **Resolution dependency:** Confidence is blocked by the conflict, not by data scarcity

---

## Allowed Actions

In the conflicting evidence state, the AI may:

- Present both conflicting claims to the user with clear attribution to each source
- Explain the nature of the conflict — what specifically the sources disagree about
- Ask the user which source applies in their context (if a clarification-request refusal pattern is applicable)
- Generate an output that explicitly holds both possibilities open ("According to Source A, X. Source B states Y. The applicable value depends on [factor the user can determine].")
- Recommend that the user consult an authoritative source to resolve the conflict before acting

---

## Forbidden Actions

In the conflicting evidence state, the AI must not:

- Select one conflicting source over another without a defensible, explicit rationale visible to the user
- Average or blend conflicting numerical values and present the result as if the conflict does not exist
- Silently suppress one source and present only the other — this is a citation hallucination failure mode
- Proceed with an agentic action that depends on a conflicted fact without first resolving the conflict
- Default to the more recent source as definitive without checking whether recency is actually the determining factor (policy rollback, corrected errors, jurisdiction-specific versioning can all complicate recency-as-authority assumptions)

---

## User Interaction Strategy

The user must understand that:
1. The AI found real, specific information, but the sources disagree on a material point
2. The AI cannot resolve the conflict without information only the user or an authoritative source can provide
3. Both versions are surfaced with attribution — not just the one that seems more likely

Interaction steps:
1. State that a conflict has been detected — specifically, what fact or claim is in conflict
2. Present both versions with clear source attribution
3. Explain what additional information would allow the conflict to be resolved
4. Either ask the user for that information or direct them to an authoritative resolution source
5. Hold all dependent actions or outputs until the conflict is resolved

---

## Required Explanation Pattern

- **Source citation** at claim-level depth — required. Each conflicting claim must be attributed to its specific source. General source lists are insufficient.
- **Reasoning trace** at summary depth — required. The AI must explain why it cannot determine which source is authoritative.
- **Structured uncertainty disclosure** — required if the conflict is material and a high-stakes decision depends on resolution.

---

## Required Permission Pattern

- No permission gate is triggered by the conflicting evidence state alone
- If the user asks the AI to proceed based on one of the conflicting sources (acknowledging the conflict), a **one-time permission gate** is required: the user must explicitly confirm which source they are authorizing the AI to rely on, and this choice must be logged

---

## Escalation Trigger

The conflicting evidence state triggers escalation when:

- The conflict is between an internal policy document and an external regulatory requirement — a compliance decision is required that the AI cannot make
- The user cannot resolve the conflict with available context, and a specialist is needed
- The conflict involves safety-relevant information (clinical guidelines, safety procedures, regulatory limits) where unresolved conflict creates operational risk

---

## Recovery Trigger

- **User resolution:** User provides or identifies the authoritative source → AI re-evaluates → exits to high or moderate confidence
- **Clarification request:** AI asks the user a targeted question that resolves the conflict (which version, which date, which jurisdiction) → exits on answer
- **Redirect recovery:** If the conflict cannot be resolved in the current session, the user is directed to a specialist or authoritative source

---

## Audit Requirements

**Audit logging:** Required when conflicting evidence involves policy documents, regulatory requirements, or clinical guidelines. Log:
- Both sources in conflict (identifiers and the specific claims that conflict)
- Whether the user resolved the conflict and which source they designated as authoritative
- Any action taken based on the selected source post-resolution

---

## Valid Next States

| Next state | Transition condition |
|---|---|
| High Confidence State | User definitively identifies the authoritative source; conflict resolved |
| Moderate Confidence State | Conflict partially resolved; one source is clearly more applicable but residual uncertainty remains |
| Insufficient Information State | Neither source can be evaluated for authority; underlying information treated as unavailable |
| Unresolvable State | Conflict is material and unresolvable in the current session; no output can be produced |

---

## Invalid Transitions

| Invalid transition | Reason |
|---|---|
| Conflicting Evidence → Low Confidence (without re-evaluation) | Different root cause; conflicting evidence is not the same as low data coverage |
| Conflicting Evidence → Silent source selection | Not a state transition — a forbidden action that constitutes a citation hallucination |

---

## Example Scenario

**Context:** An HR AI assistant is asked about the notice period required for voluntary resignation at a company that recently completed a merger. The AI retrieves two policy documents: the pre-merger policy (4 weeks notice) and the post-merger integrated policy (2 weeks notice). Both documents have effective dates, but both are in the knowledge base and there is no policy supersession marker.

**State:** Conflicting Evidence

**Output behavior:**
```
⚠ Conflicting policy documents — please confirm which version applies

I found two versions of the resignation notice policy with overlapping effective dates:

• Employee Handbook v4.2 (effective Jan 2024): 4 weeks notice required for voluntary resignation
• Integrated People Policy v1.0 (effective Mar 2024): 2 weeks notice required for voluntary resignation

I cannot determine which policy supersedes the other based on available documents. Both are 
marked as current in the knowledge base.

To resolve: Please check with your HR Business Partner or People Operations to confirm which 
policy is in effect for your business unit. I'll apply the confirmed policy once you let me know.

[Use the 4-week policy] [Use the 2-week policy] [I'll check with HR first]
```

If the user selects one, the AI logs the choice and proceeds under a one-time permission gate that records which policy version the user authorized.

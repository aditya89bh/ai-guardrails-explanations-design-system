# Healthcare AI — Drug Interaction Check

**Industry:** Healthcare
**Primary patterns:** low-confidence-state, constrained-completion, limitation-disclosure, confidence-disclosure, role-escalation
**Decision engine coverage:** Selection engine § Warning + Explanation + Refusal; Precedence § constrained > safe for decision-support intent; State machine § LC uncertainty
**Phase:** 5
**Status:** stable

---

## 1. Problem

A hospital has deployed an AI clinical decision support system accessible to licensed clinical staff (physicians, nurses, pharmacists, and clinical pharmacists). The system is integrated into the electronic health record (EHR) and can answer pharmacological queries, check drug interactions, surface dosing guidelines, and generate draft medication notes.

The deployment operates under the principle that AI outputs are decision-support inputs to licensed professionals — the AI does not issue clinical orders. The system has access to a pharmaceutical knowledge base (indexed monthly) and retrieval-augmented generation over peer-reviewed pharmacology references.

The risk scenario: a licensed clinical pharmacist queries the system about a drug interaction between two medications, one of which is a recently approved agent with sparse post-market safety data. The AI must handle genuine uncertainty about an interaction that has very limited published evidence while not blocking the pharmacist from proceeding.

---

## 2. User Request

```
User: Rifampicin + lorlatinib interaction — any significant concerns for a patient 
on a stable rifampicin regimen who is starting lorlatinib for ALK+ NSCLC?
```

Context: The user is a licensed clinical pharmacist (role = Power user, Tier 2). Lorlatinib received approval after the AI's knowledge base was last indexed. The interaction has limited published pharmacokinetic data at the time of query.

---

## 3. Decision Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 3 (High) | Drug interaction in oncology patient; harm is significant and potentially irreversible (subtherapeutic anti-cancer dosing; adverse events) |
| P2 — Confidence | Low (LC) | Lorlatinib is recently approved; interaction data is sparse in indexed sources; AI cannot produce a high-confidence claim |
| P3 — Capability | Capable (retrieval + synthesis); incapable (definitive clinical order) | AI can retrieve and synthesize available pharmacological data; cannot issue a clinical recommendation with prescriptive authority |
| P4 — Permission | Authorized | Clinical pharmacist role is authorized for drug interaction queries |
| P5 — Policy | No match | Drug information queries are policy-permitted for clinical staff |
| P6 — User Intent | `decision-support` | Pharmacist is using AI output to inform clinical judgment — not requesting a clinical order |
| P7 — Business Impact | High | Subtherapeutic oncology dosing or adverse interaction = patient harm; potential liability |
| P8 — User Authority | Tier 2 (licensed clinical pharmacist) | Can act on drug information; cannot waive clinical oversight |
| P9 — Context Freshness | Stale (partial) | Lorlatinib's post-marketing safety data is newer than the last knowledge base index; rifampicin data is current |
| P10 — Source Reliability | Medium (2) | Rifampicin CYP3A4 induction data is well-established in primary sources; lorlatinib-specific interaction data is from a single phase 1 study and manufacturer prescribing information |

---

## 4. Decision Engine Execution

**P5 — Policy:** Evaluated first. No match. Drug information queries are permitted for this role. Policy path does not activate.

**P3 — Capability:** Capable for retrieval and synthesis. Incapable for issuing a definitive clinical recommendation. This distinguishes `constrained-completion` (AI provides what it can) from `safe-refusal` (AI provides nothing).

**P2 — Confidence:** Low confidence state activates. Confidence is below the low floor for this output type because:
- The most relevant post-marketing interaction data post-dates the knowledge index.
- The only available lorlatinib-rifampicin-specific data is from a single study with a small N.

**P9 — Context Freshness:** Stale for lorlatinib-specific data. This triggers an additional stale-context signal that compounds the LC state.

**P1 — Risk × P7 — Business Impact:** Risk = 3 AND Business impact = High → requires blocking-level explanation and explicit limitation disclosure, even with constrained completion.

**Pattern selection:**
- `constrained-completion` wins over `safe-refusal` because Intent = `decision-support` (the AI is not executing an action; it is informing a human who will act).
- `low-confidence-state` → `confidence-disclosure` (detailed depth) — applies per selection engine.
- `stale-context-state` compounds → `limitation-disclosure` (detailed depth).
- `source-citation` required — retrieved data must be attributed claim-by-claim.
- `role-escalation` offered — clinical pharmacist should route to a clinical pharmacology specialist or the manufacturer's medical information service for definitive guidance. This is offered, not mandatory.

**Rules skipped:**
- `safe-refusal`: skipped — intent = decision-support, not action-execution. AI is not placing an order.
- `blocking-warning`: skipped — no permission gate needed; pharmacist is authorized.
- `escalation (emergency)`: skipped — this is not an emergent patient safety event; it is a pre-prescribing information request.
- `one-time-permission`: skipped — the pharmacist is already authorized for this query type.

---

## 5. Pattern Sequence

```
stale-context-state (lorlatinib data)
  + low-confidence-state (interaction-specific evidence)
  ↓
constrained-completion (deliver available pharmacokinetic data; exclude definitive recommendation)
  ↓
confidence-disclosure (detailed depth — explains what the AI knows and what it cannot assess)
  ↓
limitation-disclosure (names the specific gap: post-approval lorlatinib data post-dates knowledge index)
  ↓
source-citation (claim-level — each pharmacokinetic statement attributed)
  ↓
role-escalation (offered — manufacturer medical information or clinical pharmacology specialist)
```

---

## 6. Component Sequence

| Order | Component | Reason |
|---|---|---|
| 1 | `StaleContextBadge` | Lorlatinib data freshness: stale. Attached to lorlatinib-specific claims. |
| 2 | `ConstrainedCompletionCard` | Delivers rifampicin CYP3A4 induction data and lorlatinib metabolic pathway data — the completable portion. Excludes a final interaction severity rating. |
| 3 | `ConfidenceBadge` (low, detailed depth) | Embedded in the constrained output header: "Low confidence for this specific combination." |
| 4 | `LimitationDisclosure` (detailed depth) | Below the output: names the gap — lorlatinib's Phase 1 cross-over data is the only available PK source; post-marketing surveillance data is not yet indexed. |
| 5 | `SourceList` (claim-level) | All claims attributed: CYP3A4 induction data (primary pharmacology references); lorlatinib metabolic data (manufacturer prescribing information and single Phase 1 PK study). |
| 6 | `RoleEscalationCard` (offered, not forced) | Presents two escalation paths: manufacturer medical information line (with contact reference) and internal clinical pharmacology consultation. |

---

## 7. User Journey

**Step 1:** Pharmacist submits drug interaction query from within the EHR medication review screen.

**Step 2:** The AI evaluates primitives. LC + stale signal confirmed. System begins constrained output generation.

**Step 3:** The `ConstrainedCompletionCard` renders with the rifampicin CYP3A4 induction data and lorlatinib's known CYP3A4 substrate status. The AI states: rifampicin is a potent CYP3A4 inducer; lorlatinib is a CYP3A4 substrate; co-administration is expected to significantly reduce lorlatinib plasma exposure based on mechanism. A specific percentage reduction or dose recommendation is excluded from the output.

**Step 4:** The `StaleContextBadge` appears on the lorlatinib-specific claims: "Data as of [last index date] — lorlatinib post-market data may not be reflected."

**Step 5:** The `ConfidenceBadge` renders: "Low confidence — limited published interaction data." The pharmacist hovers: tooltip explains that the only lorlatinib+rifampicin-specific PK data is from a Phase 1 study; post-approval real-world data is not indexed.

**Step 6:** The `LimitationDisclosure` renders below the output: "The AI cannot provide a definitive dosage adjustment recommendation. Published data for this specific combination is limited to a Phase 1 pharmacokinetic study. Post-approval safety reports, if any, are not reflected in the current knowledge index."

**Step 7:** The `SourceList` renders with each claim attributed. The pharmacist can click the manufacturer prescribing information reference (opens externally).

**Step 8:** The `RoleEscalationCard` renders at the bottom: "For a definitive interaction assessment, contact [Manufacturer] Medical Information ([reference — marked TODO: configure per deployment]) or submit a clinical pharmacology consultation request."

**Step 9:** The pharmacist reads the output, reviews sources, and uses the mechanistic data (CYP3A4 induction + substrate interaction confirmed) to inform their recommendation to the prescribing physician: avoid co-administration or seek alternative agents. The pharmacist does not need to activate the role escalation path.

**Step 10:** The interaction is documented in the EHR. The AI session closes.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| Query submitted | User (Tier 2) | T+0s | — | — | Primitives evaluated |
| LC + stale state confirmed | System | T+0.4s | `low-confidence-state`, `stale-context-state` | — | Constrained output path selected |
| Constrained output generated | AI | T+1.8s | `constrained-completion` | `ConstrainedCompletionCard` | Output delivered (no interaction severity rating) |
| Stale badge rendered | System | T+1.8s | `stale-context-state` | `StaleContextBadge` | Rendered on lorlatinib-specific claims |
| Confidence badge rendered | System | T+1.8s | `low-confidence-state` | `ConfidenceBadge` | Rendered at detailed depth |
| Limitation disclosure rendered | System | T+1.8s | `limitation-disclosure` | `LimitationDisclosure` | Rendered at detailed depth |
| Source citation rendered | System | T+1.8s | `source-citation` (claim-level) | `SourceList` | 3 claims attributed to 2 sources |
| Role escalation offered | System | T+1.8s | `role-escalation` (offered) | `RoleEscalationCard` | Status: OFFERED — not initiated |
| Source link clicked | User | T+4.2s | — | `SourceList` | Manufacturer prescribing information opened externally |
| Session closed | User | T+7.1s | — | — | Role escalation not initiated |

---

## 9. Recovery Path

No blocking event occurred. The pharmacist received the available evidence and reached a clinical conclusion without needing recovery.

If the role escalation had been initiated and timed out (no response from medical information within SLA), the `RoleEscalationCard` would transition to TIMEOUT and offer:
- `redirect-recovery` (contact manufacturer via an alternative channel)
- `abandon-recovery` (document that definitive AI guidance was not obtainable; use clinical judgment)

---

## 10. Final Outcome

**System state:** Session closed. Constrained output delivered and documented. Audit record created. Role escalation: not initiated.

**User state:** Pharmacist obtained mechanistic pharmacokinetic data. Applied clinical judgment to recommend against co-administration. Escalation to prescribing physician completed outside the AI system.

**Guardrail outcome:** The AI correctly declined to issue a definitive dosage adjustment recommendation (capability boundary enforced), correctly disclosed the evidence gap (limitation disclosure at detailed depth), and correctly kept the pharmacist's workflow unblocked (constrained output delivered — not a safe refusal).

---

## 11. Lessons Learned

**1. Intent = decision-support changes the refusal calculus.** `safe-refusal` would have been the wrong pattern here. The pharmacist needed the mechanistic data. The risk = 3 signal does not automatically require safe refusal — it requires that the AI not take consequential action on its own authority. Since the pharmacist is the actor, `constrained-completion` was correct.

**2. Stale context and low confidence compound, but produce the same pattern response.** Both LC state and stale-context state pointed to `confidence-disclosure` and `limitation-disclosure`. The system did not show two separate disclosures — it showed `LimitationDisclosure` at detailed depth, which encompasses both signals in a single explanation. Deployment teams should configure the LimitationDisclosure to name both the confidence limitation and the staleness reason specifically.

**3. Role escalation offered ≠ role escalation required.** The `RoleEscalationCard` was offered but the pharmacist did not use it. This is correct behavior — the escalation option should always be available for the user to initiate, but the AI should not force an escalation on a decision-support query when the user is qualified to apply the partial information.

**4. Source citation at claim-level is the differentiator for regulated environments.** Presenting one block citation at the end of the output would not allow the pharmacist to assess which claims are well-supported vs. which are from the single Phase 1 study. Claim-level attribution made the confidence variation within the output legible.

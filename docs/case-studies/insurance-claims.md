# Insurance — Claims Processing with Missing Documentation

**Industry:** Insurance
**Primary patterns:** insufficient-information-state, clarification-request, async-review-escalation, repair-recovery
**Decision engine coverage:** Selection engine § II state; State machine § II → CE → repair cascade; Composition § clarification → retry
**Phase:** 5
**Status:** stable

---

## 1. Problem

A property and casualty insurer has deployed an AI claims processing assistant for its adjusters. The system ingests claim submissions, validates documentation against coverage terms, and either approves, routes for adjuster review, or requests additional documentation from the claimant.

The deployment is configured for automated straight-through processing (STP) on claims below a damage threshold, with full adjuster review above. The AI can communicate with claimants directly for documentation requests, but cannot authorize or deny a claim unilaterally.

The risk scenario: a homeowner files a water damage claim. The claim form is submitted with photographs and a contractor damage estimate, but two required documentation elements are absent: the pipe inspection report (required by the policy for water damage originating from within the structure) and proof of prior maintenance (a policy condition for coverage of gradual leak damage). The AI must handle the incomplete submission without either approving an underdocumented claim or incorrectly denying it.

---

## 2. User Request

```
Claimant submission (via digital claims portal):
  Policy: HO-3 Homeowner Policy #[redacted]
  Peril: Water damage — burst pipe, utility room
  Date of loss: [date]
  Submitted: Photographs (14 images), contractor repair estimate ($8,400)
  Missing: Pipe inspection report, maintenance records
```

The AI adjuster assistant processes this on behalf of an adjuster (Tier 2 Power user). The claimant is not directly visible to the AI — the adjuster is the AI's user.

---

## 3. Decision Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 2 (Moderate) | Incorrect claim approval or denial has significant financial and regulatory consequences, but not immediate safety risk |
| P2 — Confidence | Insufficient Information (II) | Two required documentation elements are absent; the AI cannot evaluate coverage applicability without them |
| P3 — Capability | Capable (partial) | AI can document what is present, identify what is missing, and prepare the documentation request; cannot complete coverage determination |
| P4 — Permission | Authorized | Adjuster is authorized for claims processing operations |
| P5 — Policy | No match | No policy rule prohibits this claim type; this is a documentation completeness issue, not a policy exclusion |
| P6 — User Intent | `workflow-automation` | Adjuster is using AI to process a multi-step claims workflow |
| P7 — Business Impact | Medium | Incorrect STP approval = coverage liability; incorrect denial = regulatory complaint |
| P8 — User Authority | Tier 2 (licensed adjuster) | Can make coverage determinations with complete documentation; cannot approve without required documentation |
| P9 — Context Freshness | Fresh | Claim was just submitted |
| P10 — Source Reliability | Low (1) | Documentation present (photographs, estimate) is useful context but not the required evidentiary documentation; pipe inspection and maintenance records are absent |

---

## 4. Decision Engine Execution

**P2 — Confidence = Insufficient Information:** The AI cannot evaluate coverage because two required inputs are absent. This is not low confidence (some relevant data) — it is insufficient information (a required element is absent, not sparse). The distinction matters for recovery: clarification-request is the appropriate refusal, not constrained-completion.

**P10 — Source Reliability = Low:** Photographs and estimates are not the policy-required documentation for this peril type. They provide contextual support but do not satisfy the coverage determination requirements.

**Pattern selection:**
- `insufficient-information-state` activates.
- `clarification-request` is the appropriate refusal pattern — the user (adjuster) can resolve this by obtaining the missing documentation from the claimant.
- `partial-completion` is also applicable: the AI can summarize what documentation is present and what is missing (the completable portion), before the clarification request.
- `async-review-escalation` is offered for the adjuster to queue the claim with a defined follow-up SLA.

**Rules skipped:**
- `policy-refusal`: skipped — this is a documentation gap, not a policy exclusion.
- `safe-refusal`: skipped — the claim is completable with additional documentation.
- `constrained-completion` as primary: skipped — `partial-completion` better represents the situation (some portions completed, specific items excluded pending documentation).

---

## 5. Pattern Sequence

```
insufficient-information-state (two required documents absent)
  ↓
partial-completion (AI completes coverage checklist for present documentation)
  ↓
limitation-disclosure (names exactly what is missing and why each item is required)
  ↓
clarification-request (structured documentation request template for adjuster to send claimant)
  ↓
async-review-escalation (claim queued for documentation follow-up with SLA)
  ↓
[claimant provides documentation]
  ↓
repair-recovery (AI re-ingests new documents and resumes coverage evaluation)
```

---

## 6. Component Sequence

| Order | Component | Reason |
|---|---|---|
| 1 | `UncertaintyIndicator` (insufficient-information state) | Inline indicator on the coverage determination section: "Documentation incomplete — cannot determine coverage" |
| 2 | `PartialCompletionCard` | Delivers the completed portions: policy validation (present), damage type classification (water/pipe burst), estimate review ($8,400 within STP threshold, pending documentation) |
| 3 | `LimitationDisclosure` (detailed depth) | Names exactly what is missing: (1) pipe inspection report — required per policy section [X] for interior water damage; (2) maintenance records — required per policy condition [Y] for gradual damage exclusion evaluation |
| 4 | `ClarificationRequest` (structured) | Pre-populated documentation request template for the adjuster to send to the claimant via the claims portal. Specifies exactly which documents, acceptable formats, and submission instructions |
| 5 | `AsyncReviewStatus` | Claim queued for documentation follow-up. SLA: 14 days. Status: IN_REVIEW |

When documentation is received:
| 6 | `RepairCard` | Adjuster initiates re-evaluation. AI re-ingests documents and resumes coverage determination |

---

## 7. User Journey

**Step 1:** Adjuster opens the new claim in the AI-assisted claims portal. The claim submission is loaded.

**Step 2:** The AI evaluates the submission. II state confirmed — two required documents absent.

**Step 3:** `UncertaintyIndicator` renders on the coverage determination panel: "Incomplete — documentation required."

**Step 4:** `PartialCompletionCard` renders. The adjuster sees what the AI has completed: policy validated (HO-3, active, covers water damage perils), damage classification (interior water damage — pipe burst), estimate within STP threshold. A clear separator marks the excluded section: "Coverage determination — cannot proceed."

**Step 5:** `LimitationDisclosure` renders below the partial completion: "The following required documentation is absent: (1) Pipe inspection report — required under Policy Section [X], Inland Water Peril; (2) Prior maintenance records — required to evaluate the gradual damage exclusion under Policy Condition [Y]. Coverage determination will remain suspended until both items are received."

**Step 6:** `ClarificationRequest` renders with a pre-drafted claimant communication: "We have received your claim and the following documentation is needed to continue processing: [List]." The adjuster reviews, modifies if needed, and sends directly from the portal.

**Step 7:** `AsyncReviewStatus` appears in the adjuster's claims queue: "Claim [#] — awaiting documentation. Submitted [date]. Follow-up due [date + 14 days]."

**Step 8:** Fourteen days later, the claimant submits the inspection report and maintenance records via the portal.

**Step 9:** The `AsyncReviewStatus` updates: "Documentation received. Ready for re-evaluation." The adjuster initiates re-evaluation.

**Step 10:** `RepairCard` renders: "New documentation received. Re-evaluate coverage?" The adjuster clicks Validate. The AI re-ingests the documents and resumes the coverage determination workflow from the point where it was suspended.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| Claim received | Claimant (external) | T+0 | — | — | Submission logged |
| Documentation evaluation | AI | T+0.3s | — | — | Two required documents absent |
| II state confirmed | System | T+0.3s | `insufficient-information-state` | `UncertaintyIndicator` | Rendered on coverage section |
| Partial completion generated | AI | T+1.1s | `partial-completion` | `PartialCompletionCard` | Present documentation evaluated |
| Limitation disclosure rendered | System | T+1.1s | `limitation-disclosure` | `LimitationDisclosure` | Two missing items named with policy references |
| Documentation request prepared | AI | T+1.1s | `clarification-request` | `ClarificationRequest` | Template pre-populated |
| Request sent to claimant | Adjuster (Tier 2) | T+4m22s | `clarification-request` | `ClarificationRequest` | Claimant notified |
| Async review queued | System | T+4m22s | `async-review-escalation` | `AsyncReviewStatus` | SLA set: 14 days |
| Documentation received | Claimant (external) | T+11 days | — | — | Inspection report + maintenance records |
| Async review updated | System | T+11 days | `async-review-escalation` | `AsyncReviewStatus` | Status: DOCUMENTATION_RECEIVED |
| Repair initiated | Adjuster (Tier 2) | T+11 days, 2h | `repair-recovery` | `RepairCard` | Re-evaluation initiated |
| Coverage determination completed | AI | T+11 days, 2h, 40s | — | — | Coverage confirmed; claim approved for adjuster sign-off |

---

## 9. Recovery Path

**Primary recovery:** `repair-recovery` — after documentation is received, the adjuster initiates re-evaluation. The AI re-ingests the new documents and resumes from the suspended step.

**Repair validation:** The AI validates that the received documents satisfy the specific requirements: (1) inspection report — is from a licensed plumber, documents pipe condition at time of loss, confirms sudden burst vs. gradual leak; (2) maintenance records — cover the 12-month period required by the policy condition.

**Rollback condition:** If the received documents are illegible, incomplete, or from an unlicensed inspector, the repair fails. The `RepairCard` transitions to failed state and the clarification-request cycle restarts with specific corrective guidance.

---

## 10. Final Outcome

**System state:** Coverage determination completed. Adjuster reviews AI output and approves claim for payment processing. Audit record: full documentation chain from submission to approval.

**Adjuster state:** Claim processed in 11 days. STP threshold would have been same-day; documentation requirement added 11 days. This is expected and within SLA.

**Guardrail outcome:** AI correctly identified the documentation gap, correctly suspended coverage determination rather than proceeding without required evidence, correctly named the specific missing items with policy references, and correctly offered a structured recovery path (documentation request + async queue) rather than an unstructured "please resubmit."

---

## 11. Lessons Learned

**1. Insufficient information ≠ low confidence.** The II state is about absence, not quality. The documentation gap is binary — the items are either present or not. LC state would have produced a confidence-disclosure with hedged language; II state correctly produced a clarification-request with a specific list. Deployment teams must configure the coverage determination evaluation to distinguish between "I have the data but am unsure" and "the required data is not present."

**2. Partial completion + limitation disclosure should name the policy references, not just the document names.** Telling the adjuster "pipe inspection report missing" is insufficient. Telling them "required under Policy Section [X], Inland Water Peril" gives the adjuster the context to explain the requirement to the claimant and reduces claimant disputes about the documentation request.

**3. Async review with a defined SLA is better than an open-ended pending state.** Placing a claim in a generic "pending" state without a follow-up date creates adjuster workload visibility failures. The AsyncReviewStatus with a 14-day SLA gives the adjuster a deadline and the claims manager a queue to monitor.

**4. Repair recovery requires specific rollback conditions.** The re-evaluation (repair) can fail if the received documents are insufficient. The deployment must configure the AI to validate document quality as part of the repair, not assume all received documents are acceptable. Rollback (returning to clarification-request) is the correct failure path for repair in this context.

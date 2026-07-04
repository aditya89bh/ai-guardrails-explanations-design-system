# Risk Thresholds

**Document type:** Configuration reference
**Consumes:** `docs/decision-flows/decision-primitives.md` § P1
**Phase:** 6
**Status:** stable

---

## Purpose

Defines the five P1 risk levels and the pattern activation thresholds associated with each. Use this document when configuring `riskThresholds` in a deployment policy.

---

## P1 Risk Level Definitions

| Level | Integer | Definition | Examples |
|---|---|---|---|
| None | 0 | No meaningful risk. AI output has no consequential impact. | Informational lookup, FAQ response, navigation assist |
| Low | 1 | Reversible, low-stakes. Incorrect output is correctable without significant cost. | Draft content suggestion, search result ranking, text summarization |
| Moderate | 2 | Recoverable. Incorrect output has meaningful consequences but a defined recovery path exists. | Document draft, form pre-fill, routine data retrieval, claims intake |
| High | 3 | Significant impact. Incorrect output may be irreversible or expensive to recover. Regulatory exposure possible. | Drug interaction information, PII access, PIP generation, spend above threshold, security library selection |
| Critical | 4 | Safety, security, or compliance incident risk. Incorrect output may cause harm, financial loss, or regulatory violation at scale. | Real-time fraud block, industrial process advisory, autonomous financial execution, clinical order |

---

## Pattern Activation by Risk Level

### Risk = 0 (None)
- No warning patterns activate.
- No permission gates activate.
- Explanation patterns are optional.
- Audit: standard (if audit is enabled at all).

### Risk = 1 (Low)
- `inline-warning` may activate (advisory severity).
- `confidence-disclosure` at surface depth may activate.
- No escalation patterns activate.
- Audit: standard.

### Risk = 2 (Moderate)
- `inline-warning` or `ambient-warning` may activate.
- `confidence-disclosure` at standard depth activates for LC/CE/II states.
- `limitation-disclosure` at standard depth.
- `clarification-request` may activate for II state.
- `async-review-escalation` may activate when documentation is missing.
- Audit: standard.

### Risk = 3 (High)
- `blocking-warning` activates when combined with unauthorized permission or policy match.
- `limitation-disclosure` at detailed depth.
- `source-citation` at claim-level required.
- `role-escalation` may activate.
- Passive dismissal = denial is enforced.
- Audit: detailed.

### Risk = 4 (Critical)
- `emergency-escalation` activates when combined with UR state or policy match.
- `policy-refusal` activates on any policy match.
- All other refusal patterns superseded by policy-refusal.
- Audit: critical (all events, all primitives, immutable).
- `unresolvable-state` at Risk = 4 forces abandon-recovery or emergency-escalation — no constrained output.

---

## Industry-Specific Risk Calibration

The same action may carry different P1 values depending on industry context. Deployment teams must configure these mappings in their policy YAML.

| Action type | Healthcare | Financial services | Industrial AI | Developer tools |
|---|---|---|---|---|
| Information lookup | 2 (patient data) | 1 | 1 | 1 |
| Draft document generation | 2–3 (clinical notes) | 2 (compliance docs) | 1 | 1 |
| Transaction execution | 3 | 4 | N/A | N/A |
| Process recommendation | 3–4 (clinical) | 2 | 4 (safety-critical) | 2 |
| Policy/refusal decision | 3 | 4 | 4 | 2 |

---

## Risk and Confidence Interaction

When P1 (Risk) and P2 (Confidence) compound, the resulting pattern activation is governed by both:

| P1 | P2 | Typical outcome |
|---|---|---|
| 3 | High | `blocking-warning` only if policy or permission issue |
| 3 | Low | `constrained-completion` + `confidence-disclosure` (detailed) + `role-escalation` offered |
| 3 | CE | `safe-refusal` + `reasoning-trace` + `alternative-suggestion` |
| 4 | High | `policy-refusal` if policy match; `blocking-warning` if permission gap |
| 4 | CE | `emergency-escalation` (safety/critical contexts) |
| 4 | UR | `emergency-escalation` + `abandon-recovery` — no output |

Refer to `docs/decision-flows/pattern-selection-engine.md` for the full decision table.

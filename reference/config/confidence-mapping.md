# Confidence Mapping

**Document type:** Configuration reference
**Consumes:** `docs/decision-flows/decision-primitives.md` § P2, `docs/decision-flows/state-transition-engine.md`
**Phase:** 6
**Status:** stable

---

## Purpose

Defines the seven P2 confidence states, their threshold boundaries, the components they activate, and the valid state transitions between them. Use this document when configuring `confidenceThresholds` in a deployment policy.

---

## Confidence State Definitions

### High Confidence (HC)
**Score range:** ≥ 0.90 (default; configurable per deployment)
**Component:** None — HC state requires no guardrail disclosure
**Disclosure depth:** None
**Audit:** Standard (state logged but no disclosure event)

The AI's output is reliable and well-supported by available sources. No epistemic disclosure is shown to the user. HC state is the target exit state for all recovery flows.

**Allowed actions:** All actions within capability and permission boundaries.
**Forbidden:** Showing any uncertainty indicator while in HC state.

---

### Moderate Confidence (MC)
**Score range:** 0.70 – 0.89 (default)
**Component:** `ConfidenceBadge` (surface depth, optional for non-critical outputs)
**Disclosure depth:** Surface — badge with brief tooltip
**Audit:** Standard

AI output is reasonably supported but has identifiable limitations. A surface-level confidence badge may render; detailed disclosure is not required unless Risk ≥ 3.

**Allowed actions:** All actions within capability and permission boundaries. Surface confidence badge renders at deployment team's discretion.
**Forbidden:** Treating MC state as equivalent to LC state in pattern selection.

---

### Low Confidence (LC)
**Score range:** 0.50 – 0.69 (default)
**Component:** `UncertaintyIndicator` + `ConfidenceBadge` (detailed depth)
**Disclosure depth:** Detailed — badge + expanded explanation + source attribution
**Audit:** Detailed

AI output has significant uncertainty. Confidence disclosure is mandatory. For Risk ≥ 3, constrained completion is preferred over safe refusal if intent = decision-support.

**Allowed actions:** Constrained completion, clarification request. Output may be delivered with mandatory disclosure.
**Forbidden:** Presenting LC state output as a definitive recommendation without disclosure.

---

### Conflicting Evidence (CE)
**Score range:** N/A — triggered by source conflict detection, not a score threshold
**Component:** `ConflictingEvidenceCard`
**Disclosure depth:** Detailed — side-by-side conflict presentation + reasoning trace
**Audit:** Detailed

Two or more sources with comparable authority make incompatible assertions about the same fact. This is not a confidence score issue — it is a source integrity issue. CE state activates safe-refusal at Risk ≥ 3. CE state cannot be treated as LC state.

**Activation condition (default):** `minSources: 2` contradictory sources + `sustainedWindowSeconds: 0` (immediate for user-initiated queries)
**Allowed actions:** Surface the conflict, document sources, offer alternatives or redirect. Do not produce a recommendation.
**Forbidden:** Constrained completion; hedged recommendation that implies a preference between contradictory sources.

---

### Insufficient Information (II)
**Score range:** N/A — triggered by absence of required input, not a score threshold
**Component:** `UncertaintyIndicator`
**Disclosure depth:** Standard — names exactly what is missing
**Audit:** Standard

A required input element is absent. This is not low confidence — the AI has no basis for evaluation, not sparse evidence. II state activates clarification-request (not constrained-completion).

**Activation condition:** One or more required evaluation inputs are absent.
**Allowed actions:** Partial completion (evaluate what is present), clarification request. Do not proceed to full output.
**Forbidden:** Constrained completion on a required element; treating missing data as low-confidence data.

---

### Stale Context (SC)
**Score range:** N/A — triggered by data age comparison against `staleThresholdDays`
**Component:** `StaleContextBadge`
**Disclosure depth:** Surface (badge) to detailed (explicit limitation disclosure at Risk ≥ 3)
**Audit:** Standard (stale context signal logged with data age)

The AI's information sources are older than the configured freshness threshold. SC state compounds with LC, MC, CE, or II states — it does not replace them. When SC compounds with LC, the LimitationDisclosure must name both the confidence limitation and the staleness reason.

**Activation condition:** Data age > `staleThresholdDays` for any source used in the output.
**Allowed actions:** Proceed with output + stale badge + limitation disclosure naming data age. Role escalation offered at Risk ≥ 3.
**Forbidden:** Producing output without any staleness indicator when SC is active.

---

### Unresolvable (UR)
**Score range:** N/A — triggered by CE state sustaining beyond `unresolvableWindowSeconds`
**Component:** `UnresolvableStateCard`
**Disclosure depth:** Detailed
**Audit:** Critical

A conflicting-evidence state that the AI cannot resolve within the configured monitoring window. UR state forces either emergency-escalation (Risk = 4) or abandon-recovery (Risk < 4). No output is produced in UR state.

**Activation condition:** CE state sustained > `unresolvableWindowSeconds` without evidence resolving the conflict.
**Allowed actions:** Alert operator, initiate emergency escalation, enter abandon-recovery state.
**Forbidden:** Any constrained or partial output; treating UR state as equivalent to LC or CE.

---

## State Transition Diagram

```
HC ←──────────────────────────────────────────── (target for all recovery exits)
│
├── [score drops below high threshold]
↓
MC ←──────────────────────────────────────────── (re-evaluation after clarification)
│
├── [score drops below moderate threshold]
↓
LC ──→ [source conflict detected] ──→ CE ──→ [window expires] ──→ UR
│                                                                    │
├── [required input absent]                                         ├── [Risk=4] ──→ emergency-escalation
↓                                                                    └── [Risk<4] ──→ abandon-recovery
II ──→ [clarification received] ──→ re-evaluate ──→ HC/MC/LC
│
└── [data age > threshold] compounding state:
SC (compounds with LC, MC, CE, II — does not replace)
```

---

## Confidence Threshold Configuration

| Setting | Recommended default | Healthcare | Financial services | Industrial AI |
|---|---|---|---|---|
| `high` | 0.90 | 0.93 | 0.90 | 0.95 |
| `moderate` | 0.70 | 0.75 | 0.70 | 0.80 |
| `low` | 0.50 | 0.55 | 0.50 | 0.60 |
| `unresolvableWindowSeconds` | 300 | 120 | 120 | 30 |
| `staleThresholdDays` | 30 | 7 | 1 | 0 (real-time) |

Industry contexts with higher Risk baselines should use tighter thresholds. Safety-critical deployments (industrial AI) should use extremely short unresolvable windows.

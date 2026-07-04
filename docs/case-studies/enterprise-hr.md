# Enterprise HR — Performance Improvement Plan Letter Generation

**Industry:** Human resources
**Primary patterns:** stale-context-state, ambient-warning, scoped-permission, delegated-permission
**Decision engine coverage:** Selection engine § Permission gate before content generation; Precedence § stale context before confidence; Composition § scoped-permission must precede constrained output
**Phase:** 5
**Status:** stable

---

## 1. Problem

A large enterprise has deployed an AI HR assistant for HR business partners (HRBPs). The assistant can draft HR communications, summarize employee data, generate performance review templates, and assist with process documentation. The deployment operates under strict data access controls: the HRBP role is granted access to employee data within their assigned business units only.

The risk scenario: an HRBP attempts to use the AI to draft a performance improvement plan (PIP) letter for an employee. Two complications arise simultaneously: (1) the employee's most recent performance evaluation data in the HR system is from a review period that ended 7 months ago — pre-dating a manager change and a team restructuring; (2) the employee's current role has moved outside the HRBP's direct scope after a recent reorg. The AI must handle both a data freshness problem and a permission scope violation.

---

## 2. User Request

```
User: Draft a PIP letter for [Employee Name], [Employee ID]. 
Include their last performance scores and reference their current role and manager.
```

Context: The HRBP is assigned to Business Unit A. The employee was in BU-A until 6 weeks ago and is now in BU-B. The last performance data in the system is from 7 months prior (pre-restructuring).

---

## 3. Decision Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 3 (High) | PIP letters have legal implications — incorrectly drafted PIPs using stale data or unauthorized role scope can create wrongful termination exposure |
| P2 — Confidence | Moderate (MC) — degraded by stale context | Performance data exists but is 7 months old; role and manager data reflect pre-reorg state |
| P3 — Capability | Capable (draft generation); incapable (current-state accuracy with stale data) | AI can generate a PIP draft; it cannot accurately reference the employee's current role and manager |
| P4 — Permission | Partially unauthorized | HRBP is authorized for BU-A employees; this employee is now in BU-B — the AI system's permission enforcement detects the scope boundary violation |
| P5 — Policy | Match (deployment-level) | Deployment-level policy: HRBP access is scoped to assigned business units. Access to out-of-scope employees requires delegated permission from BU-B's HRBP or HR leadership |
| P6 — User Intent | `content-generation` | HRBP is requesting a draft HR document |
| P7 — Business Impact | High | PIP with stale or incorrect employee data + unauthorized access = legal risk |
| P8 — User Authority | Tier 2 (HRBP) | Can generate PIPs for in-scope employees; cannot access out-of-scope employees unilaterally |
| P9 — Context Freshness | Stale (SC) | Performance data is 7 months old; role and manager reflect pre-restructuring state |
| P10 — Source Reliability | Medium (2) | Existing performance data is from an authoritative source (HRIS) but is outdated; current-state data for this employee is from BU-B's HRBP scope, which this user cannot access |

---

## 4. Decision Engine Execution

**P5 — Policy, P4 — Permission:** Evaluated first. Deployment-level policy match: employee is out of scope. The scoped-permission gate activates. The AI cannot proceed with full PIP generation without authorization resolution.

**P9 — Context Freshness = Stale:** Stale-context-state activates independently. Even if the permission issue were resolved, the AI must disclose that the performance data is 7 months old and pre-dates the manager change and restructuring.

**Priority resolution:** Both the permission gap and the stale data issue exist simultaneously. The precedence engine applies: permission resolution is higher priority than stale context disclosure. The scoped-permission gate renders first. Stale context is disclosed after permission is resolved, before the draft is generated.

**Pattern selection:**
- `scoped-permission` gate activates — the content generation is blocked pending permission resolution.
- `delegated-permission` is the resolution path — BU-B's HRBP (or HR leadership) must explicitly grant access for the requesting HRBP to act on this employee.
- `ambient-warning` renders (non-blocking) to disclose the stale context issue to the HRBP before they proceed.
- `constrained-completion` is available after permission is resolved — but only for the portions of the PIP that can be generated without current role/manager data.

**Rules skipped:**
- `safe-refusal`: skipped — the task is completable if permission is resolved and data limitations are acknowledged.
- `blocking-warning` (standalone): skipped — the scoped-permission component subsumes the blocking behavior; a separate blocking-warning is redundant.
- `policy-refusal`: not applied — this is a recoverable permission gap, not a categorical policy exclusion.

---

## 5. Pattern Sequence

```
stale-context-state (performance data 7 months old, pre-restructuring)
  + scoped-permission (employee scope boundary violation)
  ↓
scoped-permission gate renders (blocking — pending authorization)
  ↓
delegated-permission request (HRBP initiates request to BU-B HRBP or HR leadership)
  ↓ [authorization granted]
ambient-warning (non-blocking stale context disclosure before draft proceeds)
  ↓
constrained-completion (draft PIP using available data; role/manager fields marked as requiring current data input)
```

---

## 6. Component Sequence

| Order | Component | Reason |
|---|---|---|
| 1 | `ScopedPermissionGate` | Blocks PIP generation — employee is out of requesting HRBP's scope |
| 2 | `DelegatedPermissionRequest` | Sends authorization request to BU-B HRBP or HR leadership for cross-scope access |
| 3 | `StaleContextBadge` (after authorization granted) | Appears on performance data section: "Data as of [7-month-ago date] — pre-restructuring" |
| 4 | `AmbientWarning` (non-blocking) | Banner above draft generation area: "Performance data is 7 months old and pre-dates the employee's current role and manager" |
| 5 | `ConstrainedCompletionCard` | Generates PIP draft with available data; role and manager fields contain explicit placeholders requiring current data input |

---

## 7. User Journey

**Step 1:** HRBP submits the PIP draft request for the out-of-scope employee.

**Step 2:** The AI evaluates permission scope. Employee is in BU-B; requesting HRBP is scoped to BU-A. `ScopedPermissionGate` renders.

**Step 3:** The gate presents: "You do not have direct access to this employee's records — they are currently in [BU-B] under [BU-B HRBP]'s scope. To proceed, you must request access from BU-B's HRBP or from HR leadership."

**Step 4:** The HRBP selects "Request access." The `DelegatedPermissionRequest` is sent to the BU-B HRBP with context: requesting HRBP's identity, reason provided ("PIP initiation — employee was previously under my scope"), and a request expiry (48 hours).

**Step 5:** The BU-B HRBP reviews the request in their notification queue and grants access: "Delegated access granted for [Employee Name], PIP purpose only, expires [date]."

**Step 6:** The `ScopedPermissionGate` resolves. The AI proceeds with PIP generation.

**Step 7:** The `AmbientWarning` banner renders before the draft: "Performance data for this employee is from [7-month-ago date] and reflects their previous role and manager. Current role and manager must be confirmed before submitting the PIP."

**Step 8:** The `StaleContextBadge` renders inline on the performance scores and the previous manager's name.

**Step 9:** `ConstrainedCompletionCard` renders the PIP draft. Role and manager fields are explicitly marked: "[Current role — confirm before use]" and "[Current manager — confirm before use]." Performance scores from the last review period are included with the stale-context indicator.

**Step 10:** The HRBP updates the role and manager fields with current data (verified from the HRIS directly), reviews the draft, and sends for legal review before issuing.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| PIP draft request | HRBP BU-A (Tier 2) | T+0 | — | — | Permission evaluation triggered |
| Scope boundary detected | System | T+0.2s | `scoped-permission` | — | Employee in BU-B; requesting HRBP in BU-A |
| Stale context detected | System | T+0.2s | `stale-context-state` | — | Performance data 7 months old |
| Permission gate rendered | System | T+0.3s | `scoped-permission` | `ScopedPermissionGate` | BLOCKED — awaiting authorization |
| Delegated permission request sent | HRBP BU-A | T+2m14s | `delegated-permission` | `DelegatedPermissionRequest` | Request to BU-B HRBP; expiry: 48h |
| Delegation granted | HRBP BU-B (Tier 2) | T+27m | `delegated-permission` | `DelegatedPermissionRequest` | GRANTED — PIP purpose, expiry set |
| Permission gate resolved | System | T+27m | `scoped-permission` | `ScopedPermissionGate` | RESOLVED — access granted |
| Ambient warning rendered | System | T+27m, 0.3s | `stale-context-state` | `AmbientWarning` | Stale data banner shown |
| Draft generated | AI | T+27m, 2.1s | `constrained-completion` | `ConstrainedCompletionCard` | Draft with placeholders delivered |
| Role and manager updated | HRBP BU-A | T+34m | — | — | Fields corrected with current data |
| Document sent for legal review | HRBP BU-A | T+41m | — | — | PIP exited AI system; legal queue |

---

## 9. Recovery Path

The delegated-permission flow is itself the recovery mechanism for the scoped-permission block. There is no separate "recovery" pattern — the `delegated-permission` resolves the gate and allows the flow to continue.

**If delegation is denied:** The `DelegatedPermissionRequest` transitions to DENIED. A `redirect-recovery` pattern activates: the HRBP is redirected to contact HR leadership for a cross-scope exception or to hand off the PIP initiation to the BU-B HRBP.

**If the 48-hour request expires without response:** `async-review-escalation` activates: the request is escalated to HR leadership, who can either grant or deny on BU-B's behalf.

---

## 10. Final Outcome

**System state:** PIP draft delivered. Access delegation logged with granting HRBP's identity, purpose, scope limitation, and expiry. Stale data disclosure recorded. Constrained output (placeholder fields) documented.

**HRBP state:** Draft received; current role and manager fields manually corrected; document submitted for legal review.

**Guardrail outcome:** Scoped-permission gate correctly blocked unauthorized access to out-of-scope employee data. Stale context disclosure correctly flagged performance data that would have been misleading if used verbatim. Constrained completion correctly produced a usable draft while marking the fields requiring human verification.

---

## 11. Lessons Learned

**1. Two simultaneous guardrail conditions must be resolved in priority order, not simultaneously.** The permission gap and the stale context issue both existed at once, but showing both warnings at the same time before the permission is resolved is confusing. The precedence engine correctly sequenced them: resolve the access gate first, then disclose the data quality issue.

**2. Delegated permission requires scope and expiry.** A "yes/no" delegation is insufficient. The delegation must record: who delegated, for which employee, for which purpose, and with what expiry. Without these, the audit trail cannot reconstruct whether the access was appropriate.

**3. Constrained completion with explicit placeholders is safer than redacting fields.** If the AI had simply omitted the role and manager fields from the draft, the HRBP might not have noticed they were missing. Explicit placeholders like "[Current role — confirm before use]" force the HRBP to actively fill in the fields, reducing the risk of submitting a PIP with incorrect or stale data.

**4. Stale context in HR documents has legal consequences distinct from other domains.** A 7-month-old performance review pre-dating a manager change and restructuring may not be legally defensible as a PIP basis. The ambient warning must name the specific risk (data pre-dates manager change and restructuring) rather than just stating the data age.

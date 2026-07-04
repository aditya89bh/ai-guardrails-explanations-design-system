# Decision Primitives

**Document type:** Decision engine — foundational layer
**Phase:** 3
**Status:** stable

---

## Purpose

Decision primitives are the atomic input variables that every pattern-selection rule, precedence rule, state-transition rule, and composition rule in this design system reads from. Before the system can determine which guardrail patterns to activate — and in what order — it must evaluate a defined set of primitives against the current interaction context.

Every primitive has a type (categorical, ordinal, boolean, or scalar), a defined set of allowed values, and a specified influence on pattern selection. Primitives are not configured by the user; they are computed by the AI system from the interaction context, deployment configuration, and runtime state.

This document defines all ten decision primitives. Downstream engines — pattern selection, precedence, state transition, composition — reference these primitives by name and value.

---

## Primitive Index

| ID | Primitive | Type | Used in |
|---|---|---|---|
| P1 | Risk | Ordinal (5-level) | Selection, Precedence, Composition |
| P2 | Confidence | Scalar + Ordinal | Selection, State Transition |
| P3 | Capability | Boolean per action type | Selection, Precedence |
| P4 | Permission | Categorical | Selection, Composition |
| P5 | Policy | Boolean per rule | Precedence, Selection |
| P6 | User Intent | Categorical | Selection, Composition |
| P7 | Business Impact | Ordinal (3-level) | Precedence, Composition |
| P8 | User Authority | Ordinal role level | Selection, Precedence |
| P9 | Context Freshness | Boolean per threshold | Selection, State Transition |
| P10 | Source Reliability | Ordinal (4-level) | State Transition, Selection |

---

## P1 — Risk

**Meaning:** The combined assessment of the potential harm severity of an action or output, the probability that harm will occur, and the reversibility of the outcome if harm does occur.

**Type:** Computed ordinal, 5 levels.

**Computation:**

```
Risk = f(severity, probability, reversibility)
```

Where:
- `severity` = maximum plausible harm to any affected party (user, third party, organization, public)
- `probability` = likelihood that harm occurs given the action is taken
- `reversibility` = whether the harm can be undone; irreversible harm scales risk upward

Risk is not additive — a single dimension at the maximum level (e.g., irreversible critical-severity harm at any probability) overrides lower scores in other dimensions.

**Allowed values:**

| Level | Label | Meaning |
|---|---|---|
| 0 | Negligible | No meaningful harm scenario; error is self-correcting |
| 1 | Low | Minor, reversible impact; user can recover without assistance |
| 2 | Moderate | Significant but reversible impact; user needs AI or support assistance to recover |
| 3 | High | Significant or partially irreversible impact; may affect third parties |
| 4 | Critical | Irreversible impact; affects safety, legal standing, financial solvency, or life |

**Influence on pattern selection:**

| Risk level | Minimum pattern activation |
|---|---|
| 0 — Negligible | No guardrail required; explanations are optional |
| 1 — Low | Inline warning or confidence disclosure |
| 2 — Moderate | Modal warning or structured uncertainty disclosure + permission gate |
| 3 — High | Blocking warning + permission gate + explanation required |
| 4 — Critical | Safe refusal OR emergency escalation; no autonomous AI action permitted |

**Related patterns:** Inline warning, modal warning, blocking warning, policy warning, safe refusal, emergency escalation.

---

## P2 — Confidence

**Meaning:** The AI system's computed assessment of the reliability of its output or action for the current query, expressed as a normalized score against a domain-specific and output-type-specific threshold.

**Type:** Scalar (0.0–1.0 normalized score) + derived ordinal state.

**Computation:** Confidence is computed per output element and rolled up to an overall interaction confidence level. The rollup rule: the minimum element-level confidence determines the interaction-level confidence state unless the low-confidence element is explicitly excluded from the output (partial completion applied).

**Score-to-state mapping:**

| Score range | Confidence state | Pattern category activated |
|---|---|---|
| ≥ configured high threshold | High Confidence | No uncertainty pattern; passive indicator only |
| > low floor, < high threshold | Moderate Confidence | Confidence disclosure (contextual depth) |
| ≤ configured low floor | Low Confidence | Confidence + limitation disclosure; restriction applies |
| Undefined (no basis) | Insufficient Information | Limitation disclosure; clarification request |
| Conflicting sources | Conflicting Evidence | Source citation (claim-level) + reasoning trace |
| Irreducibly unreliable | Unresolvable | Limitation disclosure (detailed) + refusal or escalation |

Thresholds are deployment-configurable per output type and domain. The pattern system does not prescribe specific numeric thresholds.

**Influence on pattern selection:**
- High confidence: permits autonomous AI action for low-risk tasks
- Moderate confidence: activates explanation patterns; does not block action
- Low confidence: activates explanation + permission patterns; restricts consequential actions
- Unresolvable: activates refusal or escalation paths regardless of other primitives

**Related patterns:** High confidence state, moderate confidence state, low confidence state, conflicting evidence state, insufficient information state, unresolvable state; confidence disclosure, limitation disclosure, structured uncertainty disclosure.

---

## P3 — Capability

**Meaning:** A per-action-type boolean indicating whether the AI system has the technical capability to fulfill the requested action in its current deployment configuration. Capability is separate from permission (what is authorized) and confidence (how reliable).

**Type:** Boolean per action type.

**Allowed values:** `capable` / `incapable`

**Incapability sources:**
- The action type is not in the AI's deployed function set (e.g., real-time web retrieval in a closed deployment)
- The action requires access to a data source or system the AI is not connected to
- The action requires a modality the AI does not support (e.g., image generation in a text-only deployment)
- The action requires computation or memory beyond the deployment's operational limits

**Influence on pattern selection:**

| Capability | Action |
|---|---|
| `capable` | Capability does not constrain pattern selection |
| `incapable` | Alternative suggestion refusal activates; redirect recovery offered |

**Important distinction:** If the AI is `capable` but not permitted (P4) or restricted by policy (P5), the appropriate pattern is a permission gate or policy refusal — not an alternative suggestion driven by capability.

**Related patterns:** Alternative suggestion, clarification request, limitation disclosure, redirect recovery.

---

## P4 — Permission

**Meaning:** The authorization state for the current action relative to the requesting user's role, session state, and previously granted permissions.

**Type:** Categorical.

**Allowed values:**

| Value | Meaning |
|---|---|
| `authorized` | The user holds a valid, in-scope permission grant for this action |
| `session-authorized` | A session-scoped permission was granted earlier in this session |
| `persistent-authorized` | A persistent permission grant covers this action for this user |
| `delegated-authorized` | A delegated permission from an authority covers this action |
| `unauthorized` | No valid permission grant exists for this action |
| `pending` | A permission grant request has been submitted; outcome is awaited |
| `revoked` | A prior permission grant was revoked; the action is blocked |

**Influence on pattern selection:**

| Permission value | Minimum pattern activation |
|---|---|
| `authorized` / `session-authorized` / `persistent-authorized` / `delegated-authorized` | No permission gate required; action may proceed |
| `unauthorized` | Permission gate required; gate type determined by risk (P1) and business impact (P7) |
| `pending` | Action is held; user is informed of pending status |
| `revoked` | Policy refusal or hard permission gate required; action is blocked |

**Gate type selection by risk:**
- Risk ≤ 1: one-time permission gate
- Risk 2: modal warning + one-time permission gate
- Risk 3: blocking warning + scoped or delegated permission gate
- Risk 4: hard block; permission alone cannot unblock (safe refusal or emergency escalation applies)

**Related patterns:** One-time permission, session permission, persistent permission, scoped permission, delegated permission, revocation; modal warning, blocking warning.

---

## P5 — Policy

**Meaning:** A boolean evaluated per configured policy rule, indicating whether the current request matches a defined organizational, regulatory, or platform policy prohibition or requirement.

**Type:** Boolean per rule. A request may match multiple rules simultaneously.

**Allowed values:** `match` / `no-match` per rule.

**Policy sources (in priority order):**
1. Platform-level policy — applies across all tenants; not overridable by tenant or user configuration
2. Tenant-level policy — configured per organization; overridable by tenant administrators within platform limits
3. Deployment-level policy — configured per AI deployment; overridable by deployment administrators within tenant limits
4. Role-level policy — applies to users in a specific role within a deployment

When multiple policy rules match, the most restrictive rule governs.

**Influence on pattern selection:**

| Policy match | Pattern activation |
|---|---|
| Platform-level `match` | Policy refusal (unconditional; no override path available to users) |
| Tenant-level `match` | Policy refusal with tenant-administrator override path |
| Deployment-level `match` | Policy refusal with deployment-administrator override path |
| Role-level `match` | Policy refusal with role-escalation path |
| `no-match` on all rules | Policy does not constrain pattern selection |

**Policy takes precedence over all other primitives** when it evaluates to `match`. A high-confidence, fully authorized, low-risk request that matches a policy prohibition is still refused.

**Related patterns:** Policy refusal, policy warning, manual override recovery, role escalation, delegated permission.

---

## P6 — User Intent

**Meaning:** A categorical classification of what the user is attempting to accomplish, derived from the request, session context, and user history. Intent determines which pattern categories are relevant and which are not.

**Type:** Categorical.

**Allowed values:**

| Value | Meaning |
|---|---|
| `information-retrieval` | User is seeking information, explanation, or analysis |
| `content-generation` | User is requesting the AI to create or draft something |
| `action-execution` | User is requesting the AI to take an action with external effects |
| `decision-support` | User is seeking AI assessment to inform a human decision |
| `workflow-automation` | User is delegating a multi-step process to the AI |
| `system-configuration` | User is configuring or modifying AI or system behavior |
| `clarification` | User is providing additional context or correcting a prior interaction |

**Influence on pattern selection:**

| Intent | Pattern categories most likely to activate |
|---|---|
| `information-retrieval` | Explanation, Uncertainty |
| `content-generation` | Warning, Explanation, Permission |
| `action-execution` | Warning, Permission, Escalation |
| `decision-support` | Explanation, Uncertainty, Warning |
| `workflow-automation` | Permission, Escalation, Recovery |
| `system-configuration` | Policy, Permission, Escalation |
| `clarification` | Uncertainty (exit), Recovery (entry) |

**Related patterns:** All categories; intent is used to narrow the selection space, not to determine a single pattern.

---

## P7 — Business Impact

**Meaning:** An ordinal assessment of the operational, financial, reputational, or compliance consequences if the current action produces an incorrect, unauthorized, or harmful result.

**Type:** Ordinal, 3 levels.

**Allowed values:**

| Level | Label | Meaning |
|---|---|---|
| 1 | Low | Error is recoverable without significant cost; impact is local to the current task |
| 2 | Medium | Error requires meaningful remediation; may affect third parties or have financial/reputational cost |
| 3 | High | Error has significant operational, financial, legal, or safety consequences; remediation is costly or impossible |

**Influence on pattern selection:**

Business impact interacts with risk (P1) to determine permission gate type and explanation depth:

| Risk level | Business impact | Minimum permission gate |
|---|---|---|
| 0–1 | Any | No gate required |
| 2 | Low | One-time gate |
| 2 | Medium–High | Modal warning + one-time gate |
| 3 | Low–Medium | Blocking warning + scoped gate |
| 3 | High | Blocking warning + delegated gate |
| 4 | Any | Safe refusal or emergency escalation |

**Related patterns:** One-time permission, scoped permission, delegated permission, blocking warning, modal warning.

---

## P8 — User Authority

**Meaning:** An ordinal representation of the requesting user's organizational role level, used to determine which actions they are permitted to take unilaterally and which require escalation to a higher authority.

**Type:** Ordinal role level. The specific role hierarchy is defined in deployment configuration; the pattern system uses a normalized 5-tier model.

**Allowed values:**

| Tier | Example roles | Default authority scope |
|---|---|---|
| 1 — End user | Individual contributor, standard employee | Standard task execution; no override authority |
| 2 — Power user | Team lead, department lead, licensed professional | Extended task scope; limited override authority |
| 3 — Manager | Department manager, compliance reviewer | Approval authority within department budget and scope |
| 4 — Administrator | System administrator, compliance officer, legal counsel | Configuration authority; policy exception authority |
| 5 — Executive | C-suite, board, regulatory authority | Organizational authority; platform-level exception authority |

**Influence on pattern selection:**

| User authority tier | Escalation routing |
|---|---|
| Tier 1 | Most consequential actions route to Tier 2–3 |
| Tier 2 | Can self-authorize some actions that Tier 1 cannot; others route to Tier 3–4 |
| Tier 3 | Can authorize department-level exceptions; platform exceptions route to Tier 4–5 |
| Tier 4 | Can authorize most exceptions; platform-level policy prohibitions route to Tier 5 |
| Tier 5 | Cannot override platform-level policy prohibitions (P5, platform-level match) |

**Related patterns:** Role escalation, delegated permission, manual override recovery, human handoff (escalation).

---

## P9 — Context Freshness

**Meaning:** A boolean per configured threshold, indicating whether the primary information sources used to generate the AI's output are within the acceptable age window for the current output type and deployment context.

**Type:** Boolean per threshold. Each output type has an independently configured freshness threshold in the deployment.

**Allowed values:** `fresh` / `stale` per threshold.

**Threshold determination factors:**
- Output type (regulatory guidance requires fresher data than general industry knowledge)
- Domain (financial market data requires minutes; general reference data may tolerate years)
- Deployment configuration (tenant-level threshold overrides are permitted within platform limits)
- Dynamic signals (if a major domain event has occurred since the data was indexed, stale may trigger regardless of configured age)

**Influence on pattern selection:**

| Freshness value | Pattern activation |
|---|---|
| `fresh` | No freshness-driven pattern required |
| `stale` | Stale context state activates; confidence disclosure at contextual depth required; time-sensitive elements require explicit verification guidance |

**Stale + Risk interaction:** Stale context at Risk level 3–4 triggers a blocking warning in addition to the stale context state disclosure. The user cannot proceed with a consequential action based on stale data without a blocking warning and permission gate.

**Related patterns:** Stale context state, ambient warning, inline warning, blocking warning.

---

## P10 — Source Reliability

**Meaning:** An ordinal assessment of the quality, authority, and corroboration status of the information sources the AI used to generate its output. Source reliability is distinct from confidence (which is about output accuracy) — a source can be highly authoritative but still produce low-confidence output if it is ambiguous or sparse for the specific query.

**Type:** Ordinal, 4 levels.

**Allowed values:**

| Level | Label | Meaning |
|---|---|---|
| 0 | None | No sources used (AI generated from training alone, no retrieval) |
| 1 | Low | Sources present but tangentially relevant, significantly dated, or not corroborated |
| 2 | Medium | Sources are relevant and recent but not from a primary authoritative source; some corroboration |
| 3 | High | Sources are primary, authoritative, current, and corroborated across multiple independent sources |

**Influence on pattern selection:**

| Source reliability | Pattern activation |
|---|---|
| 0 — None | Limitation disclosure required; source citation not applicable |
| 1 — Low | Confidence disclosure (contextual depth) + source citation (list depth minimum) |
| 2 — Medium | Confidence disclosure (surface depth) + source citation (list depth) |
| 3 — High | Source citation (list depth) optional based on output type; confidence disclosure optional |

**Source reliability interacts with confidence (P2):** If sources are high reliability but confidence is still low (the query is specific enough that even authoritative sources are sparse), both the source citation and the limitation disclosure must be shown — the user needs to understand that the limitation is in the query's specificity, not the source quality.

**Related patterns:** Confidence disclosure, source citation, reasoning trace, limitation disclosure, conflicting evidence state.

---

## Primitive Evaluation Order

Decision primitives are evaluated in the following order before pattern selection begins:

1. **P5 — Policy** evaluated first. A policy match triggers a deterministic refusal path and halts further evaluation for the matched rule.
2. **P3 — Capability** evaluated second. Incapability triggers alternative suggestion or clarification request.
3. **P4 — Permission** evaluated third. Authorization state determines whether a permission gate is required.
4. **P1 — Risk** + **P7 — Business Impact** evaluated jointly to determine gate type and explanation depth.
5. **P2 — Confidence** + **P9 — Context Freshness** + **P10 — Source Reliability** evaluated jointly to determine uncertainty state and explanation pattern depth.
6. **P8 — User Authority** evaluated to determine escalation routing if triggered by earlier primitives.
7. **P6 — User Intent** used throughout to narrow the pattern selection space.

If P5 matches (step 1), steps 2–7 are still evaluated to determine whether any partial completion or redirect recovery path is available alongside the refusal.

# Frequently Asked Questions

---

## General

**What is this design system and why does it exist?**

Most AI design systems cover visual components but ignore the logic of trust, safety, and refusal. This system fills that gap. It defines when and how AI should warn users, explain its reasoning, request permission, express uncertainty, refuse requests, escalate to humans, and help users recover — with deterministic decision logic, not vague principles.

**Is this a UI component library?**

It includes UI component specifications and reference implementations, but it is primarily a decision system. The component library is Layer 5 of a 6-layer architecture. The decision engine (Layer 3) is the most important part — it determines which components activate and when.

**What programming languages and frameworks does it support?**

The design system is framework-agnostic. Reference implementations are provided in React (`reference/react/`) and Next.js (`reference/nextjs/`). The component specifications and JSON schemas can be implemented in any framework.

**Can I use this for non-AI products?**

The patterns were designed specifically for AI system interactions but several — particularly warning patterns, permission gates, and recovery flows — apply to any high-stakes software interaction. The decision primitives, however, are AI-specific.

**Is this compatible with existing design systems?**

Yes. This system adds an AI-specific guardrail layer on top of your existing design system. It does not replace visual foundations (typography, color, spacing). Its design tokens are namespaced under `--guardrail-*` to avoid conflicts.

---

## Decision Engine

**What are decision primitives?**

Ten inputs (P1–P10) that the AI system evaluates at request time and passes to the decision engine. They describe: Risk, Confidence, Capability, Permission, Policy, Intent, Business Impact, Authority, Context Freshness, and Source Reliability. Full definitions in [docs/glossary.md](glossary.md).

**How does the engine decide which patterns to activate?**

The engine evaluates 14 selection rules in priority order. Each rule tests primitive values. When a rule's conditions are met, it activates a set of patterns and may suppress others. After selection, composition constraints enforce mutual exclusion rules. The full logic is in [docs/decision-flows/pattern-selection-engine.md](decision-flows/pattern-selection-engine.md).

**Can multiple patterns activate simultaneously?**

Yes, but with constraints. Multiple patterns from different categories can activate together (e.g., a warning + a refusal + a recovery prompt). However, only one pattern per category may render simultaneously — one warning, one refusal, one recovery. Escalation patterns have additional precedence rules.

**What is the difference between LC (Low Confidence) and CE (Conflicting Evidence)?**

This is the most important distinction in the system. LC means the AI has sparse or weak evidence — it is confident in its epistemic limitations. CE means two sources with comparable authority make incompatible claims — the conflict is structural, not a score.

LC with decision-support intent allows `constrained-completion`. CE forbids it at Risk≥3 — recommending based on one source while another contradicts it is a forbidden antipattern.

**Why does the engine use P6 Intent to choose between `constrained-completion` and `safe-refusal` under LC?**

The key distinction is whether the user makes the final decision. Under `decision-support` intent (e.g., a physician reviewing AI recommendations), the user applies their own expertise to the AI's output — so constrained output is valuable even under uncertainty. Under `action-execution` intent (e.g., an agent executing a transaction), the AI acts on the user's behalf — so acting under uncertainty is unsafe.

**What is early termination?**

Two rules terminate evaluation: R01 (Policy Block, when P5 = tenant or deployment) and R02 (Unresolvable + Critical, when P2 = unresolvable and P1 = 4). When either activates, all subsequent rules are skipped. This ensures policy authority is absolute and safety-critical conditions are handled without interference from lower-priority rules.

**Can the engine output "no guardrails"?**

Yes. When P2 = high, P4 = authorized, P5 = none, and P1 is low, only the `high-confidence-state` pattern activates (which produces no visible component). No guardrails are rendered. This is the correct outcome — surfacing warnings when none are needed degrades trust.

---

## Patterns

**What is the difference between `blocking-warning` and `policy-warning`?**

Both are blocking severity. `blocking-warning` activates when P4 = unauthorized at Risk≥3. `policy-warning` activates when P5 = deployment or tenant. The distinction: `blocking-warning` communicates a capability or authorization limit; `policy-warning` names the specific policy rule that applies.

**When should I use `safe-refusal` versus `constrained-completion`?**

Use `safe-refusal` when:
- P2 = conflicting and P1 ≥ 3 (CE state — no output possible)
- P2 = low and P6 = action-execution (agent must not act under uncertainty)
- P2 = unresolvable (no output possible)
- P3 = incapable (hard capability boundary)

Use `constrained-completion` when:
- P2 = low and P6 = decision-support and P3 ≠ incapable (user makes the final decision)
- P2 = insufficient (partial information available — but clarification-request should accompany it)

**What is the difference between `human-handoff` as a refusal pattern and as an escalation pattern?**

Both route to a human operator. As a refusal pattern, `human-handoff` means the AI cannot resolve the request and transfers the interaction. As an escalation pattern (listed as `human-handoff-escalation` in the taxonomy), it is triggered by risk thresholds independently of the refusal decision — the AI may still provide output while escalating.

**Must I implement all 36 patterns?**

No. A minimal deployment might include only 5–8 patterns covering your common use cases. However, any pattern you do implement must conform to its specification. Partial conformance is not permitted — if you implement `blocking-warning`, the passive-dismissal = denial invariant must be enforced.

**How do I handle a pattern my platform cannot render?**

If a pattern activates but your platform cannot render it, fall back to the next pattern in the precedence order that you can render, and note the fallback in your audit record. Never silently suppress a critical-severity pattern.

---

## Components

**What ARIA roles do guardrail components use?**

| Severity | Role | aria-live |
|---|---|---|
| Informational | `role=status` | `polite` |
| Advisory | `role=status` | `polite` |
| Caution | `role=alert` | `polite` |
| Blocking | `role=alertdialog` | `assertive` |
| Critical | `role=alertdialog` | `assertive` |

**What is deny-first tab order?**

On permission gates, the Deny button must receive initial keyboard focus and appear first in the tab sequence. This prevents users from accidentally granting permission by pressing Tab → Enter reflexively.

**What happens when a user presses Escape on a permission gate?**

Passive dismissal (Escape, backdrop click, or any action that closes the gate without explicitly clicking Grant) is always treated as denial. The interaction logs a `PERMISSION_DENIED` event.

**Does the playground use focus traps?**

The reference implementations in `reference/react/` include focus traps on blocking and critical components. The playground versions are adapted for demo purposes (contained in a panel, not full-screen) and do not use focus traps.

---

## Implementation

**How do I configure the engine for my industry?**

Copy the closest YAML config from `reference/yaml/` and adjust the thresholds for your deployment. Common adjustments:

- `riskThresholds` — at what P1 level each severity activates
- `confidenceThresholds.high` — what score qualifies as high confidence
- `staleThresholdDays` — how old data must be before marking as stale
- `policyRules` — domain-specific blocking rules (AML, clinical safety, etc.)

Validate your config against `reference/json/guardrail-policy.schema.json`.

**How do I propagate the auditId across layers?**

Generate the `auditId` when the engine evaluates primitives. Pass it as a prop to every component that renders. Log it in every audit event that results from that evaluation. This enables tracing any component interaction back to its engine evaluation.

**Can I override the engine's pattern selection in code?**

You can configure thresholds and policy rules — that is the intended customization mechanism. Overriding the selection logic itself in application code breaks the guarantees the engine provides and should not be done.

**How do I handle multi-tenant deployments?**

Each tenant gets its own policy document (policy level = tenant). Tenant-level policy rules take precedence over deployment-level rules. The `tenantId` is included in all audit records. See `reference/json/guardrail-policy.schema.json § tenantId`.

---

## Contributing

**Can I propose a new pattern?**

Only if you can demonstrate it is not covered by an existing pattern or combination of patterns. New patterns require: a full specification in the pattern template, classification in the taxonomy, a component specification, and at least one case study demonstrating a scenario it uniquely handles.

**Can I modify the taxonomy?**

No. Taxonomy changes are breaking changes. They require a taxonomy amendment process with cross-reference impact assessment and version bump.

**Can I fork this for internal use?**

Yes — MIT license. If you make improvements, consider contributing them back upstream.

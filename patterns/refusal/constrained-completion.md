# Constrained Completion

**Category:** Refusal state
**Sub-type:** Scope refusal (with modified fulfillment)
**Severity:** Advisory (Level 1) to Caution (Level 2)
**Status:** stable
**Phase:** 2E

---

## Definition

Constrained completion is a refusal pattern in which the AI completes a request but with modifications applied to bring it within acceptable bounds — removing elements that cannot be fulfilled, replacing prohibited content with appropriate alternatives, or narrowing the scope of the output to match what the AI is authorized or capable of producing. Unlike partial completion (which omits portions and explicitly labels the gaps), constrained completion delivers a complete, coherent output that has been adjusted, with the adjustments transparently disclosed.

The key distinction: the user asked for X. Constrained completion delivers a modified version of X, with the modifications declared. The output is usable as-is; the user does not need to go elsewhere to complete it.

---

## Trigger Conditions

Constrained completion is triggered when:

- A request is largely fulfillable but one or more elements require modification to stay within policy, safety, or capability bounds
- The user's goal can be substantially served by a modified version of the output — the modification does not undermine the core value of the task
- Removing or replacing the constrained element produces a coherent, internally consistent output (not a partial output with gaps)
- The modification is non-trivial and must be disclosed — silent modification is a failure mode, not a valid implementation of this pattern

---

## Why Refusal Occurred

In constrained completion, "refusal" refers to the refusal of specific elements, not the whole request. Each modification must be explained:
- What was changed
- Why it was changed (policy, safety, capability, scope)
- Whether the change affects the output's utility in a material way

---

## User Messaging

**Structure:** `[Output — delivered in modified form] + [Disclosure of modifications] + [Why each modification was made] + [Whether the user can request a change]`

**Good examples:**
```
Here is the supplier contract template you requested.

Modifications applied:
• Limitation of liability clause: Capped at 1x annual contract value (your original 
  instruction specified unlimited liability, which exceeds the standard approved 
  by Legal for AI-generated templates)
• Governing law: Left blank with a [GOVERNING LAW — INSERT JURISDICTION] placeholder 
  (jurisdiction selection requires legal review for this contract type)

The rest of the template is ready to use. For the liability cap and governing law, 
coordinate with your Legal team before sending to the counterparty.
```

**Tone:** Transparent and practical. The user should feel that the AI delivered genuine value and was honest about the limitations it applied.

**What to avoid:**
- Modifying the output without any disclosure — silent constraint is deception
- Listing modifications in a way that buries them after a long output, ensuring they are missed
- Applying more constraints than necessary — constrain precisely, not broadly

---

## What Can Still Be Completed

Constrained completion delivers a complete output. What cannot be delivered is the specific unconstrained version of the modified elements. The user must understand:
- Which elements are constrained
- What the constrained version contains instead of the original request
- Whether the constrained version is a safe and usable substitute

---

## Alternatives

For each modified element, the user should know:
- Whether an authorized process exists to obtain the unconstrained version (e.g., a legal review, an escalation path, an elevated-permission request)
- Whether the constraint is absolute (safety, hard policy) or contextual (configured default that may be overridable)
- Whether the user's original specification was a policy violation, a deployment scope issue, or simply a default the user can adjust

---

## Recovery Path

- **User requests override for a constrained element** → If the deployment supports it, route to the appropriate permission gate or escalation path
- **User confirms the constrained version is acceptable** → The task is complete
- **User provides additional context that removes the need for a constraint** → AI re-evaluates and may produce the unconstrained version

---

## Related Uncertainty States

- **Moderate Confidence State** → When a specific element of the output is at moderate confidence and the AI replaces it with a more conservative, higher-confidence formulation, this is constrained completion driven by confidence
- **Stale Context State** → Time-sensitive elements may be replaced with explicit placeholders or ranges rather than specific figures from stale data

---

## Related Permission Patterns

- **Scoped permission** — If the constraint is driven by an access boundary, a scoped permission grant may allow the unconstrained version
- **Delegated permission** — If the unconstrained version requires authorization from a third party (e.g., a legal sign-off on liability language), delegated permission governs the escalation path
- **Persistent permission** — Users who frequently need outputs beyond standard constraints may configure persistent permissions that adjust the default constraint level

---

## Enterprise Audit Considerations

**Audit logging:** Required when the constrained element has policy or compliance implications. Log:
- The original request scope (summary level)
- Each modification applied and the reason
- Whether the user accepted the constrained output or requested an override

**Template governance:** In enterprise deployments where AI generates legal or policy documents, all applied constraints must be traceable to a specific policy rule or configuration setting. Ad hoc constraints applied by the AI without a traceable source are a governance gap.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Silent constraint | Output is modified but no disclosure is made | User acts on a constrained output without knowing it; may be non-compliant or insufficient for its purpose |
| Over-constraining | More elements are modified than necessary; the output no longer serves the user's core need | User cannot use the output; constrained completion becomes an obstacle rather than a solution |
| Constraint without rationale | Modification is disclosed but no reason is given | User cannot evaluate whether the constraint is legitimate or request an appropriate override |
| Constraint applied inconsistently | The same request receives different constraints in different sessions without explanation | User cannot predict AI behavior; trust is undermined |

---

## Example Scenario

**Context:** A marketing manager asks an enterprise AI to generate a case study about a customer success story. The manager provides a real customer name and specific revenue figures the customer shared in a call. The AI's deployment policy prohibits using specific customer revenue figures in externally publishable content without a written consent record — and it cannot verify that consent has been obtained.

**Constrained completion response:**

```
Here is the customer case study for [Company Name].

Constraint applied:
• Revenue figures replaced with percentage-based outcomes ("increased revenue by 34%") 
  rather than specific dollar amounts ("increased revenue from $2.1M to $2.8M"). 
  This is required because specific revenue figures require customer consent 
  documentation before external publication — if consent is on file, the specific 
  figures can be added after Legal confirms.

The rest of the case study — product use case, challenges addressed, and outcomes — is 
ready for review. If you have the consent documentation for the specific figures, 
forward it to Legal and I can include them in a revised version.

[Case study content — ready for review]
```

The manager receives a complete, usable case study. The constraint is disclosed precisely, the reason is given, and the path to the unconstrained version is clear.

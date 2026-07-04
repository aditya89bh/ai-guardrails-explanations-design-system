# Design Principles

These principles govern all pattern decisions in this design system. They are not aspirational values — they are design constraints. When two valid approaches conflict, these principles break the tie.

---

## 1. Decision Logic Comes Before UI

Every guardrail pattern must define *when it activates* before specifying *what it looks like*. A warning without trigger logic is decorative. A refusal without defined conditions is unpredictable.

**Implication:** Pattern specifications are incomplete if they only describe visual treatment. They must describe the decision logic — the conditions, data signals, and system states that cause the pattern to fire.

---

## 2. Friction Must Be Proportional to Consequence

Not every AI action warrants user confirmation. Excessive warnings cause habituation; users learn to dismiss them without reading. Too little friction before irreversible actions causes harm.

**The standard:** The friction imposed by a guardrail pattern must be proportional to the severity and reversibility of the action it gates.

| Action type | Appropriate friction |
|---|---|
| Informational response | No friction; passive disclosure sufficient |
| Reversible action | Soft warning or inline disclosure |
| Irreversible action with moderate impact | Explicit confirmation required |
| Irreversible action with significant impact | Permission gate with audit logging |
| Action affecting third parties | Hard gate with escalation option |

---

## 3. Explanations Must Be Actionable

An AI explanation that a user cannot act on is noise. Explanations should help users make better decisions — understand what the AI did, why, and what they can do next.

**The standard:** Every explanation pattern must include a clear answer to: *What can the user do with this information?*

---

## 4. Uncertainty Is a First-Class State

AI systems that always appear confident mislead users. Expressing uncertainty is not a failure mode — it is a trust-building behavior. Systems must be designed to surface uncertainty clearly, at the right level of granularity, without inducing paralysis.

**The standard:** Uncertainty states are not error states. They are a distinct, designed mode of operation with specific UX and communication requirements.

---

## 5. Refusals Must Be Legible

A user who receives a refusal without explanation cannot improve their request, cannot appeal the decision, and cannot trust the system. Refusals must communicate:
- What was refused and why (at whatever level of disclosure is appropriate)
- Whether the refusal is absolute or contextual
- What the user can do next

**The standard:** A refusal that leaves the user with no path forward is a design failure.

---

## 6. Escalation Is Not Failure

Routing to a human, requesting additional authorization, or pausing for review is not an AI system admitting defeat. It is the correct behavior when the AI's confidence, authority, or scope does not match the task.

**The standard:** Escalation paths must be as well-designed as primary action paths. They are not fallbacks — they are first-class flows.

---

## 7. Recovery Is the Last Impression

After a warning, refusal, error, or escalation, the user must have a clear, dignified path back to productive work. Poor recovery design turns a recoverable situation into user churn.

**The standard:** Every guardrail pattern must pair with a defined recovery flow. Recovery flows are not optional additions — they are part of the pattern specification.

---

## 8. Enterprise Requirements Are Not Edge Cases

Regulated environments, multi-tenant deployments, audit requirements, and compliance constraints are not special cases that patterns are adapted for later. They must be considered in the core design of every pattern.

**The standard:** Patterns that cannot accommodate audit logging, policy overrides, or jurisdiction-specific behavior are incomplete.

---

## 9. Terminology Must Be Consistent

Trust and safety patterns suffer from terminology proliferation — the same concept described as "guardrails", "safeguards", "safety rails", "content filters", and "alignment controls" in different parts of the same product. This creates inconsistent user expectations and complicates engineering ownership.

**The standard:** All patterns use the canonical terms defined in [`docs/taxonomy/index.md`](../taxonomy/index.md). Synonyms are explicitly mapped and discouraged.

---

## 10. Documentation-First, Implementation-Agnostic

This design system is framework-agnostic and stack-agnostic. The primary value is the decision logic and pattern specifications — not any specific implementation.

**The standard:** Pattern specifications must be readable and implementable independently of any specific technology stack. Component specifications are illustrative, not prescriptive.

---

## Applying These Principles

When evaluating a proposed pattern or contribution, check it against these questions:

1. Is the trigger logic defined clearly enough to implement?
2. Is the friction level proportional to consequence?
3. Does any explanation answer "what can I do with this"?
4. Are uncertainty states handled as designed states, not errors?
5. Do refusals provide a path forward?
6. Is escalation well-designed, not an afterthought?
7. Is there a defined recovery flow?
8. Does the pattern accommodate enterprise and regulated requirements?
9. Does the pattern use canonical taxonomy terms?
10. Is the specification implementation-agnostic?

If any answer is "no", the pattern is incomplete.

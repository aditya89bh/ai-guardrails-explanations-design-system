# Case Studies Index

Case studies are annotated reference implementations showing how guardrail patterns are applied in complete product contexts. They demonstrate pattern combinations, edge case handling, and the practical trade-offs that arise in real deployments.

Case studies are implementation-agnostic: they describe the pattern logic and UX decisions, not the specific stack or vendor.

---

## Purpose

Pattern specifications describe what individual patterns do. Case studies show what happens when patterns work together in a real product:

- Which patterns activate together and in what sequence
- How conflicts between patterns are resolved
- What product-specific configuration decisions were made and why
- What the user experience looks like end-to-end
- What went wrong in early versions and how it was corrected

---

## Planned Case Studies

### Chat Assistant Products

| Case Study | Status | File |
|---|---|---|
| Enterprise Q&A assistant — handling out-of-scope questions | 🔲 Planned | `docs/case-studies/chat-assistant/out-of-scope-refusal.md` |
| Customer support AI — uncertainty and escalation to human | 🔲 Planned | `docs/case-studies/chat-assistant/uncertainty-to-escalation.md` |
| Internal knowledge assistant — source citation and confidence disclosure | 🔲 Planned | `docs/case-studies/chat-assistant/source-citation-confidence.md` |
| Regulated-domain chat AI — mandatory disclaimers and scope refusals | 🔲 Planned | `docs/case-studies/chat-assistant/regulated-domain-disclaimers.md` |

### Autonomous Agent Systems

| Case Study | Status | File |
|---|---|---|
| Agentic task runner — permission gates for irreversible actions | 🔲 Planned | `docs/case-studies/autonomous-agents/irreversible-action-gates.md` |
| Multi-step workflow agent — uncertainty states mid-workflow | 🔲 Planned | `docs/case-studies/autonomous-agents/mid-workflow-uncertainty.md` |
| Cross-system agent — escalation when authorization is insufficient | 🔲 Planned | `docs/case-studies/autonomous-agents/authorization-escalation.md` |
| Background agent — surfacing warnings to an asynchronous user | 🔲 Planned | `docs/case-studies/autonomous-agents/async-warning-surface.md` |

### Decision-Support Tools

| Case Study | Status | File |
|---|---|---|
| AI-assisted hiring tool — explanation and adverse decision disclosure | 🔲 Planned | `docs/case-studies/decision-support/hiring-adverse-decision.md` |
| Clinical decision support — uncertainty disclosure and human escalation | 🔲 Planned | `docs/case-studies/decision-support/clinical-uncertainty-escalation.md` |
| Credit decisioning AI — mandatory explanation patterns | 🔲 Planned | `docs/case-studies/decision-support/credit-decision-explanation.md` |
| Risk assessment AI — confidence thresholds and warning patterns | 🔲 Planned | `docs/case-studies/decision-support/risk-confidence-warning.md` |

### Content Generation Systems

| Case Study | Status | File |
|---|---|---|
| AI writing tool — output quality warnings and confidence disclosure | 🔲 Planned | `docs/case-studies/content-generation/quality-warnings.md` |
| Legal document AI — accuracy warnings and UPL refusal | 🔲 Planned | `docs/case-studies/content-generation/legal-accuracy-upl-refusal.md` |
| Code generation AI — security warning patterns | 🔲 Planned | `docs/case-studies/content-generation/code-security-warnings.md` |

---

## Case Study Format

Each case study follows a consistent structure:

```markdown
# [Product Type]: [Specific Scenario]

**Patterns involved:** [list of guardrail pattern names]
**Industry context:** [general | healthcare | finance | legal | government | infrastructure]
**Complexity:** [simple | moderate | complex]

## Product Context
Brief description of the product and the specific deployment context.

## The Scenario
What happens in this case study — the user action or system event that triggers the pattern chain.

## Pattern Chain
Step-by-step walkthrough of which patterns activate, in what order, and why.

## Configuration Decisions
The specific threshold, policy, or variant decisions made in this implementation, and the rationale.

## User Experience Walkthrough
What the user sees and does at each step.

## What Changed Between v1 and v2
Common antipatterns encountered in early versions and how they were corrected.

## Related Patterns
Cross-references to pattern specifications used in this case study.
```

---

## Phase Status

- **Phase 1:** Index scaffold with planned case study list
- **Phase 7:** Full annotated case studies for all categories above

_Total planned case studies: ~15_

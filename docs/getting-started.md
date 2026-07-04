# Getting Started

This guide gets you from zero to a working understanding of the AI Guardrails & Explanations Design System in the shortest path appropriate for your role.

---

## Prerequisites

No tooling is required to read the documentation. To run the interactive playground:

- Node.js 18 or higher
- npm 9 or higher
- A modern browser

---

## Step 1 — Run the Playground (Optional but recommended)

The fastest way to understand the system is to interact with the decision engine:

```bash
git clone https://github.com/your-org/ai-guardrails-explanations-design-system.git
cd ai-guardrails-explanations-design-system/playground
npm install
npm run dev
```

Open `http://localhost:3000`. Try the Healthcare scenario first — it demonstrates the most complete set of guardrail patterns.

---

## Step 2 — Understand the Core Concepts

Before reading the specifications, learn the vocabulary in [docs/glossary.md](glossary.md).

The three foundational concepts:

**Decision Primitives (P1–P10)**
The inputs the engine evaluates. Risk (P1) and Confidence (P2) are the most important. See [docs/decision-flows/decision-primitives.md](decision-flows/decision-primitives.md).

**Patterns**
The outputs the engine selects — 36 named behaviors grouped into 7 categories. Each pattern is a specific response mode (e.g., `safe-refusal`, `constrained-completion`, `emergency-escalation`). See [docs/taxonomy/](taxonomy/).

**Decision Engine**
The deterministic logic that maps primitive values to pattern activations. It has four layers: selection, precedence, composition, and state transitions. See [docs/architecture.md](architecture.md).

---

## Step 3 — Choose Your Entry Point

### I want to implement guardrails in my product

1. Read [docs/architecture.md](architecture.md) — understand the system end to end
2. Find the closest industry config in [reference/yaml/](../reference/yaml/)
3. Copy the config and adjust thresholds for your deployment
4. Implement the components from [reference/react/](../reference/react/)
5. Validate your payloads against [reference/json/](../reference/json/)
6. Use the playground to verify engine behavior for your use cases

### I want to understand the decision logic

1. Read [docs/decision-flows/decision-primitives.md](decision-flows/decision-primitives.md)
2. Read [docs/decision-flows/pattern-selection-engine.md](decision-flows/pattern-selection-engine.md)
3. Open the playground — Rules tab — and load each scenario
4. Read [docs/decision-flows/pattern-composition-engine.md](decision-flows/pattern-composition-engine.md)
5. Read [docs/decision-flows/state-transition-engine.md](decision-flows/state-transition-engine.md)

### I want to adopt specific patterns

1. Browse [docs/taxonomy/](taxonomy/) to find relevant pattern categories
2. Open the pattern specification in [patterns/](../patterns/)
3. Check the component specification in [components/](../components/)
4. See a working implementation in [reference/react/](../reference/react/)
5. Review example payloads in [reference/examples/](../reference/examples/)

### I want to validate an existing implementation

1. Find the closest case study in [docs/case-studies/](case-studies/)
2. Compare your pattern sequence against the case study's documented sequence
3. Validate your audit records against the example payloads in [reference/examples/](../reference/examples/)
4. Run your primitive inputs through the playground and verify the component output matches yours

### I want to contribute

1. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Study [docs/glossary.md](glossary.md) — all contributions must use canonical terminology
3. Review [docs/taxonomy/](taxonomy/) before proposing new patterns
4. Read [docs/principles/](principles/) — contributions that conflict with principles require revision

---

## Step 4 — Key Files to Bookmark

| File | Why it matters |
|---|---|
| [`docs/decision-flows/decision-primitives.md`](decision-flows/decision-primitives.md) | Definitions for all 10 engine inputs |
| [`docs/decision-flows/pattern-selection-engine.md`](decision-flows/pattern-selection-engine.md) | The selection rules that activate patterns |
| [`docs/taxonomy/`](taxonomy/) | Canonical names and categories for all patterns |
| [`reference/yaml/`](../reference/yaml/) | Copy-paste deployment configurations |
| [`reference/react/`](../reference/react/) | Production-ready React component implementations |
| [`reference/json/`](../reference/json/) | JSON schemas for validation |
| [`playground/`](../playground/README.md) | Interactive engine visualization |

---

## Common Mistakes to Avoid

**Treating LC and CE as equivalent**
Low Confidence (LC) and Conflicting Evidence (CE) are distinct P2 states with different pattern requirements. LC allows `constrained-completion` under `decision-support` intent. CE forbids it — `safe-refusal` is required at Risk ≥ 3 because the underlying sources contradict each other. See [docs/decision-flows/state-transition-engine.md](decision-flows/state-transition-engine.md).

**Using `constrained-completion` for action-execution intent under LC**
When P6 = `action-execution` and P2 = `low`, `safe-refusal` is always required. An agent must not execute actions under low confidence.

**Treating passive dismissal as ambiguous**
Closing a permission gate without explicitly granting is always a denial. There is no "dismissed but not denied" state.

**Selecting patterns without checking composition constraints**
Only one warning pattern may render at a time. Only one refusal pattern may render at a time. `emergency-escalation` supersedes all other escalation patterns. Apply the composition engine before rendering.

---

## Next Steps

- [docs/architecture.md](architecture.md) — system overview with Mermaid diagrams
- [docs/glossary.md](glossary.md) — canonical term reference
- [docs/faq.md](faq.md) — answers to common questions
- [docs/troubleshooting.md](troubleshooting.md) — implementation issues and fixes
- [docs/navigation.md](navigation.md) — complete repository map

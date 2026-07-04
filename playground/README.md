# Guardrail Decision Engine — Interactive Playground

An interactive application demonstrating the AI Guardrails & Explanations Design System decision engine. Manipulate decision primitives and observe how the engine selects patterns, activates components, and generates an audit trail in real time.

---

## Purpose

The playground validates the entire repository by making the decision engine observable. It is not a new design artifact — it consumes existing specifications, schemas, and configurations without duplicating logic.

| Consumed artifact | Location |
|---|---|
| Primitive definitions (P1–P10) | `docs/decision-flows/decision-primitives.md` |
| Selection rules | `docs/decision-flows/pattern-selection-engine.md` |
| State transition logic | `docs/decision-flows/state-transition-engine.md` |
| Composition constraints | `docs/decision-flows/pattern-composition-engine.md` |
| Pattern specifications | `patterns/` (all 36 patterns) |
| Component specifications | `components/` |
| JSON schemas | `reference/json/` |
| YAML industry configs | `reference/yaml/` |
| Reference implementations | `reference/react/` |
| Example payloads | `reference/examples/` |

---

## Running Locally

```bash
cd playground
npm install
npm run dev
# Open http://localhost:3000
```

**Requirements:** Node.js 18+, npm 9+.

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Guardrail Decision Engine Playground    [Scenario buttons]   │
├──────────────────┬──────────────────────┬───────────────────┤
│                  │                      │                   │
│   PRIMITIVES     │  DECISION ENGINE     │    RESULT         │
│   P1–P10         │  Rules / Patterns /  │  Rendered         │
│   controls       │  Composition /       │  guardrail        │
│                  │  States / Flow       │  components       │
├──────────────────┴──────────────────────┴───────────────────┤
│                    AUDIT TRAIL                               │
└─────────────────────────────────────────────────────────────┘
```

### Left panel — Decision Primitives

Editable controls for all ten decision primitives:

| Primitive | Type | Control |
|---|---|---|
| P1 Risk | Integer 0–4 | Range slider with pip visualization |
| P2 Confidence | Enum (7 states) | Select dropdown |
| P3 Capability | Enum (3 states) | Select dropdown |
| P4 Permission | Enum (3 states) | Select dropdown |
| P5 Policy | Enum (3 states) | Select dropdown |
| P6 Intent | Enum (4 states) | Select dropdown |
| P7 Business Impact | Enum (3 states) | Select dropdown |
| P8 Authority | Integer 1–3 | Range slider |
| P9 Freshness | Enum (2 states) | Select dropdown |
| P10 Source Reliability | Integer 0–3 | Range slider |

Every change triggers an immediate engine re-evaluation with no debounce.

### Center panel — Decision Engine

Five tabs:

| Tab | Shows |
|---|---|
| **Rules** | Each selection rule with ACTIVATED/SKIPPED/NOT_EVALUATED status, reasoning, activated patterns, and suppressed patterns |
| **Patterns** | Activated patterns grouped by category, primary selections, component sequence |
| **Composition** | Composition constraints applied, violations resolved, global invariants |
| **States** | P2 confidence state machine — current state, valid transitions, prohibitions |
| **Flow** | 5-step pipeline visualization + composition layer (raw → resolved) |

### Right panel — Result

Renders the actual guardrail UI components in activation order. Each component corresponds to an activated pattern. Includes:

- Accessibility metadata (ARIA roles, aria-live regions)
- Design token references
- Specification file links

### Bottom panel — Audit Trail

Chronological log of engine evaluations, scenario loads, and component interactions. Follows the audit event schema in `reference/json/decision-engine.schema.json`.

---

## Example Scenarios

Five predefined scenarios load realistic primitive combinations from the Phase 5 case studies:

| Scenario | Key primitives | Primary outcome |
|---|---|---|
| Healthcare | P1=4, P2=low, P6=decision-support | Constrained completion + full LC disclosure stack |
| Finance | P1=4, P5=tenant | Policy refusal + emergency escalation (early termination) |
| Developer Copilot | P2=conflicting, P1=3 | Safe refusal + reasoning trace + source citation |
| Industrial AI | P2=unresolvable, P1=4 | Emergency escalation + abandon recovery |
| Customer Support | P2=insufficient | Clarification request → human handoff |

---

## Engine Architecture

The playground engine is a pure JavaScript implementation with no external dependencies beyond React and Next.js.

```
engine/
├── primitives.js     — P1–P10 definitions and label helpers
├── rules.js          — 14 selection rules (R01–R14)
├── evaluator.js      — Main evaluate() function
├── schema-bridge.js  — Maps reference/json/*.schema.json to runtime types
└── config-bridge.js  — Maps reference/yaml/*.yaml to runtime config objects
```

The engine produces a rich output object:

```javascript
{
  primitives: { P1: { value, label, color, description }, ... },
  rules: [ { ruleId, result: 'ACTIVATED'|'SKIPPED'|'NOT_EVALUATED', reason, activatedPatterns, ... } ],
  patterns: [ { id, name, category, severity, specRef } ],
  selections: { warning, refusal, recovery, escalation },
  composition: { violations, appliedConstraints },
  components: [ { component, variant, order, severity, patternId } ],
  meta: { rulesActivated, rulesSkipped, patternsCount, terminatedEarly }
}
```

---

## Key Design Decisions

**No new guardrail concepts.** Every rule, pattern name, category, and component in the playground corresponds to a specification in the repository. The playground visualizes, not invents.

**Deterministic output.** Given the same primitive values, the engine always produces the same result. No randomness, no server state.

**Engine consumes existing artifacts.** `schema-bridge.js` and `config-bridge.js` map the reference JSON schemas and YAML configs to runtime objects without duplicating logic.

**Deny-first tab order on permission gates.** Demonstrated in `PermissionGate.jsx` — the Deny button receives `autoFocus` and appears first in tab order.

**Passive dismissal = denial.** Documented in the component and enforced in the demo interaction model.

---

## File Structure

```
playground/
├── app/
│   ├── layout.jsx          — Root layout with skip-link
│   ├── page.jsx            — Main page, state management
│   └── globals.css         — Design tokens, layout, utilities
├── components/
│   ├── PrimitiveControls.jsx
│   ├── EnginePanel.jsx
│   ├── ResultPanel.jsx
│   ├── AuditPanel.jsx
│   ├── PipelineFlow.jsx
│   ├── StateTransitionViz.jsx
│   ├── CompositionViz.jsx
│   └── guardrail/
│       ├── WarningBanner.jsx
│       ├── ConfidenceBadge.jsx
│       ├── RefusalCard.jsx
│       ├── RecoveryPrompt.jsx
│       ├── PermissionGate.jsx
│       └── EscalationCard.jsx
├── engine/
│   ├── primitives.js
│   ├── rules.js
│   ├── evaluator.js
│   ├── schema-bridge.js
│   └── config-bridge.js
├── data/
│   ├── patterns.js         — 36-pattern registry
│   └── scenarios.js        — 5 example scenarios
├── package.json
├── next.config.js
└── README.md               — This file
```

---

## Accessibility

- WCAG 2.1 AA target
- Skip navigation link (`<a href="#pg-main-content">`)
- All interactive elements have visible `:focus-visible` outlines
- Emergency escalation uses `role=alertdialog` and `aria-live=assertive`
- Permission gate enforces deny-first tab order
- Audit panel uses `aria-live=polite`
- `prefers-reduced-motion` suppresses all transitions
- `forced-colors` media query for high contrast mode

---

## Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0"
}
```

No additional dependencies. No authentication. No backend.

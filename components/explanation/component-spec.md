# Explanation Component Specification

**Implements patterns:** Confidence disclosure, source citation, reasoning trace, decision summary, limitation disclosure, structured uncertainty disclosure
**Phase:** 4
**Status:** stable
**Decision engine reference:** `docs/decision-flows/pattern-selection-engine.md` § Explanation Category Selection

---

## Purpose

Explanation components expose AI transparency information at the depth the user needs — without overwhelming the primary output. They must never be the primary visual element on a screen unless the explanation IS the output (e.g., a reasoning trace requested explicitly by the user).

---

## Component Variants

| Variant | Renders as | User action required | Depth |
|---|---|---|---|
| `confidence-badge` | Small badge or indicator attached to output | None (tooltip on hover/focus) | Surface |
| `source-list` | Expandable list below or beside output | Optional expand | Surface to contextual |
| `reasoning-trace` | Collapsible drawer or panel | Optional expand | Contextual to detailed |
| `decision-summary` | Structured card | Optional section expand | Contextual |
| `limitation-disclosure` | Inline notice or banner | None | Contextual to detailed |
| `uncertainty-card` | Composite card combining confidence, sources, limitations | Optional expand | Detailed |

---

## Anatomy

### ConfidenceBadge

```
[Icon] [Level label] [Numeric indicator, optional]
```

Named parts:
- **confidence-icon** — Icon mapped to `icon-confidence-{level}` token. Required.
- **confidence-label** — Text label: "High confidence", "Moderate confidence", "Low confidence". Required for contextual and detailed depth; may be icon-only for surface depth (with aria-label).
- **confidence-value** (optional) — Numeric percentage or score. Shown only when the deployment configuration permits numeric disclosure.
- **tooltip** — Appears on hover/focus. Explains the confidence level and what it means in context.
- **audit-indicator** — Shown when `auditId` prop is present.

### SourceList

```
[Header: "Sources"]
[Source item 1: icon + label + date + link?]
[Source item 2: ...]
[Expand: "Show N more"]
```

Named parts:
- **source-item** — Each source has a label (required), retrieval date (required when available), relevance signal (optional), and an external link (optional).
- **expand-control** — Shows additional sources beyond the initial limit (default: 3 visible).
- **source-quality-indicator** — Optional visual indicator of source reliability level (maps to P10 — Source Reliability from `decision-primitives.md`).

### ReasoningTrace

```
[Collapsed: "How I arrived at this" + expand icon]
[Expanded:
  Step 1: [Action taken] → [Result]
  Step 2: [Action taken] → [Result]
  ...
  [Conclusion]]
```

Named parts:
- **trace-toggle** — Control to expand/collapse. Uses `icon-expand` / `icon-collapse`.
- **trace-steps** — Ordered list of reasoning steps. Each step has an action and a result.
- **trace-conclusion** — Final summary statement derived from the trace.
- **depth-selector** (optional) — Allows user to switch between summary and detailed trace depth when both are available.

### DecisionSummary

```
[Summary header: what was decided]
[Key factors: bulleted list]
[Confidence: ConfidenceBadge]
[Sources: SourceList (compact)]
[Alternative outcomes: optional section]
```

Named parts:
- **summary-statement** — One-sentence decision output. Required.
- **factor-list** — Key inputs that drove the decision. Required (minimum 1 factor).
- **confidence-badge** — Embedded confidence badge. Required.
- **source-list** — Compact source list. Required when retrieval was used.
- **alternatives-section** — Optional section showing other outcomes considered.

### LimitationDisclosure

```
[Icon] [Limitation message] [Learn more? optional]
```

Named parts:
- **limitation-icon** — Uses `icon-severity-informational` or `icon-severity-advisory` based on severity.
- **limitation-message** — Primary limitation statement. Required.
- **explanation-link** (optional) — Expands or navigates to a more detailed explanation.

### StructuredUncertaintyCard

Composite component that supersedes individual confidence-disclosure and limitation-disclosure when both apply simultaneously (per pattern precedence rules).

```
[Header: "Confidence assessment"]
[ConfidenceBadge]
[Limitation notice]
[SourceList]
[Recommended user action]
```

---

## Input Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | Variant enum (above) | Yes | Determines layout |
| `confidenceLevel` | `'high' \| 'moderate' \| 'low' \| 'insufficient' \| 'conflicting' \| 'unresolvable'` | Confidence variants | Drives icon and label |
| `confidenceValue` | `number` (0–1) | No | Numeric score — shown only if `showNumericConfidence` is true |
| `sources` | `Source[]` | Source variants | Each source: `{ id, label, date, url?, reliabilityLevel }` |
| `traceSteps` | `TraceStep[]` | Reasoning trace | Each step: `{ action, result, stepNumber }` |
| `decisionStatement` | `string` | Decision summary | Required — the one-line decision |
| `factors` | `Factor[]` | Decision summary | Each factor: `{ label, weight?, description? }` |
| `limitationMessage` | `string` | Limitation variants | The limitation description |
| `limitationDepth` | `'contextual' \| 'detailed'` | Limitation variants | Drives disclosure length |
| `auditId` | `string` | No | Associates this disclosure with an audit record |
| `showNumericConfidence` | `boolean` | No (default: false) | Deployment configuration — show numeric score |

---

## Output / Callbacks

| Callback | Trigger | Payload |
|---|---|---|
| `onExpand` | User expands a collapsible section | `{ variant, section, auditId }` |
| `onSourceClick` | User clicks a source link | `{ sourceId, label, url, auditId }` |
| `onMount` | Component renders | `{ variant, confidenceLevel, auditId }` |

---

## States

| State | Visual treatment | Trigger |
|---|---|---|
| `collapsed` | Only header/badge visible | Default for trace, decision summary |
| `expanded` | Full content visible | User expands |
| `loading` | Skeleton/shimmer in content area | Sources or trace loading async |
| `empty` | "No sources available" or "No trace available" message | Required data absent |
| `error` | "Could not load details" with retry option | Async load failed |

---

## Audit Indicator

When `auditId` is present, the audit indicator appears at the bottom-right of the component. For explanation components, the audit indicator signals that the AI's confidence and sourcing state have been logged at the time of this output — critical for regulated environments where output traceability is required.

---

## Related Patterns

- `patterns/explanation/confidence-disclosure.md`
- `patterns/explanation/source-citation.md`
- `patterns/explanation/reasoning-trace.md`
- `patterns/explanation/decision-summary.md`
- `patterns/explanation/limitation-disclosure.md`
- `patterns/explanation/structured-uncertainty-disclosure.md`

## Related Decision Engine Rules

- `docs/decision-flows/pattern-selection-engine.md` § Explanation Category Selection
- `docs/decision-flows/pattern-selection-engine.md` § Structured Uncertainty Disclosure Override
- `docs/decision-flows/pattern-precedence-engine.md` § Explanation Intra-Category Precedence

# Uncertainty Component Specification

**Implements patterns:** All seven uncertainty states
**Phase:** 4
**Status:** stable
**Decision engine reference:** `docs/decision-flows/state-transition-engine.md` § Uncertainty State Machine

---

## Purpose

Uncertainty components make the AI's confidence state legible to users without overwhelming them. They reflect the current state of the uncertainty state machine — but they do not expose the machine's internal structure to users. The user sees a clear signal about reliability and what to do about it; the component does not expose confidence scores unless the deployment explicitly enables this.

---

## Component Variants

| Variant | Active uncertainty state(s) | Interaction |
|---|---|---|
| `indicator` | Any state | Passive badge; tooltip on focus/hover |
| `disclosure-card` | MC, LC, II | Card with explanation and optional next steps |
| `conflict-card` | CE | Two-column evidence comparison |
| `stale-badge` | SC | Timestamp-based badge on output |
| `unresolvable-card` | UR | Terminal card leading to refusal or reframing |

---

## Anatomy

### UncertaintyIndicator (all states)

```
[Confidence-icon] [State label, optional] [Tooltip trigger]
```

Named parts:
- **state-icon** — Maps to `icon-confidence-{high|moderate|low}`. For CE, II, SC, UR states, uses `icon-severity-advisory` or `icon-severity-caution`.
- **state-label** — Short text (e.g., "Moderate confidence", "Stale data", "Limited information"). Required for contextual and detailed depth; icon-only permitted at surface depth with aria-label.
- **tooltip** — On hover/focus: explains the state in one to two sentences. Required for all non-high states.

### ConflictingEvidenceCard

```
[Header: "Conflicting information found"]
[Source A view]  |  [Source B view]
[Claim A: "..."]    [Claim B: "..."]
[Source attribution]
[Recommended action]
```

Named parts:
- **evidence-column-a**, **evidence-column-b** — Side-by-side or stacked (narrow viewport) evidence panels.
- **claim-text** — The specific conflicting claims, verbatim where possible.
- **source-attribution** — Source identifiers for each column (maps to SourceList component).
- **recommended-action** — What the user should do: verify with primary source, provide authoritative input, or proceed with awareness.

### StaleContextBadge

```
[Icon-severity-advisory] [Data as of: {date}] [Refresh? optional]
```

Named parts:
- **staleness-date** — The date of the primary source. Required.
- **freshness-threshold-label** — Optional: the configured threshold (e.g., "Threshold: 30 days"). Only shown when deployment configuration permits.
- **refresh-control** (optional) — If a refresh action is available (the AI can re-retrieve), a "Refresh" button appears. If no refresh is possible, the control is absent.

### UnresolvableStateCard

```
[Header: "Cannot produce a reliable output"]
[Reason: ...]
[What was attempted]
[Next options: Reframe / Escalate / Abandon]
```

Named parts:
- **reason-statement** — Why the output is unresolvable. Required; must be specific.
- **attempted-steps** (optional) — Brief list of what the AI tried.
- **next-options** — Action controls leading to refusal, escalation, or recovery patterns. Required.

---

## Input Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `state` | Uncertainty state enum | Yes | Current state from state machine |
| `confidenceLevel` | `'high' \| 'moderate' \| 'low' \| 'insufficient' \| 'conflicting' \| 'unresolvable'` | Yes | Maps state to display |
| `stateLabel` | `string` | No | Override for the state label text |
| `tooltipContent` | `string` | No | Override for tooltip text |
| `staleness` | `{ asOf: Date, threshold: number }` | Stale badge | Source date and threshold |
| `conflictingEvidence` | `EvidencePair` | Conflict card | Two sources and their claims |
| `unresolvableReason` | `string` | Unresolvable card | Explanation of why unresolvable |
| `nextOptions` | `NextOption[]` | Unresolvable card | Actions: reframe, escalate, abandon |
| `showNumericConfidence` | `boolean` | No (default: false) | Show numeric score in tooltip |
| `auditId` | `string` | No | Links to audit record |

---

## Output / Callbacks

| Callback | Trigger | Payload |
|---|---|---|
| `onNextOptionSelect` | User selects a next option | `{ optionType, state, auditId }` |
| `onRefresh` | User requests data refresh | `{ state, auditId }` |
| `onMount` | Component renders | `{ state, confidenceLevel, auditId }` |

---

## States

| UI State | Trigger | Visual |
|---|---|---|
| `active` | Uncertainty state is current | Normal display |
| `refreshing` | Refresh in progress | Spinner on stale badge |
| `resolved` | State transitions to HC | Component hides or transitions to high-confidence indicator |
| `escalated` | User selected escalate option | Component hands off to escalation component |
| `loading` | Initial async evaluation | Skeleton indicator |

---

## High Confidence State — No Component Required

When the uncertainty state is `high-confidence-state`, no UncertaintyIndicator is required. The absence of a warning or uncertainty indicator is itself a signal of high confidence. If the deployment requires an explicit high-confidence indicator for trust-building purposes, a minimal passive badge using `icon-confidence-high` may be shown at surface depth.

---

## Related Patterns

- `patterns/uncertainty/high-confidence-state.md`
- `patterns/uncertainty/moderate-confidence-state.md`
- `patterns/uncertainty/low-confidence-state.md`
- `patterns/uncertainty/conflicting-evidence-state.md`
- `patterns/uncertainty/insufficient-information-state.md`
- `patterns/uncertainty/stale-context-state.md`
- `patterns/uncertainty/unresolvable-state.md`

## Related Decision Engine Rules

- `docs/decision-flows/state-transition-engine.md` § Uncertainty State Machine
- `docs/decision-flows/pattern-selection-engine.md` § Uncertainty Category Selection
- `docs/decision-flows/pattern-precedence-engine.md` § Uncertainty State Priority
